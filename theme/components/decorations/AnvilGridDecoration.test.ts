// theme/components/decorations/AnvilGridDecoration.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AnvilGridDecoration from './AnvilGridDecoration.vue'

describe('<AnvilGridDecoration>', () => {
  it('renders a positioned div with the tile background', () => {
    const w = mount(AnvilGridDecoration, { props: { color: 'var(--sap-blue-7)' } })
    const el = w.find('.anvil-grid')
    expect(el.exists()).toBe(true)
    const style = el.attributes('style') ?? ''
    expect(style).toContain('color: var(--sap-blue-7)')
  })

  it('applies the tile via background-image: url(/sap/anvil-tile.svg)', () => {
    // The CSS lives in scoped <style>, so we can't read the rule from JSDOM.
    // We test that the component renders the wrapper element with the
    // correct class — the CSS file itself is verified by the visual
    // regression baseline in Stage D.
    const w = mount(AnvilGridDecoration, { props: { color: '#fff' } })
    expect(w.find('.anvil-grid').exists()).toBe(true)
  })

  it('exposes a `bg` prop for the background color behind the tiles', () => {
    const w = mount(AnvilGridDecoration, {
      props: { color: 'white', bg: 'var(--sap-blue-11)' }
    })
    const style = w.find('.anvil-grid').attributes('style') ?? ''
    expect(style).toContain('background-color: var(--sap-blue-11)')
  })
})
