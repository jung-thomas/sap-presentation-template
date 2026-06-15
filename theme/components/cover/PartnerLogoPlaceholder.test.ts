// theme/components/cover/PartnerLogoPlaceholder.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PartnerLogoPlaceholder from './PartnerLogoPlaceholder.vue'

describe('<PartnerLogoPlaceholder>', () => {
  it('renders dashed placeholder when logo is undefined', () => {
    const w = mount(PartnerLogoPlaceholder, { props: { textOnL: 'dark' } })
    expect(w.find('.partner-placeholder').exists()).toBe(true)
    expect(w.find('.partner-placeholder').text()).toContain('Add partner logo and alt text')
    expect(w.find('img').exists()).toBe(false)
  })

  it('renders <img> when logo is a string', () => {
    const w = mount(PartnerLogoPlaceholder, {
      props: { logo: '/covers/partner.png', textOnL: 'dark' }
    })
    expect(w.find('img').exists()).toBe(true)
    expect(w.find('img').attributes('src')).toContain('/covers/partner.png')
    expect(w.find('.partner-placeholder').exists()).toBe(false)
  })

  it('renders nothing when logo is null', () => {
    const w = mount(PartnerLogoPlaceholder, {
      props: { logo: null, textOnL: 'dark' }
    })
    expect(w.find('img').exists()).toBe(false)
    expect(w.find('.partner-placeholder').exists()).toBe(false)
    // The component should be a single <div v-if> — element shouldn't render at all.
    // Vue 3 renders <!--v-if--> as the anchor comment when v-if is false.
    expect(w.html()).toMatch(/<!--v-if-->|<!---->|^$/)
  })

  it('uses white border when textOnL is light (dark background)', () => {
    const w = mount(PartnerLogoPlaceholder, { props: { textOnL: 'light' } })
    const el = w.find('.partner-placeholder')
    expect(el.classes()).toContain('placeholder-light')
  })

  it('uses grey border when textOnL is dark (light background)', () => {
    const w = mount(PartnerLogoPlaceholder, { props: { textOnL: 'dark' } })
    const el = w.find('.partner-placeholder')
    expect(el.classes()).toContain('placeholder-dark')
  })
})
