import { describe, it, expect } from 'vitest'
import { computeKeepOut } from './clear-space'

describe('computeKeepOut', () => {
  // Default cover-tokens from POTX: logo at top:7.35%, left:4.13%, width:5.96%
  // Logo aspect 2:1; slide aspect 16:9 (1280x720)
  it('returns box surrounding logo with 1x logo-height padding', () => {
    const k = computeKeepOut({
      logoTop: 7.35,
      logoLeft: 4.13,
      logoWidth: 5.96,
      slideAspect: 16 / 9
    })
    // Logo height in % of slide-height = (logoWidth * slideWidth_px / 2) / slideHeight_px * 100
    // = (5.96% * 1280 / 2) / 720 * 100 ≈ 5.30% (logo-height as % of slide-height)
    // top = 7.35 - 5.30 = 2.05; left depends on logo-width-%-of-slide-width
    expect(k.top).toBeCloseTo(2.05, 1)
    expect(k.height).toBeCloseTo(15.89, 1) // 3 * logoHeight (1× above + 1× logo + 1× below)
    expect(k.left).toBeCloseTo(-1.85, 1) // 4.13 - logoWidth (5.96)
    expect(k.width).toBeCloseTo(17.88, 1) // 3 * logoWidth
  })

  it('honors custom logoAspectRatio', () => {
    // Square logo (1:1) on square slide — keep-out should be 3× the logo box.
    const k = computeKeepOut({
      logoTop: 20,
      logoLeft: 20,
      logoWidth: 10,
      slideAspect: 1,
      logoAspectRatio: 1
    })
    expect(k.top).toBeCloseTo(10, 1) // 20 - 10
    expect(k.left).toBeCloseTo(10, 1) // 20 - 10
    expect(k.width).toBeCloseTo(30, 1) // 3 * 10
    expect(k.height).toBeCloseTo(30, 1) // 3 * 10
  })
})
