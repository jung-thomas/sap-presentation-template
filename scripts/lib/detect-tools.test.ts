import { describe, it, expect } from 'vitest'
import { detectTools } from './detect-tools.mjs'

describe('detectTools', () => {
  it('returns booleans for soffice and pdftoppm', async () => {
    const r = await detectTools()
    expect(typeof r.soffice).toBe('boolean')
    expect(typeof r.pdftoppm).toBe('boolean')
  })
})
