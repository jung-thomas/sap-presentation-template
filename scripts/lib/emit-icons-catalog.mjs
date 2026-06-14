// scripts/lib/emit-icons-catalog.mjs

/**
 * Build icons catalog from classified media.
 *
 * Maps each icon to {src, viewBox} where src is the public URL.
 * Throws on duplicate icon names.
 *
 * @param {Array} icons - from classifyMedia: [{src, name, viewBox}, ...]
 * @returns {Object} {name: {src: '/sap/icons/{name}.svg', viewBox}, ...}
 */
export function buildIconsCatalog(icons) {
  const out = {}
  for (const icon of icons) {
    if (out[icon.name]) {
      throw new Error(
        `duplicate icon name: ${icon.name} (${out[icon.name].src} vs /sap/icons/${icon.name}.svg)`
      )
    }
    out[icon.name] = {
      src: `/sap/icons/${icon.name}.svg`,
      viewBox: icon.viewBox
    }
  }
  return out
}
