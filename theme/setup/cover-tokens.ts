// theme/setup/cover-tokens.ts
//
// Numeric mirror of theme/styles/_extracted/cover-tokens.css. Used by Vue/TS
// code that needs the values as numbers (e.g., computeKeepOut). The CSS file
// is the canonical source for cascade-time consumption; this file is the
// canonical source for runtime/computation consumption. Both are regenerated
// together by scripts/extract-brand.mjs (Task 10) when the POTX changes — see
// scripts/lib/emit-cover-tokens.mjs for the emitter.
//
// If you're updating these manually: also update cover-tokens.css to match.

export const COVER_TOKENS = {
  // Logo position and width as percentages of the slide canvas.
  // SAP shield, top-left corner of the cover.
  logoTop: 7.35,
  logoLeft: 4.13,
  logoWidth: 5.96,

  // Cover canvas aspect ratio (16:9 widescreen).
  slideAspect: 16 / 9
} as const
