import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { XMLParser } from 'fast-xml-parser'

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  removeNSPrefix: true,
  isArray: (name) => ['sp', 'pic'].includes(name)
})

/**
 * Read all slideLayoutN.xml files in <potxTmp>/ppt/slideLayouts/
 * Returns [{ file, name, placeholders, pics }] sorted by N.
 *
 * placeholder: { type, idx, x, y, cx, cy, textStyles? } in EMU (914400 per inch).
 * pic:         { name, x, y, cx, cy } in EMU.
 */
export async function extractAllLayouts(potxTmp) {
  const dir = join(potxTmp, 'ppt', 'slideLayouts')
  const files = (await readdir(dir)).filter((f) => /^slideLayout\d+\.xml$/.test(f))
  files.sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]))

  const layouts = []
  for (const file of files) {
    const xml = await readFile(join(dir, file), 'utf-8')
    const parsed = parser.parse(xml)
    const layout = parsed.sldLayout
    const cSld = layout?.cSld
    const name = cSld?.['@_name'] ?? ''
    const spTree = cSld?.spTree
    const sps = spTree?.sp ?? []
    const placeholders = []
    for (const sp of sps) {
      const ph = sp.nvSpPr?.nvPr?.ph
      if (!ph) continue // decorative shape, not a placeholder
      const xfrm = sp.spPr?.xfrm ?? {}
      const off = xfrm.off ?? {}
      const ext = xfrm.ext ?? {}
      const lstStyle = sp.txBody?.lstStyle
      const textStyles = lstStyle ? extractTextStyles(lstStyle) : undefined
      placeholders.push({
        type: ph['@_type'] ?? 'body',
        idx: ph['@_idx'] ?? null,
        x: off['@_x'] != null ? Number(off['@_x']) : null,
        y: off['@_y'] != null ? Number(off['@_y']) : null,
        cx: ext['@_cx'] != null ? Number(ext['@_cx']) : null,
        cy: ext['@_cy'] != null ? Number(ext['@_cy']) : null,
        ...(textStyles ? { textStyles } : {})
      })
    }

    // Capture <p:pic> elements (logos, fixed images)
    const pics = []
    const picElements = spTree?.pic ?? []
    for (const pic of picElements) {
      const xfrm = pic.spPr?.xfrm ?? {}
      const off = xfrm.off ?? {}
      const ext = xfrm.ext ?? {}
      const picName = pic.nvPicPr?.cNvPr?.['@_name'] ?? ''
      pics.push({
        name: picName,
        x: off['@_x'] != null ? Number(off['@_x']) : null,
        y: off['@_y'] != null ? Number(off['@_y']) : null,
        cx: ext['@_cx'] != null ? Number(ext['@_cx']) : null,
        cy: ext['@_cy'] != null ? Number(ext['@_cy']) : null
      })
    }

    layouts.push({ file, name, placeholders, pics })
  }
  return layouts
}

function extractTextStyles(lstStyle) {
  const lvl1 = lstStyle.lvl1pPr ?? {}
  const defRPr = lvl1.defRPr ?? {}
  const lnSpc = lvl1.lnSpc ?? {}
  const result = {}
  if (defRPr['@_sz'] != null) {
    result.fontSize = Number(defRPr['@_sz']) / 100  // 100ths of a point → points
  }
  if (lnSpc.spcPct?.['@_val'] != null) {
    result.lineSpacing = Number(lnSpc.spcPct['@_val']) / 1000  // ‰ → percent
  }
  return Object.keys(result).length > 0 ? result : undefined
}
