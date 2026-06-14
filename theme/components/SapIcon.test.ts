import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SapIcon from './SapIcon.vue'

vi.mock('../styles/_extracted/icons.json', () => ({
  default: {
    wrench: { src: '/sap/icons/wrench.svg', viewBox: '0 0 43 43' },
    'family-care': { src: '/sap/icons/family-care.svg', viewBox: '0 0 96 96' }
  }
}))

describe('<SapIcon>', () => {
  it('resolves known name to <img> with src', () => {
    const w = mount(SapIcon, { props: { name: 'wrench' } })
    expect(w.find('img').attributes('src')).toContain('/sap/icons/wrench.svg')
  })

  it('warns and renders empty placeholder for unknown name', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const w = mount(SapIcon, { props: { name: 'no-such-icon' } })
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('no-such-icon'))
    expect(w.find('img').exists()).toBe(false)
    warn.mockRestore()
  })
})
