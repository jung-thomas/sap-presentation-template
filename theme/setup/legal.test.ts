import { describe, it, expect } from 'vitest'
import { LEGAL_NOTICE, getLegalNotice } from './legal'

describe('legal', () => {
  it('LEGAL_NOTICE is a string with year + SAP SE + rights reserved', () => {
    expect(typeof LEGAL_NOTICE).toBe('string')
    expect(LEGAL_NOTICE).toMatch(/©\s+\d{4}\s+SAP SE/)
    expect(LEGAL_NOTICE).toMatch(/All rights reserved/)
  })

  it('getLegalNotice() returns the constant when no override given', () => {
    expect(getLegalNotice()).toBe(LEGAL_NOTICE)
  })

  it('getLegalNotice(override) returns the override string', () => {
    expect(getLegalNotice('Custom legal text')).toBe('Custom legal text')
  })

  it('getLegalNotice(undefined) returns the constant', () => {
    expect(getLegalNotice(undefined)).toBe(LEGAL_NOTICE)
  })

  it('getLegalNotice(null) returns the constant', () => {
    expect(getLegalNotice(null as unknown as string)).toBe(LEGAL_NOTICE)
  })

  it('getLegalNotice("") returns the constant (empty string falls through to default)', () => {
    expect(getLegalNotice('')).toBe(LEGAL_NOTICE)
  })
})
