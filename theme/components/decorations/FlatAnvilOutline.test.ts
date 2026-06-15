import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FlatAnvilOutline from './FlatAnvilOutline.vue'

describe('<FlatAnvilOutline>', () => {
  it('renders an svg with the canonical FlatAnvil path', () => {
    const w = mount(FlatAnvilOutline)
    const svg = w.find('svg')
    expect(svg.exists()).toBe(true)
    expect(svg.attributes('viewBox')).toBe('0 0 605 297')
    const path = w.find('path')
    expect(path.attributes('d')).toBe('M0 0 0 297 307.459 297 605 0 0 0Z')
  })

  it('renders as a stroke, not a fill', () => {
    const w = mount(FlatAnvilOutline)
    const path = w.find('path')
    expect(path.attributes('fill')).toBe('none')
    expect(path.attributes('stroke')).toBeTruthy()
  })

  it('uses sap-blue-6 stroke color by default', () => {
    const w = mount(FlatAnvilOutline)
    const path = w.find('path')
    expect(path.attributes('stroke')).toBe('var(--sap-blue-6)')
  })

  it('respects color prop override', () => {
    const w = mount(FlatAnvilOutline, { props: { color: 'red' } })
    expect(w.find('path').attributes('stroke')).toBe('red')
  })

  it('uses default stroke-width of 6 (1080-relative thin outline)', () => {
    const w = mount(FlatAnvilOutline)
    expect(w.find('path').attributes('stroke-width')).toBe('6')
  })

  it('respects strokeWidth prop override', () => {
    const w = mount(FlatAnvilOutline, { props: { strokeWidth: 12 } })
    expect(w.find('path').attributes('stroke-width')).toBe('12')
  })
})
