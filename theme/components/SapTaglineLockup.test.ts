import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

// Pin assetUrl() to a pass-through so test assertions don't depend on the
// resolved Vite BASE_URL (which differs between local dev and CI).
vi.mock('../setup/assets', () => ({
  assetUrl: (path?: string) => path
}))

import SapTaglineLockup from './SapTaglineLockup.vue'

describe('<SapTaglineLockup>', () => {
  it('renders the SAP logo image', () => {
    const w = mount(SapTaglineLockup)
    const img = w.find('img.tagline-logo')
    expect(img.exists()).toBe(true)
    expect(img.attributes('alt')).toBe('SAP')
  })

  it('renders the tagline text "Bring out your best."', () => {
    const w = mount(SapTaglineLockup)
    expect(w.find('.tagline-text').text()).toBe('Bring out your best.')
  })

  it('uses the primary (color) SAP logo by default', () => {
    const w = mount(SapTaglineLockup)
    const src = w.find('img.tagline-logo').attributes('src')
    expect(src).toContain('logo-sap-primary')
  })

  it('uses the white SAP logo when invert prop is true', () => {
    const w = mount(SapTaglineLockup, { props: { invert: true } })
    const src = w.find('img.tagline-logo').attributes('src')
    expect(src).toContain('logo-sap-white')
  })
})
