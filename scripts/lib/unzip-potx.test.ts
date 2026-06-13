import { describe, it, expect } from 'vitest'
import { extractPotxToTemp, getPotxFile } from './unzip-potx.mjs'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

// SAP_Corp.potx is SAP-internal and gitignored; CI doesn't have it.
// Skip integration tests cleanly when the POTX isn't present.
const POTX_PATH = resolve('SAP_Corp.potx')
const HAS_POTX = existsSync(POTX_PATH)

describe.skipIf(!HAS_POTX)('unzip-potx', () => {
  it('extracts POTX into a tmp dir and returns its path', async () => {
    const tmp = await extractPotxToTemp(POTX_PATH)
    expect(existsSync(`${tmp}/ppt/theme/theme1.xml`)).toBe(true)
    expect(existsSync(`${tmp}/ppt/slideLayouts`)).toBe(true)
  })

  it('reads a single file from the POTX without full extraction', async () => {
    const xml = await getPotxFile(POTX_PATH, 'ppt/theme/theme1.xml')
    expect(xml).toContain('<a:theme')
    expect(xml.length).toBeGreaterThan(1000)
  })
})
