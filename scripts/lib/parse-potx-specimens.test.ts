import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseSpecimen } from './parse-potx-specimens.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const SLIDE = readFileSync(resolve(here, 'fixtures/specimen-slide.xml'), 'utf-8')
const RELS  = readFileSync(resolve(here, 'fixtures/specimen-slide.xml.rels'), 'utf-8')

describe('parse-potx-specimens', () => {
  it('extracts title (concatenated, entity-decoded), layout, dynamic fields, media, hidden', () => {
    const r = parseSpecimen({ slideXml: SLIDE, relsXml: RELS, slideNumber: 14 })
    expect(r).toMatchObject({
      slideNumber: 14,
      hidden: true,
      title: 'Meet our team & friends',
      layout: 'slideLayout14.xml',
      dynamicFields: [
        'Spaker name - Dynamic',
        'Date - Dynamic',
        'Partner Logo Placeholder'
      ],
      media: ['image38.svg']
    })
    expect(r.dynamicFields).not.toContain('Rectangle 22')
    expect(r.dynamicFields).not.toContain('Title 1')
  })
})
