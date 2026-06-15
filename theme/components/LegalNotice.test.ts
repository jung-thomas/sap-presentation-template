import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

// Pin legal.ts so the test doesn't depend on the current year.
vi.mock('../setup/legal', () => {
  const TEXT = '© 2026 SAP SE or an SAP affiliate company. All rights reserved.'
  return {
    LEGAL_NOTICE: TEXT,
    getLegalNotice: (override?: string | null) =>
      override && override.trim().length > 0 ? override : TEXT
  }
})

import LegalNotice from './LegalNotice.vue'

describe('<LegalNotice>', () => {
  it('renders the default SAP legal notice', () => {
    const w = mount(LegalNotice)
    expect(w.text()).toBe('© 2026 SAP SE or an SAP affiliate company. All rights reserved.')
  })

  it('renders an override when provided', () => {
    const w = mount(LegalNotice, { props: { override: 'Custom legal line.' } })
    expect(w.text()).toBe('Custom legal line.')
  })

  it('falls back to default when override is empty string', () => {
    const w = mount(LegalNotice, { props: { override: '' } })
    expect(w.text()).toBe('© 2026 SAP SE or an SAP affiliate company. All rights reserved.')
  })

  it('falls back to default when override is null', () => {
    const w = mount(LegalNotice, { props: { override: null } })
    expect(w.text()).toBe('© 2026 SAP SE or an SAP affiliate company. All rights reserved.')
  })

  it('uses default text class when invert is false', () => {
    const w = mount(LegalNotice)
    expect(w.classes()).not.toContain('legal-notice--invert')
  })

  it('adds invert class when invert prop is true', () => {
    const w = mount(LegalNotice, { props: { invert: true } })
    expect(w.classes()).toContain('legal-notice--invert')
  })
})
