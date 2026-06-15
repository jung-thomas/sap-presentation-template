// theme/setup/cover-variants.test.ts
import { describe, it, expect, vi } from 'vitest'
import {
  COVER_VARIANTS,
  resolveCoverVariant,
  getVariantSpec,
  validateVariant,
  type CoverLetter
} from './cover-variants'

describe('COVER_VARIANTS', () => {
  it('exports exactly three variants (a, k, l) for v0.4.0', () => {
    expect(Object.keys(COVER_VARIANTS).sort()).toEqual(['a', 'k', 'l'])
  })

  it('cover-a is white-left + dark anvil-grid right, no photo', () => {
    expect(COVER_VARIANTS.a).toEqual({
      lBg: '#ffffff',
      textOnL: 'dark',
      rDecoration: 'anvil-grid',
      rBg: 'var(--sap-blue-11)',
      hasPhoto: false,
      anvilColor: 'var(--sap-blue-6)'
    })
  })

  it('cover-k is blue-left + photo+anvil right', () => {
    expect(COVER_VARIANTS.k.hasPhoto).toBe(true)
    expect(COVER_VARIANTS.k.lBg).toBe('var(--sap-blue-7)')
    expect(COVER_VARIANTS.k.textOnL).toBe('light')
    expect(COVER_VARIANTS.k.rBg).toBe('photo')
  })

  it('cover-l is white-left + light-blue + flat-anvil + photo', () => {
    expect(COVER_VARIANTS.l.hasPhoto).toBe(true)
    expect(COVER_VARIANTS.l.rDecoration).toBe('flat-anvil-single')
    expect(COVER_VARIANTS.l.rBg).toBe('var(--sap-blue-2)')
  })
})

describe('resolveCoverVariant', () => {
  it('defaults to "a" when input is undefined', () => {
    expect(resolveCoverVariant()).toBe('a')
  })

  it('passes valid letters through unchanged', () => {
    expect(resolveCoverVariant('a')).toBe('a')
    expect(resolveCoverVariant('k')).toBe('k')
    expect(resolveCoverVariant('l')).toBe('l')
  })

  it('is case-insensitive', () => {
    expect(resolveCoverVariant('A')).toBe('a')
    expect(resolveCoverVariant('K')).toBe('k')
  })

  it('falls back to "a" on unknown input (warning logged elsewhere)', () => {
    expect(resolveCoverVariant('xyz-unknown')).toBe('a')
  })
})

describe('getVariantSpec', () => {
  it('returns the COVER_VARIANTS entry for a valid letter', () => {
    expect(getVariantSpec('a')).toBe(COVER_VARIANTS.a)
    expect(getVariantSpec('k')).toBe(COVER_VARIANTS.k)
    expect(getVariantSpec('l')).toBe(COVER_VARIANTS.l)
  })
})

describe('validateVariant', () => {
  it('returns the letter unchanged for valid variants', () => {
    expect(validateVariant('a', { hasImage: false })).toBe('a')
    expect(validateVariant('k', { hasImage: true })).toBe('k')
    expect(validateVariant('l', { hasImage: true })).toBe('l')
  })

  it('throws for unimplemented variants with a migration message', () => {
    expect(() => validateVariant('b', { hasImage: false })).toThrow(
      /Cover variant 'b' is not yet implemented in v0.4.0.*Available: a, k, l.*v0.4.1/
    )
    expect(() => validateVariant('c', { hasImage: false })).toThrow(/Cover variant 'c'/)
  })

  it('throws when variant k is used without image', () => {
    expect(() => validateVariant('k', { hasImage: false })).toThrow(
      /variant 'k' requires an image:/
    )
  })

  it('throws when variant l is used without image', () => {
    expect(() => validateVariant('l', { hasImage: false })).toThrow(
      /variant 'l' requires an image:/
    )
  })

  it('emits a dev-mode warning when variant a is given an image (does not throw)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(validateVariant('a', { hasImage: true })).toBe('a')
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("variant 'a' ignores image:"))
    warn.mockRestore()
  })
})
