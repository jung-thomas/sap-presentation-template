// theme/components/agenda/AgendaItem.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AgendaItem from './AgendaItem.vue'

describe('<AgendaItem>', () => {
  it('renders the 1-based index zero-padded to 2 digits', () => {
    const w = mount(AgendaItem, { props: { index: 0, title: 'Foo' } })
    expect(w.find('.agenda-item__num').text()).toBe('01')

    const w10 = mount(AgendaItem, { props: { index: 9, title: 'Bar' } })
    expect(w10.find('.agenda-item__num').text()).toBe('10')
  })

  it('renders the title in a label slot', () => {
    const w = mount(AgendaItem, { props: { index: 0, title: 'Foundations of CAP' } })
    expect(w.find('.agenda-item__title').text()).toBe('Foundations of CAP')
  })

  it('renders the description when provided', () => {
    const w = mount(AgendaItem, {
      props: { index: 0, title: 'Foo', description: 'A short blurb' }
    })
    expect(w.find('.agenda-item__description').exists()).toBe(true)
    expect(w.find('.agenda-item__description').text()).toBe('A short blurb')
  })

  it('hides the description element when description is omitted', () => {
    const w = mount(AgendaItem, { props: { index: 0, title: 'Foo' } })
    expect(w.find('.agenda-item__description').exists()).toBe(false)
  })

  it('renders a hairline by default', () => {
    const w = mount(AgendaItem, { props: { index: 0, title: 'Foo' } })
    expect(w.find('.agenda-item').classes()).toContain('agenda-item--with-hairline')
  })

  it('omits the hairline when isLast=true (last row in list)', () => {
    const w = mount(AgendaItem, { props: { index: 4, title: 'Foo', isLast: true } })
    expect(w.find('.agenda-item').classes()).not.toContain('agenda-item--with-hairline')
  })
})
