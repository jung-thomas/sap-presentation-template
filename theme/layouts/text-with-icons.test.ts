import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TextWithIcons from './text-with-icons.vue'

const SIX_ITEMS = [
  { icon: 'lightbulb', title: 'Productivity', description: 'Less boilerplate.' },
  { icon: 'people-connected', title: 'Reuse', description: 'Composable services.' },
  { icon: 'target-group', title: 'Focus', description: 'Domain-driven design.' },
  { icon: 'lightbulb', title: 'Speed', description: 'Faster delivery.' },
  { icon: 'people-connected', title: 'Quality', description: 'Built-in tests.' },
  { icon: 'target-group', title: 'Scale', description: 'Cloud-native.' }
]

describe('<text-with-icons> layout', () => {
  it('renders all 6 items in a 3×2 grid (POTX-faithful)', () => {
    const w = mount(TextWithIcons, {
      props: { frontmatter: { title: 'Why CAP?', items: SIX_ITEMS } }
    })
    expect(w.findAll('.text-with-icons-cell')).toHaveLength(6)
    expect(w.find('.text-with-icons-grid').classes()).toContain('cols-3')
  })

  it('renders an h1 only when title is set', () => {
    const w = mount(TextWithIcons, {
      props: { frontmatter: { items: SIX_ITEMS } }
    })
    expect(w.find('h1').exists()).toBe(false)
  })

  it('renders SapIcon for each item with the requested name', () => {
    const w = mount(TextWithIcons, {
      props: { frontmatter: { items: SIX_ITEMS.slice(0, 1) } }
    })
    const icon = w.findComponent({ name: 'SapIcon' })
    expect(icon.exists()).toBe(true)
    expect(icon.props('name')).toBe('lightbulb')
  })

  it('renders 4 items as 2×2 (locked rule from spec §4.2)', () => {
    const four = SIX_ITEMS.slice(0, 4)
    const w = mount(TextWithIcons, {
      props: { frontmatter: { items: four } }
    })
    expect(w.find('.text-with-icons-grid').classes()).toContain('cols-2')
    expect(w.findAll('.text-with-icons-cell')).toHaveLength(4)
  })

  it('renders 5 items as 3-cols-with-centered-bottom-row', () => {
    const five = SIX_ITEMS.slice(0, 5)
    const w = mount(TextWithIcons, {
      props: { frontmatter: { items: five } }
    })
    expect(w.find('.text-with-icons-grid').classes()).toContain('cols-3')
    // 5th cell sits in row 2; the bottom row of 2 cells should be visually
    // centered. Verify via class on cell index 3 (0-based).
    const cells = w.findAll('.text-with-icons-cell')
    expect(cells).toHaveLength(5)
    expect(cells[3].classes()).toContain('center-bottom-row')
  })

  it('renders 1, 2, or 3 items as 1, 2, or 3 cols respectively (single row)', () => {
    for (const n of [1, 2, 3]) {
      const w = mount(TextWithIcons, {
        props: { frontmatter: { items: SIX_ITEMS.slice(0, n) } }
      })
      expect(w.find('.text-with-icons-grid').classes()).toContain(`cols-${n}`)
      expect(w.findAll('.text-with-icons-cell')).toHaveLength(n)
    }
  })

  it('renders title + console warning when items is missing or empty', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      const w = mount(TextWithIcons, {
        props: { frontmatter: { title: 'Empty case' } }
      })
      expect(w.find('h1').text()).toBe('Empty case')
      expect(w.findAll('.text-with-icons-cell')).toHaveLength(0)
      expect(warn).toHaveBeenCalled()
    } finally {
      warn.mockRestore()
    }
  })

  it('renders the optional link when item.link is set', () => {
    const w = mount(TextWithIcons, {
      props: {
        frontmatter: {
          items: [
            {
              icon: 'lightbulb',
              title: 'Productivity',
              link: { text: 'Learn more', url: 'https://cap.cloud.sap' }
            }
          ]
        }
      }
    })
    const link = w.find('.text-with-icons-cell-link')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('https://cap.cloud.sap')
    expect(link.text()).toContain('Learn more')
  })

  it('respects per-item iconColor override', () => {
    const w = mount(TextWithIcons, {
      props: {
        frontmatter: {
          items: [{ icon: 'lightbulb', title: 'X', iconColor: '#ff0000' }]
        }
      }
    })
    const icon = w.findComponent({ name: 'SapIcon' })
    expect(icon.props('color')).toBe('#ff0000')
  })
})
