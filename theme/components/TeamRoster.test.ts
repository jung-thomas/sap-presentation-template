import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

// Mock _dataSources before importing the component under test. The mock has
// to define presenters AND a `dev-advocates` team that references those slugs,
// because TeamRoster goes through resolveTeam() → resolvePresenter() for each
// member and would throw on any missing slug.
vi.mock('../setup/_dataSources', () => {
  const mkP = (slug: string, name: string) => ({
    slug,
    name,
    title: 'Developer Advocate, SAP',
    initials: name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase(),
    bio: '',
    socials: [],
    photo: `/presenters/${slug}.webp`
  })
  return {
    presenters: {
      'thomas-jung': mkP('thomas-jung', 'Thomas Jung'),
      'dj-adams': mkP('dj-adams', 'DJ Adams'),
      'rich-heilman': mkP('rich-heilman', 'Rich Heilman')
    },
    teams: {
      'dev-advocates': {
        slug: 'dev-advocates',
        name: 'SAP Developer Advocates',
        tagline: 'Helping developers build the future.',
        members: [
          { slug: 'thomas-jung', qr: 'https://example.com/tj' },
          { slug: 'dj-adams', qr: 'https://example.com/dj' },
          { slug: 'rich-heilman' }
        ]
      }
    },
    programs: {},
    event: { name: 'X', defaultPresenter: 'thomas-jung' }
  }
})

import TeamRoster from './TeamRoster.vue'

describe('<TeamRoster>', () => {
  it('renders one card per team member', () => {
    const w = mount(TeamRoster, { props: { team: 'dev-advocates' } })
    expect(w.findAll('.roster-card')).toHaveLength(3)
  })

  it('renders the team tagline above the grid', () => {
    const w = mount(TeamRoster, { props: { team: 'dev-advocates' } })
    expect(w.find('.team-roster__tagline').text()).toBe('Helping developers build the future.')
  })

  it('splits the presenter name into first / last for compact display', () => {
    const w = mount(TeamRoster, { props: { team: 'dev-advocates' } })
    const firstNames = w.findAll('.roster-card__first').map((n) => n.text())
    expect(firstNames).toContain('Thomas')
    expect(firstNames).toContain('DJ')
    const lastNames = w.findAll('.roster-card__last').map((n) => n.text())
    expect(lastNames).toContain('Jung')
    expect(lastNames).toContain('Heilman')
  })

  it('honours an explicit columns prop', () => {
    const w = mount(TeamRoster, { props: { team: 'dev-advocates', columns: 6 } })
    const grid = w.find('.team-roster__grid')
    expect((grid.element as HTMLElement).style.gridTemplateColumns).toBe('repeat(6, 1fr)')
  })

  it('falls back to auto-fit columns when columns prop is omitted', () => {
    const w = mount(TeamRoster, { props: { team: 'dev-advocates' } })
    const grid = w.find('.team-roster__grid')
    expect((grid.element as HTMLElement).style.gridTemplateColumns).toContain('auto-fit')
  })

  it('renders the photo when set, otherwise an initials placeholder', () => {
    const w = mount(TeamRoster, { props: { team: 'dev-advocates' } })
    // All three mock members have photos
    expect(w.findAll('.roster-card__photo img')).toHaveLength(3)
    expect(w.find('.roster-card__placeholder').exists()).toBe(false)
  })

  it('throws when the team slug is unknown', () => {
    // Vue test-utils swallows the throw inside setup; resolveTeam() throws
    // synchronously when called from the component, so mount itself rejects.
    expect(() => mount(TeamRoster, { props: { team: 'nope' } })).toThrow(/team "nope" not found/)
  })
})
