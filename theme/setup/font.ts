import { defineAppSetup } from '@slidev/types'

export type FontMode = 'sap' | 'inter'

export function resolveFontConfig(themeConfig: unknown): FontMode {
  const cfg = themeConfig as { font?: string } | undefined
  const v = cfg?.font
  if (v === 'inter') return 'inter'
  if (v && v !== 'sap') console.warn(`[theme/font] unknown themeConfig.font="${v}", falling back to "sap"`)
  return 'sap'
}

export default defineAppSetup(({ app }) => {
  const cfg = (app.config.globalProperties.$slidev?.configs as { themeConfig?: unknown })?.themeConfig
  if (resolveFontConfig(cfg) === 'sap') {
    void import('../styles/sap-72-fonts.css')
  }
})
