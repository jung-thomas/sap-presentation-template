import { describe, it, expect, vi } from 'vitest'

vi.mock('./_dataSources', () => ({
  presenters: {
    'thomas-jung': {
      slug: 'thomas-jung',
      name: 'Thomas Jung',
      title: 'Developer Advocate, SAP',
      initials: 'TJ',
      bio: 'Sample bio.',
      socials: [{ platform: 'linkedin', handle: 'thomas-jung' }]
    }
  },
  teams: {
    'dev-advocates': {
      slug: 'dev-advocates',
      name: 'Developer Advocates',
      members: ['thomas-jung']
    }
  },
  programs: {},
  event: {
    name: 'Test Event',
    date: '2026-06-13',
    defaultPresenter: 'thomas-jung'
  }
}))

import { resolvePresenter, resolveTeam, getEvent } from './data'

describe('data resolvers', () => {
  it('resolves a presenter by slug', () => {
    const p = resolvePresenter('thomas-jung')
    expect(p.name).toBe('Thomas Jung')
  })

  it('falls back to event default when slug is undefined', () => {
    const p = resolvePresenter()
    expect(p.slug).toBe('thomas-jung')
  })

  it('throws on unknown slug', () => {
    expect(() => resolvePresenter('nonexistent')).toThrow(/presenter "nonexistent" not found/)
  })

  it('resolves a team and inflates members to Presenter objects', () => {
    const team = resolveTeam('dev-advocates')
    expect(team.name).toBe('Developer Advocates')
    expect(team.presenters[0].name).toBe('Thomas Jung')
  })

  it('exposes the event object', () => {
    const e = getEvent()
    expect(e.name).toBe('Test Event')
    expect(e.defaultPresenter).toBe('thomas-jung')
  })
})
