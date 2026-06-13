import DecorationPhoto from '../components/decorations/DecorationPhoto.vue'
import DecorationDiagonal from '../components/decorations/DecorationDiagonal.vue'
import DecorationWedges from '../components/decorations/DecorationWedges.vue'
import DecorationSolid from '../components/decorations/DecorationSolid.vue'
import DecorationMultiShape from '../components/decorations/DecorationMultiShape.vue'
import DecorationGradient from '../components/decorations/DecorationGradient.vue'
import { multiShapeLogoTreatment as multiLogoTreatment } from '../components/decorations/decoration-logo-treatments'

const DECORATION_BY_LETTER = {
  a: DecorationPhoto,
  b: DecorationDiagonal,
  c: DecorationMultiShape,
  d: DecorationMultiShape,
  e: DecorationMultiShape,
  f: DecorationSolid,
  g: DecorationWedges,
  h: DecorationSolid,
  i: DecorationSolid,
  j: DecorationDiagonal,
  k: DecorationSolid,
  l: DecorationGradient
} as const

// Per-variant overrides take precedence over the decoration component's
// default. Use this when POTX inspection reveals a variant has a different
// background contrast than the component's family default. Cover D's POTX
// XML references LogoBlack-Dynamic (the primary/color logo), indicating
// it has a light background despite using the multi-shape decoration.
const DECORATION_LOGO_TREATMENTS: Record<string, 'primary' | 'white' | undefined> = {
  c: multiLogoTreatment,
  d: 'primary',
  e: multiLogoTreatment
}

const ALIASES: Record<string, string> = {
  photo: 'a',
  diagonal: 'b',
  'photo-portrait': 'c',
  'multi-shape': 'd',
  'multi-shape-purple': 'e',
  'solid-blue': 'f',
  wedges: 'g',
  'solid-teal': 'h',
  'solid-purple': 'i',
  'diagonal-tinted': 'j',
  'solid-blue-darker': 'k',
  'gradient-fade': 'l'
}

const DARK_BG_VARIANTS = new Set(['b', 'f', 'g', 'h', 'i', 'j', 'k', 'l'])
const AUTO_LOGO_VARIANTS = new Set(['c', 'd', 'e'])

export function resolveCoverVariant(input?: string): string {
  if (!input) return 'a'
  const lower = input.toLowerCase()
  if (lower.length === 1 && lower >= 'a' && lower <= 'l') return lower
  return ALIASES[lower] ?? 'a'
}

export function getDecoration(letter: string) {
  return DECORATION_BY_LETTER[letter as keyof typeof DECORATION_BY_LETTER] ?? DecorationPhoto
}

export function useDarkLogo(letter: string, image?: string): boolean {
  // Cover A with no image renders the wedge fallback (dark) → white logo
  if (letter === 'a' && !image) return true
  if (DARK_BG_VARIANTS.has(letter)) return true
  if (AUTO_LOGO_VARIANTS.has(letter)) {
    return DECORATION_LOGO_TREATMENTS[letter] === 'white'
  }
  return false
}
