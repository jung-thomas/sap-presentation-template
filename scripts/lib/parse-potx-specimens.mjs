/**
 * Parse a POTX specimen slide (one of ppt/slides/slide{1..20}.xml) into a record
 * describing its layout reference, title, dynamic-field shape names, media
 * references, and hidden flag.
 *
 * Specimen slides demonstrate intended use of each layout. Some are hidden
 * (`<p:sld show="0">`) — those are author-only "tip" slides.
 */

const TITLE_BLOCK_RE = /<p:ph[^>]*type="(?:title|ctrTitle)"[^>]*>[\s\S]*?<p:txBody>([\s\S]*?)<\/p:txBody>/
const RUN_TEXT_RE = /<a:t>([^<]*)<\/a:t>/g
const SHAPE_NAME_RE = /<p:cNvPr\s+id="\d+"\s+name="([^"]+)"/g
const SHOW_ATTR_RE = /<p:sld\s[^>]*show="(\d)"/
const LAYOUT_RE = /Target="\.\.\/slideLayouts\/(slideLayout\d+\.xml)"/
const MEDIA_RE = /Target="\.\.\/media\/(image\d+\.\w+)"/g

function decodeXmlEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(parseInt(n, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCodePoint(parseInt(n, 16)))
}

/**
 * Parse a single specimen slide + its rels file.
 * @param {{ slideXml: string, relsXml: string, slideNumber: number }} input
 * @returns {{ slideNumber: number, hidden: boolean, title: string|null, layout: string|null, dynamicFields: string[], media: string[] }}
 */
export function parseSpecimen({ slideXml, relsXml, slideNumber }) {
  const titleMatch = slideXml.match(TITLE_BLOCK_RE)
  let title = null
  if (titleMatch) {
    const runs = [...titleMatch[1].matchAll(RUN_TEXT_RE)].map(m => m[1])
    title = decodeXmlEntities(runs.join('')).trim()
  }

  const shapes = [...slideXml.matchAll(SHAPE_NAME_RE)].map(m => m[1])
  const dynamicFields = shapes.filter(n => /-\s*Dynamic$/i.test(n) || /Placeholder$/.test(n))

  const showMatch = slideXml.match(SHOW_ATTR_RE)
  const hidden = showMatch ? showMatch[1] === '0' : false

  const layoutMatch = relsXml.match(LAYOUT_RE)
  const layout = layoutMatch ? layoutMatch[1] : null

  const media = [...relsXml.matchAll(MEDIA_RE)].map(m => m[1])

  return { slideNumber, hidden, title, layout, dynamicFields, media }
}

/**
 * Walk all specimen slides under `${potxTmp}/ppt/slides/` and return one record
 * per slide, sorted by slide number.
 * @param {string} potxTmp - Path to an extracted POTX directory.
 * @returns {Promise<Array<ReturnType<typeof parseSpecimen>>>}
 */
export async function parseAllSpecimens(potxTmp) {
  const { readFile, readdir } = await import('node:fs/promises')
  const { join } = await import('node:path')
  const slidesDir = join(potxTmp, 'ppt', 'slides')
  const relsDir = join(slidesDir, '_rels')
  const out = []
  const files = (await readdir(slidesDir)).filter(f => /^slide\d+\.xml$/.test(f))
  files.sort((a, b) =>
    parseInt(a.replace(/\D/g, ''), 10) - parseInt(b.replace(/\D/g, ''), 10)
  )
  for (const f of files) {
    const n = parseInt(f.replace(/\D/g, ''), 10)
    const slideXml = await readFile(join(slidesDir, f), 'utf-8')
    let relsXml = ''
    try {
      relsXml = await readFile(join(relsDir, `${f}.rels`), 'utf-8')
    } catch { /* no rels file */ }
    out.push(parseSpecimen({ slideXml, relsXml, slideNumber: n }))
  }
  return out
}
