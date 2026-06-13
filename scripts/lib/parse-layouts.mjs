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
 * Returns [{ file, name, placeholders }] sorted by N.
 *
 * placeholder: { type, idx, x, y, cx, cy } in EMU (914400 per inch).
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
    const sps = Array.isArray(spTree?.sp) ? spTree.sp : spTree?.sp ? [spTree.sp] : []
    const placeholders = []
    for (const sp of sps) {
      const ph = sp.nvSpPr?.nvPr?.ph
      const xfrm = sp.spPr?.xfrm ?? {}
      const off = xfrm.off ?? {}
      const ext = xfrm.ext ?? {}
      placeholders.push({
        type: ph?.['@_type'] ?? 'body',
        idx: ph?.['@_idx'] ?? null,
        x: off['@_x'] != null ? Number(off['@_x']) : null,
        y: off['@_y'] != null ? Number(off['@_y']) : null,
        cx: ext['@_cx'] != null ? Number(ext['@_cx']) : null,
        cy: ext['@_cy'] != null ? Number(ext['@_cy']) : null
      })
    }
    layouts.push({ file, name, placeholders })
  }
  return layouts
}
