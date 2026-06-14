import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HarveyBall from './HarveyBall.vue'

describe('<HarveyBall>', () => {
  it('renders a circle (full ring) and a sector path', () => {
    const w = mount(HarveyBall, { props: { value: 3, of: 8 } })
    expect(w.find('svg circle').exists()).toBe(true)
    expect(w.find('svg path').exists()).toBe(true)
  })

  it('clamps value to [0, of]', () => {
    const w1 = mount(HarveyBall, { props: { value: 99, of: 8 } })
    const w2 = mount(HarveyBall, { props: { value: -1, of: 8 } })
    expect(w1.vm.$el.querySelector('path')!.getAttribute('d')).toMatch(/^M/)
    expect(w2.vm.$el.querySelector('path')).toBeFalsy() // 0/8 = no sector
  })
})
