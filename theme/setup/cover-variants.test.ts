// theme/setup/cover-variants.test.ts
import { describe, it, expect } from 'vitest'
import { resolveCoverVariant, getVariantSpec } from './cover-variants'

describe('resolveCoverVariant', () => {
  it('defaults to "a" when input is undefined', () => {
    expect(resolveCoverVariant()).toBe('a')
  })

  it('passes single letters through unchanged', () => {
    expect(resolveCoverVariant('a')).toBe('a')
    expect(resolveCoverVariant('l')).toBe('l')
  })

  it('is case-insensitive', () => {
    expect(resolveCoverVariant('A')).toBe('a')
    expect(resolveCoverVariant('L')).toBe('l')
  })

  it('resolves descriptive aliases to letters', () => {
    expect(resolveCoverVariant('photo')).toBe('b')
    expect(resolveCoverVariant('ripple')).toBe('a')
    expect(resolveCoverVariant('multi-shape')).toBe('d')
  })

  it('falls back to "a" on unknown input', () => {
    expect(resolveCoverVariant('xyz-unknown')).toBe('a')
  })
})

describe('getVariantSpec', () => {
  it('returns light textOnBg for navy background variants', () => {
    expect(getVariantSpec('c').textOnBg).toBe('light')
    expect(getVariantSpec('e').textOnBg).toBe('light')
  })

  it('returns dark textOnBg for light/yellow background variants', () => {
    expect(getVariantSpec('a').textOnBg).toBe('dark')
    expect(getVariantSpec('d').textOnBg).toBe('dark')
    expect(getVariantSpec('i').textOnBg).toBe('dark')
  })

  it('attaches the right decoration count per variant', () => {
    expect(getVariantSpec('a').decorations.length).toBe(1) // Ripple only
    expect(getVariantSpec('d').decorations.length).toBe(3) // photo + 2× anvil
  })

  it('emits a CSS background color for every variant', () => {
    const letters: Array<'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l'> = [
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l'
    ]
    for (const l of letters) {
      const spec = getVariantSpec(l)
      expect(spec.background).toBeTruthy()
    }
  })
})
