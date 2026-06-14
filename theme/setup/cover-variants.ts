// theme/setup/cover-variants.ts
import RipplePattern from '../components/decorations/RipplePattern.vue'
import FlatAnvil from '../components/decorations/FlatAnvil.vue'
import PhotoFrame from '../components/decorations/PhotoFrame.vue'
import WordmarkBookmark from '../components/decorations/WordmarkBookmark.vue'
import type { Component } from 'vue'

export type CoverLetter = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l'

interface VariantSpec {
  decorations: Component[] // rendered in z-order
  background: string // CSS background color
  textOnBg: 'light' | 'dark' // 'light' = white text, 'dark' = brand-blue-darker
}

// Per spec §4.6 / "Cover variant taxonomy" table.
const VARIANTS: Record<CoverLetter, VariantSpec> = {
  a: {
    decorations: [RipplePattern],
    background: '#ffffff',
    textOnBg: 'dark'
  },
  b: {
    decorations: [PhotoFrame, FlatAnvil],
    background: 'var(--sap-blue-10)',
    textOnBg: 'light'
  },
  c: {
    decorations: [PhotoFrame],
    background: 'var(--sap-blue-11)',
    textOnBg: 'light'
  },
  d: {
    decorations: [PhotoFrame, FlatAnvil, FlatAnvil],
    background: 'var(--sap-blue-2)',
    textOnBg: 'dark'
  },
  e: {
    decorations: [PhotoFrame, FlatAnvil, FlatAnvil],
    background: 'var(--sap-blue-10)',
    textOnBg: 'light'
  },
  f: {
    decorations: [PhotoFrame],
    background: 'var(--sap-grey-11)',
    textOnBg: 'light'
  },
  g: {
    decorations: [PhotoFrame],
    background: '#ffffff',
    textOnBg: 'dark'
  },
  h: {
    decorations: [PhotoFrame],
    background: 'var(--sap-blue-6)',
    textOnBg: 'light'
  },
  i: {
    decorations: [PhotoFrame],
    background: 'var(--sap-yellow-6)',
    textOnBg: 'dark'
  },
  j: {
    decorations: [PhotoFrame, FlatAnvil],
    background: 'var(--sap-blue-10)',
    textOnBg: 'light'
  },
  k: {
    decorations: [PhotoFrame],
    background: 'var(--sap-blue-6)',
    textOnBg: 'light'
  },
  l: {
    decorations: [PhotoFrame, FlatAnvil],
    background: 'var(--sap-blue-2)',
    textOnBg: 'dark'
  }
}

const ALIASES: Record<string, CoverLetter> = {
  ripple: 'a',
  photo: 'b',
  'photo-portrait': 'c',
  'multi-shape': 'd',
  'multi-shape-purple': 'e',
  'solid-grey': 'f',
  minimal: 'g',
  'solid-blue': 'h',
  'solid-yellow': 'i',
  'photo-anvil': 'j',
  'solid-blue-mid': 'k',
  'gradient-fade': 'l'
}

export function resolveCoverVariant(input?: string): CoverLetter {
  if (!input) return 'a'
  const lower = input.toLowerCase()
  if (lower.length === 1 && lower >= 'a' && lower <= 'l') return lower as CoverLetter
  return ALIASES[lower] ?? 'a'
}

export function getVariantSpec(letter: CoverLetter): VariantSpec {
  return VARIANTS[letter]
}

export { RipplePattern, FlatAnvil, PhotoFrame, WordmarkBookmark }
