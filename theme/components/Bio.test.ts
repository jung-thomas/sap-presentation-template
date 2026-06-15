// theme/components/Bio.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Must be hoisted before any import that transitively loads _dataSources,
// because _dataSources uses import.meta.glob which cannot run in the test env.
vi.mock('../setup/_dataSources', () => ({
  presenters: {
    'thomas-jung': {
      slug: 'thomas-jung',
      name: 'Thomas Jung',
      title: 'Developer Advocate, SAP',
      initials: 'TJ',
      bio: 'Sample bio.',
      socials: []
    }
  },
  teams: {},
  programs: {},
  event: {
    name: 'Test Event',
    date: '2026-06-14',
    defaultPresenter: 'thomas-jung'
  }
}))

import { mount } from '@vue/test-utils'
import Bio from './Bio.vue'

const TEAM_4 = [
  { name: 'Nina Thompson', role: 'Data Analyst', qr: 'https://x/n' },
  { name: 'Marcus Bennett', role: 'CSM', qr: 'https://x/m' },
  { name: 'Sofia Nguyen', role: 'QA Engineer', qr: 'https://x/s' },
  { name: 'Ethan Brooks', role: 'Tech Sales', qr: 'https://x/e' }
]

describe('<Bio> team mode', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  it('renders 4 cards when given 4 people', () => {
    const w = mount(Bio, { props: { people: TEAM_4 } })
    expect(w.findAll('.bio-card').length).toBe(4)
  })

  it('renders the AnvilGridDecoration band when in team mode', () => {
    const w = mount(Bio, { props: { people: TEAM_4 } })
    expect(w.find('.bio-band').exists()).toBe(true)
  })

  it('does NOT render its own title (host slide owns the title)', () => {
    const w = mount(Bio, { props: { people: TEAM_4 } })
    // No <h1> or "Meet our team" string anywhere in the Bio output
    expect(w.find('h1').exists()).toBe(false)
    expect(w.text()).not.toContain('Meet our team')
  })

  it('uses the team-mode bio--team root class (so :has() can target it)', () => {
    const w = mount(Bio, { props: { people: TEAM_4 } })
    expect(w.find('.bio--team').exists()).toBe(true)
  })

  it('warns in dev when people.length !== 4', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mount(Bio, { props: { people: TEAM_4.slice(0, 3) } })
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('expected 4 people'))
  })

  it('does NOT warn when people.length === 4', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mount(Bio, { props: { people: TEAM_4 } })
    expect(warn).not.toHaveBeenCalled()
  })

  it('warns and prefers team mode when both people and presenter are passed', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const w = mount(Bio, { props: { people: TEAM_4, presenter: 'thomas-jung' } })
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('mutually exclusive'))
    // Team mode rendered (4 cards), single-presenter card NOT rendered
    expect(w.findAll('.bio-card').length).toBe(4)
    expect(w.find('.bio--single').exists()).toBe(false)
  })

  it('renders each card with name and role text', () => {
    const w = mount(Bio, { props: { people: TEAM_4 } })
    const cards = w.findAll('.bio-card')
    expect(cards[0].text()).toContain('Nina Thompson')
    expect(cards[0].text()).toContain('Data Analyst')
    expect(cards[3].text()).toContain('Ethan Brooks')
    expect(cards[3].text()).toContain('Tech Sales')
  })
})

describe('<Bio> single-presenter mode (backward compat)', () => {
  it('renders a ui5-card when given a presenter slug', () => {
    const w = mount(Bio, {
      props: { presenter: 'thomas-jung' },
      global: {
        stubs: { 'ui5-card': true, 'ui5-card-header': true, 'ui5-avatar': true }
      }
    })
    expect(w.find('.bio--single').exists()).toBe(true)
  })

  it('does NOT render team-mode markup when only presenter is set', () => {
    const w = mount(Bio, {
      props: { presenter: 'thomas-jung' },
      global: {
        stubs: { 'ui5-card': true, 'ui5-card-header': true, 'ui5-avatar': true }
      }
    })
    expect(w.find('.bio--team').exists()).toBe(false)
    expect(w.find('.bio-card').exists()).toBe(false)
  })
})
