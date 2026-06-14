// tests/visual/clear-space.config.ts
//
// Configuration for the clear-space visual regression test.
//
// `deltaEThreshold` is the maximum allowed CIE76 perceptual color distance
// between any pixel in the keep-out box and the variant's background color.
// 5.0 is the perceptual threshold for "indistinguishable to most viewers".
//
// `edgePixelTolerancePx` shrinks the asserted region inward to ignore
// sub-pixel anti-aliasing on the keep-out box edges.

export const CLEAR_SPACE_CONFIG = {
  deltaEThreshold: 5.0,
  edgePixelTolerancePx: 2,

  // Variants exercised by the test, with their background color.
  // Keep in sync with theme/setup/cover-variants.ts and theme/layouts/divider.vue.
  variants: {
    'cover-a': { bg: '#FFFFFF' },
    'cover-b': { bg: '#002A86' },
    'cover-c': { bg: '#00144A' },
    'cover-d': { bg: '#D1EFFF' },
    'cover-e': { bg: '#002A86' },
    'cover-f': { bg: '#12171C' },
    'cover-g': { bg: '#FFFFFF' },
    'cover-h': { bg: '#1B90FF' },
    'cover-i': { bg: '#F0AB00' },
    'cover-j': { bg: '#002A86' },
    'cover-k': { bg: '#1B90FF' },
    'cover-l': { bg: '#D1EFFF' },
    'divider-a': { bg: '#FFFFFF' },
    'divider-b': { bg: '#002A86' },
    'divider-c': { bg: '#00144A' },
    'divider-d': { bg: '#0070F2' }
  }
} as const
