import { describe, it, expect } from 'vitest'
import { emitBrandTokensCss } from './emit-tokens.mjs'

describe('emit-tokens', () => {
  it('emits CSS custom properties for known colors', () => {
    const css = emitBrandTokensCss({
      colors: ['0070F2', '1B90FF', 'ABCDEF'],
      fonts: { major: '72 Brand', minor: '72 Brand' }
    })
    expect(css).toContain(':root {')
    expect(css).toContain('--sap-brand-blue: #0070F2;')
    expect(css).toContain('--sap-brand-blue-bright: #1B90FF;')
    expect(css).toContain('--sap-color-abcdef: #ABCDEF;')
    expect(css).toContain("--sap-font-major: '72 Brand'")
  })

  it('emits a header comment with metadata', () => {
    const css = emitBrandTokensCss({
      colors: ['0070F2'],
      fonts: { major: '72 Brand', minor: '72 Brand' },
      meta: { potxHash: 'abc123', date: '2026-06-13' }
    })
    expect(css).toContain('GENERATED')
    expect(css).toContain('abc123')
    expect(css).toContain('2026-06-13')
  })
})
