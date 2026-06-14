#!/usr/bin/env node
import { readFile, writeFile, mkdir, rm, copyFile, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import yaml from 'js-yaml'

import { extractPotxToTemp, getPotxFile } from './lib/unzip-potx.mjs'
import { parseThemeXml } from './lib/parse-theme.mjs'
import { parsePalette } from './lib/parse-potx-palette.mjs'
import { parseAllSpecimens } from './lib/parse-potx-specimens.mjs'
import { parseAllTags } from './lib/parse-potx-tags.mjs'
import { extractAllLayouts } from './lib/parse-layouts.mjs'
import { classifyMedia } from './lib/extract-media.mjs'
import { emitBrandTokensCss } from './lib/emit-tokens.mjs'
import { emitCoverTokensCss } from './lib/emit-cover-tokens.mjs'
import { emitTypographyTokensCss } from './lib/emit-typography-tokens.mjs'
import { buildLayoutManifest } from './lib/emit-layout-manifest.mjs'
import { buildIconsCatalog } from './lib/emit-icons-catalog.mjs'
import { parseAgendaConfig } from './lib/emit-agenda-defaults.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const POTX = resolve(ROOT, 'SAP_Corp.potx')
const OUT_DIR = resolve(ROOT, 'theme/styles/_extracted')
const PUBLIC_SAP = resolve(ROOT, 'public/sap')

async function fileSha256(p) {
  return createHash('sha256').update(await readFile(p)).digest('hex')
}

async function loadAllMedia(potxTmp) {
  const mediaDir = join(potxTmp, 'ppt', 'media')
  if (!existsSync(mediaDir)) {
    throw new Error(`POTX is missing ppt/media/ directory — expected SAP brand assets to be present`)
  }
  const files = await readdir(mediaDir)
  if (files.length === 0) {
    throw new Error(`POTX ppt/media/ directory is empty — expected SAP brand assets to be present`)
  }
  const out = {}
  for (const f of files) {
    const buf = await readFile(join(mediaDir, f))
    out[f] = f.endsWith('.svg') ? buf.toString('utf-8') : buf
  }
  return out
}

async function main() {
  if (!existsSync(POTX)) { console.error(`POTX not found: ${POTX}`); process.exit(1) }
  const potxHash = await fileSha256(POTX)
  const date = new Date().toISOString().slice(0, 10)

  await rm(OUT_DIR, { recursive: true, force: true })
  await mkdir(join(OUT_DIR, 'media', 'icons'), { recursive: true })
  await mkdir(join(OUT_DIR, 'media', 'cover-photos'), { recursive: true })
  await mkdir(join(PUBLIC_SAP, 'icons'), { recursive: true })
  await mkdir(join(PUBLIC_SAP, 'covers'), { recursive: true })

  const potxTmp = await extractPotxToTemp(POTX)
  try {
    const themeXml = await getPotxFile(POTX, 'ppt/theme/theme1.xml')
    const theme = parseThemeXml(themeXml)
    const palette = parsePalette(await getPotxFile(POTX, 'ppt/slides/slide20.xml'))
    const specimens = await parseAllSpecimens(potxTmp)
    const tags = await parseAllTags(potxTmp)
    const layouts = await extractAllLayouts(potxTmp)
    const decisions = yaml.load(await readFile(resolve(ROOT, 'scripts/decisions.yaml'), 'utf-8'))
    const mediaFiles = await loadAllMedia(potxTmp)
    const classified = await classifyMedia(mediaFiles)

    const manifest = buildLayoutManifest({ layouts, decisions })
    const iconsCatalog = buildIconsCatalog(classified.icons)
    const agendaTag = tags.find(t => t.name === 'SP_AGENDA')
    const agendaDefaults = parseAgendaConfig(agendaTag?.value ?? '')

    await writeFile(resolve(OUT_DIR, 'brand-tokens.css'),
      emitBrandTokensCss({ palette, themeAccents: theme.themeAccents, meta: { potxHash, date } }))
    await writeFile(resolve(OUT_DIR, 'cover-tokens.css'), emitCoverTokensCss(layouts))
    await writeFile(resolve(OUT_DIR, 'typography-tokens.css'), emitTypographyTokensCss(layouts))
    await writeFile(resolve(OUT_DIR, 'palette.json'), JSON.stringify(palette, null, 2))
    await writeFile(resolve(OUT_DIR, 'layouts.json'), JSON.stringify(manifest, null, 2))
    await writeFile(resolve(OUT_DIR, 'icons.json'), JSON.stringify(iconsCatalog, null, 2))
    await writeFile(resolve(OUT_DIR, 'agenda-defaults.json'), JSON.stringify(agendaDefaults, null, 2))
    await writeFile(resolve(OUT_DIR, 'specimens.json'), JSON.stringify(specimens, null, 2))

    const copies = [
      [classified.ripple,    'media/sap-anvil-ripple.svg', 'anvil-ripple.svg'],
      [classified.wordmark,  'media/sap-wordmark.png',     'wordmark.png'],
      [classified.flatAnvil, 'media/sap-flat-anvil.svg',   'flat-anvil.svg']
    ]
    for (const [src, extracted, pub] of copies) {
      if (!src) continue
      await copyFile(join(potxTmp, 'ppt', 'media', src), resolve(OUT_DIR, extracted))
      await copyFile(join(potxTmp, 'ppt', 'media', src), resolve(PUBLIC_SAP, pub))
    }
    let n = 0
    for (const photo of classified.photos.slice(0, 3)) {
      n++
      await copyFile(join(potxTmp, 'ppt', 'media', photo), resolve(OUT_DIR, `media/cover-photos/cover-${n}.png`))
      await copyFile(join(potxTmp, 'ppt', 'media', photo), resolve(PUBLIC_SAP, `covers/cover-${n}.png`))
    }
    for (const icon of classified.icons) {
      await copyFile(join(potxTmp, 'ppt', 'media', icon.src), resolve(OUT_DIR, `media/icons/${icon.name}.svg`))
      await copyFile(join(potxTmp, 'ppt', 'media', icon.src), resolve(PUBLIC_SAP, `icons/${icon.name}.svg`))
    }

    console.log(`✓ ${palette.length} colors, ${manifest.layouts.length} layouts (${manifest.totals.ship}/${manifest.totals.alias}/${manifest.totals.exclude}), ${classified.icons.length} icons, ${classified.photos.length} photos`)
  } finally {
    await rm(potxTmp, { recursive: true, force: true })
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
