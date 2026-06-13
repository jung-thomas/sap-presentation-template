import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { extractMedia } from './extract-media.mjs'
import { extractPotxToTemp } from './unzip-potx.mjs'
import { mkdtemp, rm, readdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

describe('extract-media', () => {
  let potxTmp: string
  let outDir: string

  beforeAll(async () => {
    potxTmp = await extractPotxToTemp(resolve('SAP_Corp.potx'))
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
