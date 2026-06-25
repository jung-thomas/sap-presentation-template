import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('../setup/_dataSources', () => ({
  presenters: {},
  teams: {},
  programs: {},
  event: { name: 'Test', date: '2026-01-01', defaultPresenter: 'test' }
}))

import Quote from './quote.vue'

describe('<quote>', () => {
  it('renders with sap-blue-2 background and a flat-anvil highlight behind text', () => {
    const w = mount(Quote, { props: { frontmatter: {} } })
    expect(w.find('.quote').exists()).toBe(true)
    expect(w.find('.quote-highlight').exists()).toBe(true)
  })

  it('renders the "Quote" eyebrow label top-left', () => {
    const w = mount(Quote, { props: { frontmatter: {} } })
    expect(w.find('.quote-eyebrow').text()).toBe('Quote')
  })

  it('renders author from frontmatter', () => {
    const w = mount(Quote, { props: { frontmatter: { author: 'Steve Lucas' } } })
    expect(w.text()).toContain('Steve Lucas')
  })

  it('renders company (new field)', () => {
    const w = mount(Quote, { props: { frontmatter: { author: 'Steve Lucas', company: 'SAP' } } })
    expect(w.text()).toContain('SAP')
  })

  it('renders role (new field)', () => {
    const w = mount(Quote, { props: { frontmatter: { author: 'Steve Lucas', role: 'CEO' } } })
    expect(w.text()).toContain('CEO')
  })

  it('falls back to source as company alias (v0.3 backward-compat)', () => {
    const w = mount(Quote, { props: { frontmatter: { author: 'Foo', source: 'OldCorp' } } })
    expect(w.text()).toContain('OldCorp')
  })

  it('prefers company over source when both present', () => {
    const w = mount(Quote, {
      props: { frontmatter: { author: 'Foo', company: 'NewCorp', source: 'OldCorp' } }
    })
    expect(w.text()).toContain('NewCorp')
    expect(w.text()).not.toContain('OldCorp')
  })

  it('omits role line when role is absent', () => {
    const w = mount(Quote, { props: { frontmatter: { author: 'Foo', company: 'Bar' } } })
    expect(w.find('.quote-role').exists()).toBe(false)
  })
})
