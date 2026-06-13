import { describe, it, expect } from 'vitest'
import { emitTypographyTokensCss } from './emit-typography-tokens.mjs'

const SAMPLE_LAYOUTS = [
  {
    name: 'Cover A',
    placeholders: [
      { type: 'title', textStyles: { fontSize: 36, lineSpacing: 90 } }
    ],
    pics: []
  },
  {
    name: 'Title and Text',
    placeholders: [
      { type: 'title', textStyles: { fontSize: 28 } },
      { type: 'body', textStyles: { fontSize: 18, lineSpacing: 100 } }
    ],
    pics: []
  }
]

describe('emit-typography-tokens', () => {
  it('emits CSS with header comment under :root', () => {
    const css = emitTypographyTokensCss(SAMPLE_LAYOUTS)
    expect(css).toContain(':root {')
    expect(css).toMatch(/GENERATED/i)
  })

  it('emits cover title font size in rem', () => {
    const css = emitTypographyTokensCss(SAMPLE_LAYOUTS)
    expect(css).toMatch(/--typography-cover-title-size: \d+(\.\d+)?rem/)
  })

  it('emits content title and body sizes from "Title and Text"', () => {
    const css = emitTypographyTokensCss(SAMPLE_LAYOUTS)
    expect(css).toMatch(/--typography-content-title-size:/)
    expect(css).toMatch(/--typography-content-body-size:/)
  })

  it('emits line-spacing as a unitless multiplier (90 → 0.9, 100 → 1.0)', () => {
    const css = emitTypographyTokensCss(SAMPLE_LAYOUTS)
    expect(css).toMatch(/--typography-cover-title-line-height: 0\.9/)
    expect(css).toMatch(/--typography-content-body-line-height: 1\.0/)
  })

  it('skips layouts gracefully when textStyles missing', () => {
    const layouts = [{ name: 'Cover A', placeholders: [{ type: 'title' }], pics: [] }]
    const css = emitTypographyTokensCss(layouts)
    expect(css).toContain(':root {')
  })
})
