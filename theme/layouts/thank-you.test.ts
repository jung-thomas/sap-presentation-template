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
      socials: [],
      email: 'thomas.jung@sap.com',
      address: '3999 West Chester Pike',
      city: 'Newtown Square, PA 19073'
    },
    minimal: {
      slug: 'minimal',
      name: 'Minimal',
      title: 'Role',
      initials: 'M',
      bio: '',
      socials: []
    }
  },
  teams: {},
  programs: {},
  event: { name: 'X', defaultPresenter: 'thomas-jung' }
}))

import ThankYou from './thank-you.vue'

describe('<thank-you> variant resolution', () => {
  it('defaults to variant b when frontmatter.variant absent (backward-compat with v0.3)', () => {
    const w = mount(ThankYou, { props: { frontmatter: {} } })
    expect(w.find('.thank-you--b').exists()).toBe(true)
  })

  it('renders variant a when explicitly set', () => {
    const w = mount(ThankYou, { props: { frontmatter: { variant: 'a' } } })
    expect(w.find('.thank-you--a').exists()).toBe(true)
  })

  it('variant a renders SapTaglineLockup + LegalNotice + "Contact information:" label', () => {
    const w = mount(ThankYou, { props: { frontmatter: { variant: 'a' } } })
    expect(w.find('.tagline-lockup').exists()).toBe(true)
    expect(w.find('.legal-notice').exists()).toBe(true)
    expect(w.text()).toContain('Contact information:')
  })

  it('variant b renders the anvil header band', () => {
    const w = mount(ThankYou, {
      props: { frontmatter: { variant: 'b', presenter: 'thomas-jung' } }
    })
    expect(w.find('.thanks-band').exists()).toBe(true)
  })

  it('variant b renders "Thank you." heading + presenter contact card', () => {
    const w = mount(ThankYou, {
      props: { frontmatter: { variant: 'b', presenter: 'thomas-jung' } }
    })
    expect(w.find('h1.thanks-headline').text()).toBe('Thank you.')
    expect(w.text()).toContain('Thomas Jung')
    expect(w.text()).toContain('Developer Advocate, SAP')
  })

  it('variant b renders presenter contact lines when fixture has them', () => {
    const w = mount(ThankYou, {
      props: { frontmatter: { variant: 'b', presenter: 'thomas-jung' } }
    })
    expect(w.text()).toContain('thomas.jung@sap.com')
    expect(w.text()).toContain('3999 West Chester Pike')
    expect(w.text()).toContain('Newtown Square, PA 19073')
  })

  it('variant b suppresses absent contact lines (presenter without address/city/email)', () => {
    const w = mount(ThankYou, {
      props: { frontmatter: { variant: 'b', presenter: 'minimal' } }
    })
    expect(w.text()).not.toContain('thomas.jung@sap.com')
    expect(w.text()).toContain('Minimal')
    expect(w.text()).toContain('Role')
  })

  it('variant b renders QR code when qrUrl is set', () => {
    const w = mount(ThankYou, {
      props: {
        frontmatter: { variant: 'b', presenter: 'thomas-jung', qrUrl: 'https://example.com' }
      }
    })
    expect(w.find('.thanks-qr').exists()).toBe(true)
  })

  it('variant b renders no QR when qrUrl is absent', () => {
    const w = mount(ThankYou, {
      props: { frontmatter: { variant: 'b', presenter: 'thomas-jung' } }
    })
    expect(w.find('.thanks-qr').exists()).toBe(false)
  })

  it('renders LegalNotice with override when legalNotice front-matter set', () => {
    const w = mount(ThankYou, {
      props: { frontmatter: { variant: 'a', legalNotice: 'Custom legal text 2099' } }
    })
    expect(w.text()).toContain('Custom legal text 2099')
  })
})
