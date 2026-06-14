import { describe, it, expect, vi } from 'vitest'
import { resolveFontConfig } from './font'

describe('resolveFontConfig', () => {
  it('defaults to sap when undefined', () => {
    expect(resolveFontConfig(undefined)).toBe('sap')
  })

  it('honors inter override', () => {
    expect(resolveFontConfig({ font: 'inter' })).toBe('inter')
  })

  it('rejects unknown values with warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(resolveFontConfig({ font: 'comic-sans' })).toBe('sap')
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })
})
