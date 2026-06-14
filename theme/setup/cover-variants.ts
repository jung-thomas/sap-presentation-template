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

const UNIMPLEMENTED_LETTERS = new Set(['b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'])

/**
 * Build-time / runtime validator for the cover layout. Throws on:
 *   - unimplemented variants (b..j) with a v0.4.1 migration message
 *   - variants k/l without image: front-matter
 *
 * Variant 'a' with image: set is allowed but emits a console warning.
 *
 * Returns the variant letter unchanged when valid.
 */
export function validateVariant(input: string, ctx: { hasImage: boolean }): CoverLetter {
  const lower = input.toLowerCase()

  if (UNIMPLEMENTED_LETTERS.has(lower)) {
    throw new Error(
      `Cover variant '${lower}' is not yet implemented in v0.4.0. ` +
        `Available: a, k, l. Tracked for v0.4.1 in ` +
        `docs/superpowers/audit/2026-06-14-v0.4-findings.md.`
    )
  }

  if (!VALID_LETTERS.has(lower as CoverLetter)) {
    throw new Error(
      `Cover variant '${lower}' is not a recognized letter. ` + `Use one of: a, k, l.`
    )
  }

  const letter = lower as CoverLetter
  const spec = COVER_VARIANTS[letter]

  if (spec.hasPhoto && !ctx.hasImage) {
    throw new Error(
      `Cover variant '${letter}' requires an image: front-matter. ` +
        `Add image: /path/to/photo.png (relative to public/) to your slide.`
    )
  }

  if (!spec.hasPhoto && ctx.hasImage) {
    console.warn(
      `[cover] variant '${letter}' ignores image: front-matter ` +
        `(this variant has no photo region).`
    )
  }

  return letter
}
