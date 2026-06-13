import { describe, it, expect, vi } from 'vitest'

vi.mock('../components/decorations/DecorationPhoto.vue', () => ({
  default: { name: 'DecorationPhoto' }
}))
vi.mock('../components/decorations/DecorationDiagonal.vue', () => ({
  default: { name: 'DecorationDiagonal' }
}))
vi.mock('../components/decorations/DecorationWedges.vue', () => ({
  default: { name: 'DecorationWedges' }
}))
vi.mock('../components/decorations/DecorationSolid.vue', () => ({
  default: { name: 'DecorationSolid' },
  logoTreatment: 'white'
}))
vi.mock('../components/decorations/DecorationMultiShape.vue', () => ({
  default: { name: 'DecorationMultiShape' },
  logoTreatment: 'white'
}))
vi.mock('../components/decorations/DecorationGradient.vue', () => ({
  default: { name: 'DecorationGradient' }
}))

import { resolveCoverVariant, getDecoration, useDarkLogo } from './cover-variants'

describe('resolveCoverVariant', () => {
  it('returns letter unchanged when given a single letter a-l', () => {
    expect(resolveCoverVariant('a')).toBe('a')
    expect(resolveCoverVariant('g')).toBe('g')
    expect(resolveCoverVariant('l')).toBe('l')
  })

  it('lowercases input', () => {
    expect(resolveCoverVariant('A')).toBe('a')
    expect(resolveCoverVariant('G')).toBe('g')
  })

  it('maps known descriptive aliases to letters', () => {
    expect(resolveCoverVariant('photo')).toBe('a')
    expect(resolveCoverVariant('diagonal')).toBe('b')
    expect(resolveCoverVariant('wedges')).toBe('g')
    expect(resolveCoverVariant('solid-blue')).toBe('f')
    expect(resolveCoverVariant('gradient-fade')).toBe('l')
  })

  it('falls back to "a" for unknown input', () => {
    expect(resolveCoverVariant('foo')).toBe('a')
    expect(resolveCoverVariant('zz')).toBe('a')
  })

  it('falls back to "a" when undefined', () => {
    expect(resolveCoverVariant(undefined)).toBe('a')
  })
})

function componentName(component: unknown): string {
  return (component as { name: string }).name
}

describe('getDecoration', () => {
  it('returns the right component per letter', () => {
    expect(componentName(getDecoration('a'))).toBe('DecorationPhoto')
    expect(componentName(getDecoration('b'))).toBe('DecorationDiagonal')
    expect(componentName(getDecoration('g'))).toBe('DecorationWedges')
    expect(componentName(getDecoration('f'))).toBe('DecorationSolid')
    expect(componentName(getDecoration('l'))).toBe('DecorationGradient')
    expect(componentName(getDecoration('c'))).toBe('DecorationMultiShape')
  })

  it('falls back to DecorationPhoto for unknown letters', () => {
    expect(componentName(getDecoration('z'))).toBe('DecorationPhoto')
  })
})

describe('useDarkLogo', () => {
  it('returns true for variants with dark backgrounds', () => {
    expect(useDarkLogo('b')).toBe(true)
    expect(useDarkLogo('f')).toBe(true)
    expect(useDarkLogo('g')).toBe(true)
    expect(useDarkLogo('l')).toBe(true)
  })

  it('returns false for variant a (logo and title sit in always-white left half)', () => {
    // Cover A's left half is always white — the right-half decoration
    // (photo or wedge fallback) doesn't affect the logo/title color.
    expect(useDarkLogo('a')).toBe(false)
    expect(useDarkLogo('a', '/some-image.jpg')).toBe(false)
    expect(useDarkLogo('a', undefined)).toBe(false)
    expect(useDarkLogo('a', '')).toBe(false)
  })

  it('honors per-decoration logoTreatment for multi-shape variants c and e', () => {
    expect(useDarkLogo('c')).toBe(true)
    expect(useDarkLogo('e')).toBe(true)
  })

  it('overrides multi-shape default for Cover D (POTX has LogoBlack — light bg)', () => {
    // POTX layouts.json shows LogoBlack-Dynamic referenced from slideLayout4 (Cover D),
    // indicating that variant uses the primary/color logo (light background) despite
    // sharing DecorationMultiShape with c/e. The cover-variants override map handles this.
    expect(useDarkLogo('d')).toBe(false)
  })
})
