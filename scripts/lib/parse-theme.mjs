/**
 * Parse the theme1.xml content of a POTX.
 * Returns { colors: string[], fonts: { major: string, minor: string }, themeAccents: Record<string, string> }
 *
 * - colors: hex codes (uppercase, no '#') from <a:srgbClr val="..."/>
 * - fonts.major: <a:majorFont><a:latin typeface="..."/></a:majorFont>
 * - fonts.minor: <a:minorFont><a:latin typeface="..."/></a:minorFont>
 * - themeAccents: slot-name → hex (uppercase, no '#') extracted from <a:clrScheme>
 */
export function parseThemeXml(xml) {
  const matches = [...xml.matchAll(/<a:srgbClr\s+val="([0-9A-Fa-f]{6})"/g)]
  const colors = [...new Set(matches.map((m) => m[1].toUpperCase()))]

  const major = xml.match(/<a:majorFont>[\s\S]*?<a:latin\s+typeface="([^"]+)"/)?.[1] ?? ''
  const minor = xml.match(/<a:minorFont>[\s\S]*?<a:latin\s+typeface="([^"]+)"/)?.[1] ?? ''

  const schemeMatch = xml.match(/<a:clrScheme[^>]*>([\s\S]*?)<\/a:clrScheme>/)
  const themeAccents = {}
  if (schemeMatch) {
    for (const slot of ['accent1', 'accent2', 'accent3', 'accent4', 'accent5', 'accent6', 'hlink', 'folHlink']) {
      const slotMatch = schemeMatch[1].match(
        new RegExp(`<a:${slot}>[\\s\\S]*?<a:srgbClr\\s+val="([0-9A-Fa-f]{6})"`)
      )
      if (slotMatch) themeAccents[slot] = slotMatch[1].toUpperCase()
    }
  }

  return { colors, fonts: { major, minor }, themeAccents }
}
