// theme/setup/cover-variants.ts

export type CoverLetter = 'a' | 'k' | 'l'

export interface CoverVariantConfig {
  // L-half styling
  lBg: string // CSS color (e.g. '#ffffff' or 'var(--sap-blue-7)')
  textOnL: 'light' | 'dark' // determines logo + text colors

  // R-half decoration
  rDecoration: 'anvil-grid' | 'flat-anvil-single'
  rBg: string // CSS color OR 'photo' (photo fills R-half)
  hasPhoto: boolean // requires `image:` front-matter
  anvilColor: string // CSS color for the anvil shapes
}

export const COVER_VARIANTS: Record<CoverLetter, CoverVariantConfig> = {
  a: {
    lBg: '#ffffff',
    textOnL: 'dark',
    rDecoration: 'anvil-grid',
    rBg: 'var(--sap-blue-11)',
    hasPhoto: false,
    anvilColor: 'var(--sap-blue-6)'
  },
  k: {
    lBg: 'var(--sap-blue-7)',
    textOnL: 'light',
    rDecoration: 'anvil-grid',
    rBg: 'photo',
    hasPhoto: true,
    anvilColor: 'rgba(255,255,255,0.4)'
  },
  l: {
    lBg: '#ffffff',
    textOnL: 'dark',
    rDecoration: 'flat-anvil-single',
    rBg: 'var(--sap-blue-2)',
    hasPhoto: true,
    anvilColor: 'var(--sap-blue-7)'
  }
}

const VALID_LETTERS = new Set<CoverLetter>(['a', 'k', 'l'])

export function resolveCoverVariant(input?: string): CoverLetter {
  if (!input) return 'a'
  const lower = input.toLowerCase()
  if (VALID_LETTERS.has(lower as CoverLetter)) return lower as CoverLetter
  return 'a'
}

export function getVariantSpec(letter: CoverLetter): CoverVariantConfig {
  return COVER_VARIANTS[letter]
}
