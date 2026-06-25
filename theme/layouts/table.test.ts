import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('../setup/_dataSources', () => ({
  presenters: {},
  teams: {},
  programs: {},
  event: { name: 'Test', date: '2026-01-01', defaultPresenter: 'test' }
}))

import TableLayout from './table.vue'

describe('<table> layout', () => {
  it('renders the slot content unchanged', () => {
    const w = mount(TableLayout, {
      props: { frontmatter: { title: 'CAP vs. ABAP' } },
      slots: {
        default:
          '<table><thead><tr><th>A</th></tr></thead><tbody><tr><td>1</td></tr></tbody></table>'
      }
    })
    expect(w.find('table').exists()).toBe(true)
    expect(w.find('thead th').text()).toBe('A')
    expect(w.find('tbody td').text()).toBe('1')
  })

  it('renders an h1 only when title is set', () => {
    const w1 = mount(TableLayout, {
      props: { frontmatter: { title: 'CAP vs. ABAP' } },
      slots: { default: '<table></table>' }
    })
    expect(w1.find('h1').text()).toBe('CAP vs. ABAP')

    const w2 = mount(TableLayout, {
      props: { frontmatter: {} },
      slots: { default: '<table></table>' }
    })
    expect(w2.find('h1').exists()).toBe(false)
  })

  it('wraps the slot content in .table-frame (so scoped :deep(thead) selectors can match)', () => {
    const w = mount(TableLayout, {
      slots: { default: '<table><thead><tr><th>H</th></tr></thead></table>' }
    })
    expect(w.find('.table-frame thead').exists()).toBe(true)
  })

  it('renders ClassificationFooter from frontmatter.classification', () => {
    const w = mount(TableLayout, {
      props: { frontmatter: { classification: 'PUBLIC' } },
      slots: { default: '<table></table>' }
    })
    expect(w.text()).toContain('PUBLIC')
  })
})
