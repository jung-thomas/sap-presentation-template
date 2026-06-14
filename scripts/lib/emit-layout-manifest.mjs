// scripts/lib/emit-layout-manifest.mjs

/**
 * Merge parse-layouts output with decisions.yaml to create final layout manifest.
 *
 * Throws if a POTX layout has no decision entry (prevents silent regressions
 * when a new layout is added to POTX).
 *
 * @param {Object} input
 * @param {Array} input.layouts - from parse-layouts.mjs: [{ file, name, ... }]
 * @param {Object} input.decisions - parsed decisions.yaml: { slideLayoutN: {...}, ... }
 * @returns {Object} { layouts: [...], totals: { ship, alias, exclude, total } }
 */
export function buildLayoutManifest({ layouts, decisions }) {
  const result = []
  const totals = { ship: 0, alias: 0, exclude: 0, total: layouts.length }

  for (const layout of layouts) {
    const key = layout.file.replace(/\.xml$/, '')
    const decision = decisions[key]

    if (!decision) {
      throw new Error(
        `Layout ${key} has no decision in decisions.yaml. ` +
        `Add an entry with status: 'ship' | 'alias' | 'exclude'. ` +
        `See spec §4.5.`
      )
    }

    const status = decision.status
    if (status in totals) {
      totals[status]++
    }

    result.push({
      file: layout.file,
      name: layout.name,
      ...decision
    })
  }

  return { layouts: result, totals }
}
