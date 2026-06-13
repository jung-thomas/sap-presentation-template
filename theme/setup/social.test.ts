import { describe, it, expect } from 'vitest'
import { socialUrl } from './social'

describe('socialUrl', () => {
  it('builds LinkedIn URL', () => {
    expect(socialUrl({ platform: 'linkedin', handle: 'thomas-jung' })).toBe(
      'https://www.linkedin.com/in/thomas-jung'
    )
  })
  it('builds GitHub URL', () => {
    expect(socialUrl({ platform: 'github', handle: 'thomasjung' })).toBe(
      'https://github.com/thomasjung'
    )
  })
  it('builds X URL', () => {
    expect(socialUrl({ platform: 'x', handle: 'sapdevs' })).toBe('https://x.com/sapdevs')
  })
  it('respects explicit url override', () => {
    expect(socialUrl({ platform: 'mastodon', handle: 'me', url: 'https://hachyderm.io/@me' })).toBe(
      'https://hachyderm.io/@me'
    )
  })
})
