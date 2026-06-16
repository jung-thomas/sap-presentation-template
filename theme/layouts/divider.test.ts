import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Divider from './divider.vue'

describe('<divider>', () => {
  it('renders the canonical POTX divider with anvil band', () => {
    const w = mount(Divider, { props: { frontmatter: { title: 'Test' } } })
    expect(w.find('.divider').exists()).toBe(true)
    expect(w.find('.divider-anvil-band').exists()).toBe(true)
  })

  it('renders the title from frontmatter', () => {
    const w = mount(Divider, { props: { frontmatter: { title: 'Foundations' } } })
    expect(w.find('h1.divider-title').text()).toBe('Foundations')
  })

  it('uses the primary SAP logo (POTX has the logo on the white top half)', () => {
    const w = mount(Divider, { props: { frontmatter: { title: 'X' } } })
    const src = w.find('img.divider-logo').attributes('src')
    expect(src).toContain('logo-sap-primary')
  })

  it('ignores the legacy variant: front-matter (collapsed in v0.4.2.3)', () => {
    // Decks that previously set variant:a/b/c/d should still render — just
    // with the canonical POTX design. No throw, no missing band.
    for (const v of ['a', 'b', 'c', 'd']) {
      const w = mount(Divider, { props: { frontmatter: { title: 'X', variant: v } } })
      expect(w.find('.divider-anvil-band').exists()).toBe(true)
    }
  })

  it('renders ClassificationFooter from frontmatter.classification', () => {
    const w = mount(Divider, {
      props: { frontmatter: { title: 'X', classification: 'PUBLIC' } },
    })
    expect(w.text()).toContain('PUBLIC')
  })
})
