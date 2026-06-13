#!/usr/bin/env node
/**
 * extract-brand.mjs — POTX → theme/styles/_extracted/ + theme/public/logos/manifest.yaml
 *
 * Usage: node scripts/extract-brand.mjs [--potx <path>]
 */

import { readFile, writeFile, mkdir, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { extractPotxToTemp, getPotxFile } from './lib/unzip-potx.mjs'
import { parseThemeXml } from './lib/parse-theme.mjs'
import { extractAllLayouts } from './lib/parse-layouts.mjs'
import { extractMedia } from './lib/extract-media.mjs'
import { emitBrandTokensCss } from './lib/emit-tokens.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

function getPotxPath() {
  const idx = process.argv.indexOf('--potx')
  if (idx === -1) return resolve(ROOT, 'SAP_Corp.potx')
  const value = process.argv[idx + 1]
  if (!value || value.startsWith('--')) {
    console.error('--potx requires a path argument')
    process.exit(1)
  }
  return resolve(value)
}

const POTX = getPotxPath()

const OUT_DIR = resolve(ROOT, 'theme/styles/_extracted')
const OUT_MEDIA = resolve(OUT_DIR, 'media/raw')
const OUT_LOGOS_MANIFEST = resolve(ROOT, 'theme/public/logos/manifest.yaml')

async function fileSha256(p) {
  const buf = await readFile(p)
  return createHash('sha256').update(buf).digest('hex')
}

async function main() {
  if (!existsSync(POTX)) {
    console.error(`POTX not found: ${POTX}`)
    process.exit(1)
  }

  console.log(`Extracting from: ${POTX}`)
  const potxHash = await fileSha256(POTX)
  const date = new Date().toISOString().slice(0, 10)

  // Clean and recreate output dirs
  await rm(OUT_DIR, { recursive: true, force: true })
  await mkdir(OUT_MEDIA, { recursive: true })

  const potxTmp = await extractPotxToTemp(POTX)
  try {
    const themeXml = await getPotxFile(POTX, 'ppt/theme/theme1.xml')
    const theme = parseThemeXml(themeXml)
    console.log(`  ${theme.colors.length} colors  |  major font: ${theme.fonts.major}`)

    const layouts = await extractAllLayouts(potxTmp)
    console.log(`  ${layouts.length} slide layouts`)

    const media = await extractMedia(potxTmp, OUT_MEDIA)
    console.log(`  ${media.count} media files`)

    const css = emitBrandTokensCss({
      colors: theme.colors,
      fonts: theme.fonts,
      meta: { potxHash, date }
    })
    await writeFile(resolve(OUT_DIR, 'brand-tokens.css'), css, 'utf-8')

    await writeFile(
      resolve(OUT_DIR, 'layouts.json'),
      JSON.stringify({ potxHash, layouts }, null, 2),
      'utf-8'
    )

    const readme = [
      '# Extracted brand assets',
      '',
      `**Extracted:** ${date}`,
      `**Source POTX:** \`SAP_Corp.potx\``,
      `**POTX SHA-256:** \`${potxHash}\``,
      `**Major font:** \`${theme.fonts.major}\``,
      `**Color count:** ${theme.colors.length}`,
      `**Layout count:** ${layouts.length}`,
      `**Media files:** ${media.count}`,
      '',
      'Do not edit files in this directory by hand. Re-run `npm run extract-brand` after replacing `SAP_Corp.potx`.',
      ''
    ].join('\n')
    await writeFile(resolve(OUT_DIR, 'README.md'), readme, 'utf-8')

    if (!existsSync(OUT_LOGOS_MANIFEST)) {
      const stub = [
        '# Curate role names for each media file extracted from the POTX.',
        '# Files unchanged across extractions keep their roles automatically.',
        '#',
        '# Recommended roles:',
        '#   logo-sap-primary, logo-sap-monochrome, logo-sap-white',
        '#   icon-<name>, illustration-<name>',
        '',
        ...media.manifest.map((m) => `${m.file}:\n  sha256: ${m.sha256}\n  role: ""`)
      ].join('\n')
      await writeFile(OUT_LOGOS_MANIFEST, stub, 'utf-8')
      console.log(`  wrote stub: ${OUT_LOGOS_MANIFEST}`)
    } else {
      console.log(`  logo manifest exists (not overwriting): ${OUT_LOGOS_MANIFEST}`)
    }

    const expectedFont = '72'
    if (!theme.fonts.major.includes(expectedFont)) {
      console.warn(
        `WARNING: POTX major font "${theme.fonts.major}" does not contain "${expectedFont}".`
      )
    }
  } finally {
    await rm(potxTmp, { recursive: true, force: true })
  }

  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
