import { describe, it, expect } from 'vitest'
import { parseAgendaConfig } from './emit-agenda-defaults.mjs'

describe('emit-agenda-defaults', () => {
  it('parses the canonical POTX agenda flag string', () => {
    expect(parseAgendaConfig('TOC TOCShowsSubsections Dividers SectionNumber SlideNumber')).toEqual({
      toc: true, showSubsections: true, dividers: true, sectionNumbers: true, slideNumbers: true
    })
  })

  it('returns all-false defaults for empty input', () => {
    expect(parseAgendaConfig('')).toEqual({
      toc: false, showSubsections: false, dividers: false, sectionNumbers: false, slideNumbers: false
    })
  })

  it('ignores unknown flags', () => {
    expect(parseAgendaConfig('TOC FrobnicateAggressively SlideNumber')).toMatchObject({
      toc: true, slideNumbers: true
    })
  })
})
