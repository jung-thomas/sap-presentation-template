import { describe, it, expect } from 'vitest'
import { parseTagXml } from './parse-potx-tags.mjs'

describe('parse-potx-tags', () => {
  it('keeps SP_AGENDA values', () => {
    const xml = '<p:tagLst xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:tag name="SP_AGENDA" val="TOC TOCShowsSubsections Dividers SectionNumber SlideNumber"/></p:tagLst>'
    expect(parseTagXml(xml)).toEqual([
      { name: 'SP_AGENDA', value: 'TOC TOCShowsSubsections Dividers SectionNumber SlideNumber' }
    ])
  })

  it('drops third-party plugin tags', () => {
    const xml = '<p:tagLst xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:tag name="SP_POWERSHAPE" val="x"/><p:tag name="THINKCELLSHAPEDONOTDELETE" val="y"/><p:tag name="CONTAINEDIMAGEPATH" val="z"/></p:tagLst>'
    expect(parseTagXml(xml)).toEqual([])
  })

  it('handles mixed tags keeping only SP_AGENDA', () => {
    const xml = '<p:tagLst xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:tag name="SP_POWERSHAPE" val="a"/><p:tag name="SP_AGENDA" val="b c"/><p:tag name="LIBRARY" val="d"/></p:tagLst>'
    expect(parseTagXml(xml)).toEqual([
      { name: 'SP_AGENDA', value: 'b c' }
    ])
  })

  it('handles empty val attribute', () => {
    const xml = '<p:tagLst xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:tag name="SP_AGENDA" val=""/></p:tagLst>'
    expect(parseTagXml(xml)).toEqual([
      { name: 'SP_AGENDA', value: '' }
    ])
  })
})
