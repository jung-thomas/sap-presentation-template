/**
 * Parse the theme1.xml content of a POTX.
 * Returns { colors: string[], fonts: { major: string, minor: string } }
 *
 * - colors: hex codes (uppercase, no '#') from <a:srgbClr val="..."/>
 * - fonts.major: <a:majorFont><a:latin typeface="..."/></a:majorFont>
 * - fonts.minor: <a:minorFont><a:latin typeface="..."/></a:minorFont>
 */
export function parseThemeXml(xml) {
  const matches = [...xml.matchAll(/<a:srgbClr\s+val="([0-9A-Fa-f]{6})"/g)]
  const colors = [...new Set(matches.map((m) => m[1].toUpperCase()))]

  const major = xml.match(/<a:majorFont>[\s\S]*?<a:latin\s+typeface="([^"]+)"/)?.[1] ?? ''
  const minor = xml.match(/<a:minorFont>[\s\S]*?<a:latin\s+typeface="([^"]+)"/)?.[1] ?? ''

  return { colors, fonts: { major, minor } }
}
