import { describe, it, expect } from 'vitest'
import { extractPotxToTemp, getPotxFile } from './unzip-potx.mjs'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

describe('unzip-potx', () => {
  it('extracts POTX into a tmp dir and returns its path', async () => {
    const tmp = await extractPotxToTemp(resolve('SAP_Corp.potx'))
    expect(existsSync(`${tmp}/ppt/theme/theme1.xml`)).toBe(true)
    expect(existsSync(`${tmp}/ppt/slideLayouts`)).toBe(true)
  })

  it('reads a single file from the POTX without full extraction', async () => {
    const xml = await getPotxFile(resolve('SAP_Corp.potx'), 'ppt/theme/theme1.xml')
    expect(xml).toContain('<a:theme')
    expect(xml.length).toBeGreaterThan(1000)
  })
})
