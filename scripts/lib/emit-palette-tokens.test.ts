import { describe, it, expect } from 'vitest'
import { emitPaletteCss, V02_RENAME_MAP } from './emit-palette-tokens.mjs'

describe('emit-palette-tokens', () => {
  const palette = [
    { name: 'Blue 7',  family: 'blue',  tint: 7,  hex: '0070F2', textOn: '#FFFFFF' },
    { name: 'Blue 11', family: 'blue',  tint: 11, hex: '00144A', textOn: '#FFFFFF' },
    { name: 'Mango 6', family: 'mango', tint: 6,  hex: 'E76500', textOn: '#FFFFFF' }
  ]
  const themeAccents = {
    accent1: 'E76500', accent2: '049F9A', accent3: '36A41D',
    accent4: 'FA4F96', accent5: 'F31DED', accent6: '7858FF',
    hlink: '0070F2'
  }

  it('emits canonical --sap-{family}-{tint} tokens', () => {
    const css = emitPaletteCss({ palette, themeAccents })
    expect(css).toMatch(/--sap-blue-7:\s*#0070F2;/)
    expect(css).toMatch(/--sap-blue-11:\s*#00144A;/)
    expect(css).toMatch(/--sap-mango-6:\s*#E76500;/)
  })

  it('emits paired --sap-text-on-{family}-{tint} tokens', () => {
    const css = emitPaletteCss({ palette, themeAccents })
    expect(css).toMatch(/--sap-text-on-blue-7:\s*#FFFFFF;/)
  })

  it('emits theme-scheme aliases pointing to canonical tokens', () => {
    const css = emitPaletteCss({ palette, themeAccents })
    expect(css).toMatch(/--sap-accent-1:\s*var\(--sap-mango-6\);/)
    expect(css).toMatch(/--sap-link:\s*var\(--sap-blue-7\);/)
  })

  it('emits v0.2 deprecation aliases', () => {
    const css = emitPaletteCss({ palette, themeAccents })
    expect(css).toMatch(/--sap-brand-blue:\s*var\(--sap-blue-7\);/)
    expect(css).toMatch(/--sap-brand-blue-darker:\s*var\(--sap-blue-11\);/)
    expect(css).toMatch(/--sap-brand-orange:\s*var\(--sap-mango-6\);/)
  })

  it('emits typeface tokens', () => {
    const css = emitPaletteCss({ palette, themeAccents })
    expect(css).toMatch(/--sap-font-family:\s*'72', '72full', 'Inter'/)
    expect(css).toMatch(/--sap-font-family-bold:\s*'72-Bold', '72full', 'Inter'/)
  })

  it('exposes the v0.2 rename map for use elsewhere', () => {
    expect(V02_RENAME_MAP['--sap-brand-blue']).toBe('--sap-blue-7')
    expect(V02_RENAME_MAP['--sap-brand-blue-darker']).toBe('--sap-blue-11')
  })

  it('emits radius and shadow tokens consumed by components', () => {
    const css = emitPaletteCss({ palette, themeAccents })
    expect(css).toMatch(/--sap-radius-card:\s*0\.5rem;/)
    expect(css).toMatch(/--sap-radius-button:\s*0\.25rem;/)
    expect(css).toMatch(/--sap-shadow-card:\s*0 1px 4px rgba\(0, 0, 0, 0\.08\);/)
  })

  it('V02_RENAME_MAP is complete (49 entries from v0.2 baseline)', () => {
    expect(Object.keys(V02_RENAME_MAP).length).toBe(49)
    // Spot-check the missing ones from the prior gap
    expect(V02_RENAME_MAP['--sap-brand-red']).toBe('--sap-red-7')
    expect(V02_RENAME_MAP['--sap-brand-magenta']).toBe('--sap-pink-7')
    expect(V02_RENAME_MAP['--sap-brand-purple']).toBe('--sap-indigo-7')
    expect(V02_RENAME_MAP['--sap-brand-pink']).toBe('--sap-raspberry-7')
    expect(V02_RENAME_MAP['--sap-color-feadc8']).toBe('--sap-raspberry-4')
  })

  it('--sap-link resolves through HLINK_TO_PALETTE lookup', () => {
    const css = emitPaletteCss({
      palette,
      themeAccents: { hlink: '0070F2' }
    })
    expect(css).toMatch(/--sap-link:\s*var\(--sap-blue-7\);/)

    const cssAlt = emitPaletteCss({
      palette,
      themeAccents: { hlink: '1B90FF' }
    })
    expect(cssAlt).toMatch(/--sap-link:\s*var\(--sap-blue-6\);/)
  })

  it('omits --sap-text-primary/--sap-text-secondary when grey family absent', () => {
    // 'palette' fixture has only blue + mango, no grey
    const css = emitPaletteCss({ palette, themeAccents: {} })
    expect(css).not.toMatch(/--sap-text-primary:/)
    expect(css).not.toMatch(/--sap-text-secondary:/)

    const withGrey = [
      ...palette,
      { name: 'Grey 7',  family: 'grey', tint: 7,  hex: '475E75', textOn: '#FFFFFF' },
      { name: 'Grey 11', family: 'grey', tint: 11, hex: '12171C', textOn: '#FFFFFF' }
    ]
    const css2 = emitPaletteCss({ palette: withGrey, themeAccents: {} })
    expect(css2).toMatch(/--sap-text-primary:\s*var\(--sap-grey-11\);/)
    expect(css2).toMatch(/--sap-text-secondary:\s*var\(--sap-grey-7\);/)
  })
})
