const FAMILIES = ['blue','grey','teal','green','mango','red','raspberry','pink','indigo']

export function parsePalette(xml) {
  const out = []
  const paraRe = /<a:p>([\s\S]*?)<\/a:p>/g
  for (const para of xml.matchAll(paraRe)) {
    const runs = [...para[1].matchAll(
      /<a:r>\s*<a:rPr[^>]*>(?:<a:solidFill><a:srgbClr\s+val="([0-9A-Fa-f]{6})"\/><\/a:solidFill>)?[\s\S]*?<\/a:rPr>\s*<a:t>([^<]*)<\/a:t>\s*<\/a:r>/g
    )]
    if (runs.length < 2) continue
    const [labelRun, hexRun] = runs
    const labelColor = (hexRun[1] ?? '000000').toUpperCase()
    const m = labelRun[2].trim().match(/^([A-Za-z]+)\s+(\d+)$/)
    if (!m) continue
    const family = m[1].toLowerCase()
    if (!FAMILIES.includes(family)) continue
    const hex = hexRun[2].trim().replace(/^#/, '').toUpperCase()
    if (!/^[0-9A-F]{6}$/.test(hex)) continue
    out.push({
      name: `${m[1]} ${m[2]}`,
      family,
      tint: parseInt(m[2], 10),
      hex,
      textOn: '#' + labelColor
    })
  }
  return out
}
