// scripts/lib/emit-agenda-defaults.mjs

/**
 * Parse SP_AGENDA tag value into structured config object.
 *
 * The SP_AGENDA tag carries a space-separated list of flag tokens.
 * This parser maps known flags to a boolean-keyed config object.
 * Unknown flags are silently ignored.
 *
 * @param {string} value - space-separated flags, e.g. "TOC TOCShowsSubsections Dividers SectionNumber SlideNumber"
 * @returns {Object} {toc, showSubsections, dividers, sectionNumbers, slideNumbers}
 */
const FLAG_TO_KEY = {
  TOC: 'toc',
  TOCShowsSubsections: 'showSubsections',
  Dividers: 'dividers',
  SectionNumber: 'sectionNumbers',
  SlideNumber: 'slideNumbers'
}

export function parseAgendaConfig(value) {
  const cfg = { toc: false, showSubsections: false, dividers: false, sectionNumbers: false, slideNumbers: false }
  if (!value) return cfg
  for (const flag of value.trim().split(/\s+/)) {
    const key = FLAG_TO_KEY[flag]
    if (key) cfg[key] = true
  }
  return cfg
}
