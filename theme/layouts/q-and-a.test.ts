import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('../setup/_dataSources', () => ({
  presenters: {
    'thomas-jung': {
      slug: 'thomas-jung',
      name: 'Thomas Jung',
      title: 'Developer Advocate, SAP',
      initials: 'TJ',
      bio: '',
      socials: []
    }
  },
  teams: {},
  programs: {},
  event: { name: 'X', defaultPresenter: 'thomas-jung' }
}))

import QAndA from './q-and-a.vue'

describe('<q-and-a>', () => {
  it('renders sap-blue-2 background + outlined Flat Anvil photo frame', () => {
    const w = mount(QAndA, { props: { frontmatter: {} } })
    expect(w.find('.qa').exists()).toBe(true)
    expect(w.find('.qa-anvil-frame').exists()).toBe(true)
  })

  it('defaults title to "Questions?" when frontmatter.title absent', () => {
    const w = mount(QAndA, { props: { frontmatter: {} } })
    expect(w.find('h1.qa-title').text()).toBe('Questions?')
  })

  it('renders custom title from frontmatter', () => {
    const w = mount(QAndA, { props: { frontmatter: { title: 'Join the conversation' } } })
    expect(w.find('h1.qa-title').text()).toBe('Join the conversation')
  })

  it('renders eyebrow when set', () => {
    const w = mount(QAndA, { props: { frontmatter: { eyebrow: 'Your perspective matters' } } })
    expect(w.find('.qa-eyebrow').text()).toBe('Your perspective matters')
  })

  it('omits eyebrow element when absent', () => {
    const w = mount(QAndA, { props: { frontmatter: {} } })
    expect(w.find('.qa-eyebrow').exists()).toBe(false)
  })

  it('renders subtitle when set', () => {
    const w = mount(QAndA, { props: { frontmatter: { subtitle: 'You ask. We answer.' } } })
    expect(w.find('.qa-subtitle').text()).toBe('You ask. We answer.')
  })

  it('omits subtitle element when absent', () => {
    const w = mount(QAndA, { props: { frontmatter: {} } })
    expect(w.find('.qa-subtitle').exists()).toBe(false)
  })

  it('renders photo when image is set', () => {
    const w = mount(QAndA, { props: { frontmatter: { image: '/covers/qa.png' } } })
    const img = w.find('.qa-photo img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toContain('/covers/qa.png')
  })

  it('omits photo element when image absent', () => {
    const w = mount(QAndA, { props: { frontmatter: {} } })
    expect(w.find('.qa-photo img').exists()).toBe(false)
  })
})
