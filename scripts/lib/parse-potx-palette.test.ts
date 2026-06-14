import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parsePalette } from './parse-potx-palette.mjs'
import { getPotxFile } from './unzip-potx.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const FIXTURE = readFileSync(resolve(here, 'fixtures/slide20-fragment.xml'), 'utf-8')

describe('parse-potx-palette', () => {
  it('extracts three (name, hex, textOn) triples from the fragment', () => {
    const palette = parsePalette(FIXTURE)
    expect(palette).toEqual([
      { name: 'Blue 2',  family: 'blue', tint: 2,  hex: 'D1EFFF', textOn: '#000000' },
      { name: 'Blue 7',  family: 'blue', tint: 7,  hex: '0070F2', textOn: '#FFFFFF' },
      { name: 'Blue 11', family: 'blue', tint: 11, hex: '00144A', textOn: '#FFFFFF' }
    ])
  })
})

const POTX_PATH = resolve(process.cwd(), 'SAP_Corp.potx')
const HAS_POTX = existsSync(POTX_PATH)

describe.skipIf(!HAS_POTX)('parse-potx-palette integration', () => {
  it('extracts at least 50 colors from real POTX slide20', async () => {
    const xml = await getPotxFile(POTX_PATH, 'ppt/slides/slide20.xml')
    const palette = parsePalette(xml)
    expect(palette.length).toBeGreaterThanOrEqual(50)
    expect(palette).toContainEqual(expect.objectContaining({
      family: 'blue', tint: 7, hex: '0070F2', textOn: '#FFFFFF'
    }))
  })
})
