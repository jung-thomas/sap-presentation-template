import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { extractMedia, classifyMedia } from './extract-media.mjs'
import { extractPotxToTemp } from './unzip-potx.mjs'
import { mkdtemp, rm, readdir } from 'node:fs/promises'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const POTX_PATH = resolve('SAP_Corp.potx')
const HAS_POTX = existsSync(POTX_PATH)

const RAW_DIR = resolve(process.cwd(), 'theme/styles/_extracted/media/raw')
const HAS_RAW = existsSync(RAW_DIR)

describe.skipIf(!HAS_POTX)('extract-media', () => {
  let potxTmp: string
  let outDir: string

  beforeAll(async () => {
    potxTmp = await extractPotxToTemp(POTX_PATH)
    outDir = await mkdtemp(join(tmpdir(), 'media-out-'))
  })

  afterAll(async () => {
    await rm(outDir, { recursive: true, force: true })
  })

  it('copies all media files from POTX into output dir', async () => {
    const result = await extractMedia(potxTmp, outDir)
    expect(result.count).toBeGreaterThan(50)
    const files = await readdir(outDir)
    expect(files.length).toBe(result.count)
    expect(files.some((f) => f.endsWith('.png') || f.endsWith('.svg'))).toBe(true)
  })

  it('returns a manifest with file hashes', async () => {
    const result = await extractMedia(potxTmp, outDir)
    expect(result.manifest).toBeInstanceOf(Array)
    expect(result.manifest[0]).toHaveProperty('file')
    expect(result.manifest[0]).toHaveProperty('sha256')
    expect(result.manifest[0].sha256).toMatch(/^[0-9a-f]{64}$/)
  })
})

function pngBuffer(w: number, h: number) {
  // PNG IHDR width/height live at byte offset 16-23 (big-endian).
  // Allocate 200KB so buf.length exceeds both wordmark (>5000) and photo (>100000) thresholds.
  const buf = Buffer.alloc(200_000)
  buf.writeUInt32BE(w, 16)
  buf.writeUInt32BE(h, 20)
  return buf
}

describe('classifyMedia', () => {
  it('identifies the Ripple Pattern by id="Ripple_Pattern"', async () => {
    const r = await classifyMedia({
      'image38.svg': '<svg id="Ripple_Pattern" viewBox="0 0 5242 1553"></svg>'
    })
    expect(r.ripple).toBe('image38.svg')
  })

  it('identifies the wordmark by aspect ratio of large PNG (~3.4:1)', async () => {
    const r = await classifyMedia({ 'image37.png': pngBuffer(2500, 740) })
    expect(r.wordmark).toBe('image37.png')
  })

  it('treats large PNGs with balanced aspect as cover photos', async () => {
    const r = await classifyMedia({ 'image40.png': pngBuffer(1920, 1280) })
    expect(r.photos).toContain('image40.png')
  })

  it('extracts inner semantic icon name from nested <g id> in real POTX shape', async () => {
    const xml = `<svg viewBox="0 0 96.21 96.21">
      <g id="Icons_16px">
        <g id="family-care"><path/></g>
      </g>
    </svg>`
    const r = await classifyMedia({ 'image50.svg': xml })
    expect(r.icons).toContainEqual({ src: 'image50.svg', name: 'family-care', viewBox: '0 0 96.21 96.21' })
  })

  it('extracts inner semantic icon name from <path id> nested in wrapper <g id="Icons_...">', async () => {
    const xml = `<svg viewBox="0 0 43.18 43.18">
      <g id="Icons_900px_blue7">
        <path d="M0 0" id="wrench"/>
      </g>
    </svg>`
    const r = await classifyMedia({ 'image28.svg': xml })
    expect(r.icons).toContainEqual({ src: 'image28.svg', name: 'wrench', viewBox: '0 0 43.18 43.18' })
  })

  it('extracts icon name and viewBox from <g id="..."> in 96x96 SVGs', async () => {
    const xml = '<svg viewBox="0 0 96.21 96.21"><g id="wrench"><path/></g></svg>'
    const r = await classifyMedia({ 'image28.svg': xml })
    expect(r.icons).toContainEqual({ src: 'image28.svg', name: 'wrench', viewBox: '0 0 96.21 96.21' })
  })

  it('finds the Flat Anvil primitive by its canonical path', async () => {
    const xml = '<svg viewBox="0 0 605 297"><path d="M0 0 0 297 307.459 297 605 0 0 0Z" fill="#0070F2"/></svg>'
    const r = await classifyMedia({ 'image11.svg': xml })
    expect(r.flatAnvil).toBe('image11.svg')
  })
})

describe.skipIf(!HAS_RAW)('classifyMedia integration (real POTX media)', () => {
  it('returns unique semantic icon names from real POTX media', async () => {
    const files: Record<string, string | Buffer> = {}
    for (const f of readdirSync(RAW_DIR)) {
      const buf = readFileSync(join(RAW_DIR, f))
      files[f] = f.endsWith('.svg') ? buf.toString('utf-8') : buf
    }
    const r = await classifyMedia(files)
    const names = r.icons.map((i) => i.name)
    // All icon names must be unique — buildIconsCatalog throws on duplicates.
    expect(new Set(names).size).toBe(names.length)
    // Sanity: the wrapper-style id must never leak through as a name.
    expect(names.every((n) => !/^Icons?_/i.test(n))).toBe(true)
    // Sanity: at least one well-known semantic icon should be present.
    expect(names).toContain('wrench')
  })
})
