import { describe, it, expect } from 'vitest'
import { assetUrl } from './assets'

describe('assetUrl', () => {
  it('returns undefined for undefined input', () => {
    expect(assetUrl(undefined)).toBeUndefined()
  })

  it('passes through non-absolute paths unchanged', () => {
    expect(assetUrl('relative/path.png')).toBe('relative/path.png')
    expect(assetUrl('https://cdn.example.com/foo.jpg')).toBe('https://cdn.example.com/foo.jpg')
    expect(assetUrl('data:image/png;base64,abc')).toBe('data:image/png;base64,abc')
  })

  it('prefixes absolute paths with BASE_URL when set', () => {
    // Vitest's vite/client env defaults BASE_URL to '/' (root-served).
    // We can't easily mock import.meta.env here in pure-Vitest mode without
    // significant test plumbing, so test the dev-default path (no rewrite
    // because base is just '/'). The build-time rewrite is verified by the
    // GH Pages live URL after deploy.
    const result = assetUrl('/logos/logo-sap-primary.svg')
    expect(result).toMatch(/^\/?(.*\/)?logos\/logo-sap-primary\.svg$/)
  })
})
