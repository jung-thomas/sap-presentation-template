import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('./Disclaimer.vue', () => ({
  default: {
    name: 'Disclaimer',
    template: '<div data-testid="disclaimer">{{ kind }}</div>',
    props: ['kind']
  }
}))

import Roadmap from './Roadmap.vue'

describe('Roadmap', () => {
  const phases = [
    { label: 'Q3 2025', status: 'planned' as const, items: ['feature A'] },
    { label: 'Q4 2025', status: 'available' as const, items: ['feature B'] }
  ]

  it('renders phases', () => {
    const wrapper = mount(Roadmap, { props: { phases } })
    expect(wrapper.text()).toContain('Q3 2025')
    expect(wrapper.text()).toContain('feature A')
  })

  it('auto-includes forward-looking disclaimer by default', () => {
    const wrapper = mount(Roadmap, { props: { phases } })
    const d = wrapper.find('[data-testid="disclaimer"]')
    expect(d.exists()).toBe(true)
    expect(d.text()).toBe('forward-looking')
  })

  it('suppresses disclaimer when suppressDisclaimer=true', () => {
    const wrapper = mount(Roadmap, { props: { phases, suppressDisclaimer: true } })
    expect(wrapper.find('[data-testid="disclaimer"]').exists()).toBe(false)
  })
})
