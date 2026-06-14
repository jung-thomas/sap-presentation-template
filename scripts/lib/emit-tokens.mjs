import { emitPaletteCss } from './emit-palette-tokens.mjs'

export function emitBrandTokensCss({ palette, themeAccents, meta = {} }) {
  return emitPaletteCss({ palette, themeAccents, meta })
}
