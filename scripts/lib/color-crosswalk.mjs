/**
 * Crosswalk from hex (uppercase, no '#') to semantic SAP color name.
 *
 * Sourced from the SAP Horizon palette as it appears in SAP_Corp.potx
 * (theme1.xml). When new brand colors land, add them here. Unknown hex
 * codes become `sap-color-<hex>` automatically (see resolveColorName).
 */
export const CROSSWALK = {
  // Primary blues
  '0070F2': 'sap-brand-blue',
  '1B90FF': 'sap-brand-blue-bright',
  '002A86': 'sap-brand-blue-dark',
  '00144A': 'sap-brand-blue-darker',
  '89D1FF': 'sap-brand-blue-light',
  'D1EFFF': 'sap-brand-blue-pale',
  // Teals
  '049F9A': 'sap-brand-teal',
  '07838F': 'sap-brand-teal-dark',
  '02414C': 'sap-brand-teal-darker',
  '012931': 'sap-brand-teal-darkest',
  '2CE0BF': 'sap-brand-teal-bright',
  'C2FCEE': 'sap-brand-teal-pale',
  // Greens
  '188918': 'sap-brand-green',
  '36A41D': 'sap-brand-green-bright',
  '164323': 'sap-brand-green-dark',
  '0E2B16': 'sap-brand-green-darkest',
  '97DD40': 'sap-brand-green-light',
  'EBF5CB': 'sap-brand-green-pale',
  // Reds
  'D20A0A': 'sap-brand-red',
  'EE3939': 'sap-brand-red-bright',
  '5A0404': 'sap-brand-red-dark',
  '350000': 'sap-brand-red-darkest',
  '6D1900': 'sap-brand-red-mid',
  '450B00': 'sap-brand-red-darker',
  // Oranges/yellows
  'E76500': 'sap-brand-orange',
  'C35500': 'sap-brand-orange-dark',
  'F0AB00': 'sap-brand-yellow',
  // Magentas/pinks
  'DF1278': 'sap-brand-pink',
  '71014B': 'sap-brand-pink-dark',
  '510136': 'sap-brand-pink-darker',
  'CC00DC': 'sap-brand-magenta',
  // Purples
  '5D36FF': 'sap-brand-purple',
  '7858FF': 'sap-brand-purple-bright',
  'B894FF': 'sap-brand-purple-light',
  '28004A': 'sap-brand-purple-dark',
  '0E0637': 'sap-brand-purple-darker',
  '1C0C6E': 'sap-brand-purple-darkest',
  '510080': 'sap-brand-purple-deep',
  'E2D8FF': 'sap-brand-purple-pale',
  // Neutrals
  '000000': 'sap-black',
  'FFFFFF': 'sap-white'
}

export function resolveColorName(hex) {
  const key = hex.toUpperCase()
  return CROSSWALK[key] ?? `sap-color-${key.toLowerCase()}`
}
