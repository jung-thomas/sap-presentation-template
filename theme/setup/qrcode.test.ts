import { describe, it, expect } from 'vitest'
import { makeQrDataUrl } from './qrcode'

describe('makeQrDataUrl', () => {
  it('returns a data:image/png URL for a valid URL', async () => {
    const url = await makeQrDataUrl('https://sap.com', 100)
    expect(url).toMatch(/^data:image\/png;base64,/)
    expect(url.length).toBeGreaterThan(200)
  })
})
