import { describe, it, expect } from 'vitest'
import { resolveColorName, CROSSWALK } from './color-crosswalk.mjs'

describe('color-crosswalk', () => {
  it('maps known SAP brand hex codes to semantic names', () => {
    expect(resolveColorName('0070F2')).toBe('sap-brand-blue')
    expect(resolveColorName('1B90FF')).toBe('sap-brand-blue-bright')
    expect(resolveColorName('002A86')).toBe('sap-brand-blue-dark')
  })

  it('returns a synthetic name for unknown hex', () => {
    expect(resolveColorName('ABCDEF')).toBe('sap-color-abcdef')
  })

  it('crosswalk has no duplicate names', () => {
    const names = Object.values(CROSSWALK)
    expect(new Set(names).size).toBe(names.length)
  })
})
