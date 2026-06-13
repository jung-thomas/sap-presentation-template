import { describe, it, expect } from 'vitest'
import { emitCoverTokensCss } from './emit-cover-tokens.mjs'

const SAMPLE_LAYOUTS = [
  {
    name: 'Cover A',
    placeholders: [
      { type: 'title', x: 503238, y: 2706317, cx: 4765449, cy: 997196 },
      { type: 'pic', x: 5969000, y: 0, cx: 6226175, cy: 6858000 }
    ],
    pics: [{ name: 'LogoBlue-Dynamic', x: 504000, y: 504000, cx: 727192, cy: 360000 }]
  }
]

describe('emit-cover-tokens', () => {
  it('emits CSS custom properties under :root with header comment', () => {
    const css = emitCoverTokensCss(SAMPLE_LAYOUTS)
    expect(css).toContain(':root {')
    expect(css).toMatch(/GENERATED/i)
  })

  it('derives logo position from Cover A pic geometry as percentages', () => {
    const css = emitCoverTokensCss(SAMPLE_LAYOUTS)
    expect(css).toMatch(/--cover-logo-top: 7\.35%/)
    expect(css).toMatch(/--cover-logo-left: 4\.13%/)
    expect(css).toMatch(/--cover-logo-width: 5\.96%/)
  })

  it('derives title position from Cover A title placeholder', () => {
    const css = emitCoverTokensCss(SAMPLE_LAYOUTS)
    expect(css).toMatch(/--cover-title-top: 39\.46%/)
    expect(css).toMatch(/--cover-title-left: 4\.13%/)
    expect(css).toMatch(/--cover-title-width: 39\.0[89]%/)
  })

  it('derives photo placeholder position from Cover A pic placeholder', () => {
    const css = emitCoverTokensCss(SAMPLE_LAYOUTS)
    expect(css).toMatch(/--cover-photo-left: 48\.9[56]%/)
    expect(css).toMatch(/--cover-photo-width: 51\.0[4567]%/)
  })

  it('handles missing Cover A gracefully', () => {
    expect(() => emitCoverTokensCss([])).toThrow(/Cover A not found/)
  })
})
