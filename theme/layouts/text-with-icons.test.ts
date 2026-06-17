import { describe, it, expect } from 'vitest'
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
})
