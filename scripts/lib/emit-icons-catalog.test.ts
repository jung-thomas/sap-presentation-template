import { describe, it, expect } from 'vitest'
import { buildIconsCatalog } from './emit-icons-catalog.mjs'

describe('emit-icons-catalog', () => {
  it('maps each icon to {src, viewBox}', () => {
    const icons = [
      { src: 'image28.svg', name: 'wrench', viewBox: '0 0 43.18 43.18' },
      { src: 'image50.svg', name: 'family-care', viewBox: '0 0 96.21 96.21' }
    ]
    expect(buildIconsCatalog(icons)).toEqual({
      wrench: { src: '/sap/icons/wrench.svg', viewBox: '0 0 43.18 43.18' },
      'family-care': { src: '/sap/icons/family-care.svg', viewBox: '0 0 96.21 96.21' }
    })
  })

  it('throws on duplicate icon names', () => {
    const icons = [
      { src: 'image28.svg', name: 'wrench', viewBox: '0 0 96 96' },
      { src: 'image99.svg', name: 'wrench', viewBox: '0 0 96 96' }
    ]
    expect(() => buildIconsCatalog(icons)).toThrow(/duplicate icon name/i)
  })
})
