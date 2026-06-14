import { describe, it, expect } from 'vitest'
import { parseThemeXml } from './parse-theme.mjs'
import { getPotxFile } from './unzip-potx.mjs'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

const POTX_PATH = resolve('SAP_Corp.potx')
const HAS_POTX = existsSync(POTX_PATH)

describe.skipIf(!HAS_POTX)('parse-theme', () => {
  it('extracts the SAP brand color palette from theme1.xml', async () => {
    const xml = await getPotxFile(POTX_PATH, 'ppt/theme/theme1.xml')
    const theme = parseThemeXml(xml)

    expect(theme.colors).toContain('0070F2')
    expect(theme.colors.length).toBeGreaterThanOrEqual(30)
    expect(new Set(theme.colors).size).toBe(theme.colors.length)
  })

  it('extracts the typeface name', async () => {
    const xml = await getPotxFile(POTX_PATH, 'ppt/theme/theme1.xml')
    const theme = parseThemeXml(xml)
    expect(theme.fonts.major).toMatch(/72/)
    expect(theme.fonts.minor).toMatch(/72/)
  })

  it('extracts theme accents from clrScheme', async () => {
    const xml = await getPotxFile(POTX_PATH, 'ppt/theme/theme1.xml')
    const theme = parseThemeXml(xml)
    expect(theme.themeAccents.accent1).toBe('E76500')
    expect(theme.themeAccents.hlink).toBe('0070F2')
  })
})
