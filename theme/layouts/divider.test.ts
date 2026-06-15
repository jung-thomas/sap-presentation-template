import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Divider from './divider.vue'

const VARIANT_TESTS: Array<{
  v: string
  bgClass: string
  expectAnvilGrid: boolean
  expectFlatAnvils: number
}> = [
  { v: 'a', bgClass: 'divider--a', expectAnvilGrid: false, expectFlatAnvils: 0 },
  { v: 'b', bgClass: 'divider--b', expectAnvilGrid: false, expectFlatAnvils: 4 },
  { v: 'c', bgClass: 'divider--c', expectAnvilGrid: true, expectFlatAnvils: 0 },
  { v: 'd', bgClass: 'divider--d', expectAnvilGrid: false, expectFlatAnvils: 0 }
]

describe('<divider> variant resolution', () => {
  for (const t of VARIANT_TESTS) {
    it(`variant ${t.v}: applies .${t.bgClass} class, ${t.expectAnvilGrid ? 'has' : 'no'} AnvilGrid, ${t.expectFlatAnvils} FlatAnvil shapes`, () => {
      const w = mount(Divider, { props: { frontmatter: { variant: t.v, title: 'Test' } } })
      expect(w.find(`.${t.bgClass}`).exists()).toBe(true)
      expect(w.find('.divider-anvil-grid').exists()).toBe(t.expectAnvilGrid)
      expect(w.findAll('.divider-flat-anvil').length).toBe(t.expectFlatAnvils)
    })
  }

  it('defaults to variant a when frontmatter.variant absent', () => {
    const w = mount(Divider, { props: { frontmatter: { title: 'Test' } } })
    expect(w.find('.divider--a').exists()).toBe(true)
  })

  it('renders the title from frontmatter', () => {
    const w = mount(Divider, { props: { frontmatter: { variant: 'a', title: 'Foundations' } } })
    expect(w.find('h1.divider-title').text()).toBe('Foundations')
  })

  it('uses the white SAP logo on the dark variant (b only)', () => {
    const w = mount(Divider, { props: { frontmatter: { variant: 'b', title: 'X' } } })
    const src = w.find('img.divider-logo').attributes('src')
    expect(src).toContain('logo-sap-white')
  })

  it('uses the primary SAP logo on light variants (a, c, d) — logo anchor sits on white in all three', () => {
    for (const v of ['a', 'c', 'd']) {
      const w = mount(Divider, { props: { frontmatter: { variant: v, title: 'X' } } })
      const src = w.find('img.divider-logo').attributes('src')
      expect(src).toContain('logo-sap-primary')
    }
  })
})
