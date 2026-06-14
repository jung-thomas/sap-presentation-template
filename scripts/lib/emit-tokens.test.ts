import { describe, it, expect } from 'vitest'
import { emitBrandTokensCss } from './emit-tokens.mjs'

describe('emit-tokens', () => {
  it('emits CSS custom properties for the palette and v0.2 aliases', () => {
    const palette = [
      { name: 'Blue 6',  family: 'blue',  tint: 6,  hex: '1B90FF', textOn: '#FFFFFF' },
      { name: 'Blue 7',  family: 'blue',  tint: 7,  hex: '0070F2', textOn: '#FFFFFF' },
      { name: 'Mango 6', family: 'mango', tint: 6,  hex: 'E76500', textOn: '#FFFFFF' }
    ]
    const themeAccents = { accent1: 'E76500' }
    const css = emitBrandTokensCss({ palette, themeAccents })
    expect(css).toContain(':root {')
    expect(css).toContain('--sap-blue-6: #1B90FF;')
    expect(css).toContain('--sap-blue-7: #0070F2;')
    expect(css).toContain('--sap-mango-6: #E76500;')
    // v0.2 deprecation alias still resolves:
    expect(css).toContain('--sap-brand-blue-bright: var(--sap-blue-6);')
    expect(css).toContain('--sap-brand-blue: var(--sap-blue-7);')
  })

  it('emits a header comment with metadata', () => {
    const palette = [
      { name: 'Blue 7', family: 'blue', tint: 7, hex: '0070F2', textOn: '#FFFFFF' }
    ]
    const css = emitBrandTokensCss({
      palette,
      themeAccents: {},
      meta: { potxHash: 'abc123', date: '2026-06-13' }
    })
    expect(css).toContain('GENERATED')
    expect(css).toContain('abc123')
    expect(css).toContain('2026-06-13')
  })
})
