import { describe, it, expect } from 'vitest'
import { extractAllLayouts } from './parse-layouts.mjs'
import { extractPotxToTemp } from './unzip-potx.mjs'
import { resolve } from 'node:path'

describe('parse-layouts', () => {
  it('extracts all 45 slide layouts from the POTX', async () => {
    const tmp = await extractPotxToTemp(resolve('SAP_Corp.potx'))
    const layouts = await extractAllLayouts(tmp)

    expect(layouts).toHaveLength(45)
    for (const l of layouts) {
      expect(typeof l.name).toBe('string')
      expect(Array.isArray(l.placeholders)).toBe(true)
      expect(l.file).toMatch(/slideLayout\d+\.xml/)
    }
    const names = layouts.map((l) => l.name)
    expect(names).toContain('Cover A')
    expect(names).toContain('Quote')
  })

  it('captures placeholder geometry in EMU', async () => {
    const tmp = await extractPotxToTemp(resolve('SAP_Corp.potx'))
    const layouts = await extractAllLayouts(tmp)
    const cover = layouts.find((l) => l.name === 'Cover A')
    expect(cover).toBeDefined()
    const ph = cover.placeholders.find((p) => p.x != null && p.cx != null)
    expect(ph).toBeDefined()
    expect(ph.x).toBeGreaterThanOrEqual(0)
    expect(ph.cx).toBeGreaterThan(0)
  })
})
