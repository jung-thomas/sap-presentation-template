#!/usr/bin/env node
/**
 * import-pptx.mjs
 *
 * Converts a PPTX file into a set of PNG slide images and places them in
 * public/imported/<basename>/  ready for use in slides.md with the
 * full-bleed-image or image-slide layout.
 *
 * Pipeline:
 *   1. Use LibreOffice (soffice) to convert PPTX → PDF
 *   2a. If pdftoppm is available: rasterise PDF → PNG with pdftoppm
 *   2b. Else if pdf-to-img is installed: rasterise with the npm package
 *   3. Write output PNGs and a generated Markdown snippet to stdout
 *
 * Requirements (at least one rasteriser must be present):
 *   - LibreOffice:  https://www.libreoffice.org/
 *   - pdftoppm:     ships with poppler-utils (apt install poppler-utils)
 *   - pdf-to-img:   npm install pdf-to-img  (optionalDependency in this repo)
 *
 * Usage:
 *   node scripts/import-pptx.mjs <path-to-file.pptx> [--dpi 150] [--out public/imported]
 */

import { existsSync, mkdirSync, createWriteStream } from 'node:fs'
import { readFile, writeFile, rm } from 'node:fs/promises'
import { basename, extname, join, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { spawn } from 'node:child_process'
import { detectTools } from './lib/detect-tools.mjs'

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = argv.slice(2)
  const opts = { dpi: 150, out: 'public/imported' }
  let pptxPath = null

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--dpi' && args[i + 1]) {
      opts.dpi = parseInt(args[++i], 10)
    } else if (args[i] === '--out' && args[i + 1]) {
      opts.out = args[++i]
    } else if (!args[i].startsWith('--')) {
      pptxPath = args[i]
    }
  }

  return { pptxPath, ...opts }
}

// ---------------------------------------------------------------------------
// Shell helpers
// ---------------------------------------------------------------------------

function run(cmd, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit', ...options })
    child.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${cmd} exited with code ${code}`))
    })
    child.on('error', reject)
  })
}

// ---------------------------------------------------------------------------
// Step 1: PPTX → PDF via LibreOffice
// ---------------------------------------------------------------------------

async function convertToPdf(pptxPath, workDir) {
  console.error(`[import-pptx] Converting ${pptxPath} → PDF with LibreOffice …`)
  await run('soffice', [
    '--headless',
    '--convert-to',
    'pdf',
    '--outdir',
    workDir,
    resolve(pptxPath),
  ])
  const stem = basename(pptxPath, extname(pptxPath))
  const pdfPath = join(workDir, `${stem}.pdf`)
  if (!existsSync(pdfPath)) {
    throw new Error(`LibreOffice did not produce ${pdfPath}`)
  }
  return pdfPath
}

// ---------------------------------------------------------------------------
// Step 2a: PDF → PNG via pdftoppm (poppler)
// ---------------------------------------------------------------------------

async function rasteriseWithPdftoppm(pdfPath, outDir, dpi) {
  console.error(`[import-pptx] Rasterising with pdftoppm at ${dpi} DPI …`)
  const prefix = join(outDir, 'slide')
  await run('pdftoppm', ['-r', String(dpi), '-png', pdfPath, prefix])
  // pdftoppm writes slide-1.png, slide-2.png, … (or slide-01.png etc.)
}

// ---------------------------------------------------------------------------
// Step 2b: PDF → PNG via pdf-to-img (npm optional package)
// ---------------------------------------------------------------------------

async function rasteriseWithPdfToImg(pdfPath, outDir, dpi) {
  console.error(`[import-pptx] Rasterising with pdf-to-img at ${dpi} DPI …`)
  let pdfToImg
  try {
    pdfToImg = await import('pdf-to-img')
  } catch {
    throw new Error(
      'pdf-to-img is not installed. Run: npm install pdf-to-img\n' +
        'Or install LibreOffice + poppler-utils for pdftoppm support.',
    )
  }

  const pdfBytes = await readFile(pdfPath)
  const doc = await pdfToImg.pdf(pdfBytes, { scale: dpi / 72 })
  let page = 1
  for await (const image of doc) {
    const outPath = join(outDir, `slide-${String(page).padStart(3, '0')}.png`)
    await writeFile(outPath, image)
    page++
  }
}

// ---------------------------------------------------------------------------
// Step 3: Generate Markdown snippet
// ---------------------------------------------------------------------------

function generateMarkdown(slug, pngFiles) {
  const slides = pngFiles
    .map((f) => {
      const src = `/imported/${slug}/${basename(f)}`
      return `---\nlayout: full-bleed-image\n---\n\n![Imported slide](${src})\n`
    })
    .join('\n')

  return `<!-- BEGIN imported slides: ${slug} -->\n${slides}\n<!-- END imported slides: ${slug} -->\n`
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const { pptxPath, dpi, out } = parseArgs(process.argv)

  if (!pptxPath) {
    console.error('Usage: node scripts/import-pptx.mjs <file.pptx> [--dpi 150] [--out public/imported]')
    process.exit(1)
  }

  if (!existsSync(pptxPath)) {
    console.error(`[import-pptx] File not found: ${pptxPath}`)
    process.exit(1)
  }

  const tools = await detectTools()

  if (!tools.soffice) {
    console.error(
      '[import-pptx] LibreOffice (soffice) is not installed or not in PATH.\n' +
        'Install from https://www.libreoffice.org/',
    )
    process.exit(1)
  }

  if (!tools.pdftoppm) {
    console.error(
      '[import-pptx] pdftoppm not found; will attempt pdf-to-img npm package …',
    )
  }

  // Prepare output directory
  const slug = basename(pptxPath, extname(pptxPath))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
  const outDir = resolve(out, slug)
  mkdirSync(outDir, { recursive: true })

  // Work in a temp directory for intermediate PDF
  const workDir = join(tmpdir(), `import-pptx-${Date.now()}`)
  mkdirSync(workDir, { recursive: true })

  try {
    // Step 1 — convert to PDF
    const pdfPath = await convertToPdf(pptxPath, workDir)

    // Step 2 — rasterise
    if (tools.pdftoppm) {
      await rasteriseWithPdftoppm(pdfPath, outDir, dpi)
    } else {
      await rasteriseWithPdfToImg(pdfPath, outDir, dpi)
    }
  } finally {
    // Clean up temp dir (best-effort)
    await rm(workDir, { recursive: true, force: true }).catch(() => {})
  }

  // Collect output PNGs in sorted order
  const { readdirSync } = await import('node:fs')
  const pngFiles = readdirSync(outDir)
    .filter((f) => f.endsWith('.png'))
    .sort()
    .map((f) => join(outDir, f))

  if (pngFiles.length === 0) {
    console.error('[import-pptx] No PNG files produced. Check the rasteriser output above.')
    process.exit(1)
  }

  console.error(`[import-pptx] Done — ${pngFiles.length} slides → ${outDir}`)

  // Emit Markdown snippet to stdout for easy piping
  process.stdout.write(generateMarkdown(slug, pngFiles))
}

main().catch((err) => {
  console.error('[import-pptx] Fatal:', err.message)
  process.exit(1)
})
