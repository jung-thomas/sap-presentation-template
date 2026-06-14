import { describe, it, expect } from 'vitest'
import { buildLayoutManifest } from './emit-layout-manifest.mjs'

describe('emit-layout-manifest', () => {
  const layouts = [
    { file: 'slideLayout1.xml', name: 'Cover A', placeholders: [], pics: [] },
    { file: 'slideLayout30.xml', name: 'Quote', placeholders: [], pics: [] },
    { file: 'slideLayout45.xml', name: '>DO NOT USE>', placeholders: [], pics: [] }
  ]
  const decisions = {
    slideLayout1: { status: 'ship', vueLayout: 'cover', variant: 'a' },
    slideLayout30: { status: 'ship', vueLayout: 'quote' },
    slideLayout45: { status: 'exclude', reason: '>DO NOT USE> POTX self-deprecated' }
  }

  it('merges layouts + decisions into manifest entries', () => {
    const m = buildLayoutManifest({ layouts, decisions })
    expect(m.layouts).toContainEqual(
      expect.objectContaining({
        file: 'slideLayout1.xml',
        name: 'Cover A',
        status: 'ship',
        vueLayout: 'cover',
        variant: 'a'
      })
    )
    expect(m.layouts).toContainEqual(
      expect.objectContaining({
        file: 'slideLayout45.xml',
        status: 'exclude'
      })
    )
  })

  it('throws when a POTX layout has no decision', () => {
    const incomplete = { slideLayout1: decisions.slideLayout1 }
    expect(() => buildLayoutManifest({ layouts, decisions: incomplete })).toThrow(
      /Layout slideLayout30.*no decision/i
    )
  })

  it('reports bucket totals', () => {
    const m = buildLayoutManifest({ layouts, decisions })
    expect(m.totals).toEqual({ ship: 2, alias: 0, exclude: 1, total: 3 })
  })

  it('preserves all decision fields in output', () => {
    const m = buildLayoutManifest({ layouts, decisions })
    const coverA = m.layouts.find((l) => l.file === 'slideLayout1.xml')
    expect(coverA).toHaveProperty('vueLayout', 'cover')
    expect(coverA).toHaveProperty('variant', 'a')
    expect(coverA).toHaveProperty('status', 'ship')
  })

  it('handles alias entries with redirectTo', () => {
    const aliasDecisions = {
      slideLayout40: { status: 'alias', redirectTo: 'title-only' }
    }
    const aliasLayouts = [{ file: 'slideLayout40.xml', name: 'Alias', placeholders: [], pics: [] }]
    const m = buildLayoutManifest({ layouts: aliasLayouts, decisions: aliasDecisions })
    expect(m.layouts[0]).toHaveProperty('redirectTo', 'title-only')
    expect(m.totals.alias).toBe(1)
  })

  it('counts all status buckets correctly', () => {
    const mixed = {
      slideLayout1: { status: 'ship', vueLayout: 'cover' },
      slideLayout2: { status: 'ship', vueLayout: 'agenda' },
      slideLayout3: { status: 'alias', redirectTo: 'cover' },
      slideLayout4: { status: 'exclude', reason: 'deprecated' }
    }
    const mixedLayouts = [
      { file: 'slideLayout1.xml', name: 'A', placeholders: [], pics: [] },
      { file: 'slideLayout2.xml', name: 'B', placeholders: [], pics: [] },
      { file: 'slideLayout3.xml', name: 'C', placeholders: [], pics: [] },
      { file: 'slideLayout4.xml', name: 'D', placeholders: [], pics: [] }
    ]
    const m = buildLayoutManifest({ layouts: mixedLayouts, decisions: mixed })
    expect(m.totals).toEqual({ ship: 2, alias: 1, exclude: 1, total: 4 })
  })

  it('error message references the spec section', () => {
    const incomplete = { slideLayout1: decisions.slideLayout1 }
    try {
      buildLayoutManifest({ layouts, decisions: incomplete })
    } catch (e) {
      expect(e.message).toMatch(/spec\s+§/i)
    }
  })
})
