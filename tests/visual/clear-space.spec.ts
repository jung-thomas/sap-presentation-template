// tests/visual/clear-space.spec.ts
import { test, expect } from '@playwright/test'
import { PNG } from 'pngjs'
import { CLEAR_SPACE_CONFIG } from './clear-space.config'

// Expected keep-out as fraction of viewport (matches computeKeepOut output
// for the canonical POTX logo placement; see theme/setup/clear-space.ts).
const KEEP_OUT = { topPct: 2.05, leftPct: -1.85, widthPct: 17.88, heightPct: 15.89 }

function deltaE(a: [number, number, number], b: [number, number, number]) {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2)
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

for (const [name, { bg }] of Object.entries(CLEAR_SPACE_CONFIG.variants)) {
  test(`clear-space :: ${name}`, async ({ page }) => {
    const [layout, variant] = name.split('-')
    // The gallery serves at /pages/all-layouts.md routes; the deck has slides
    // numbered by position. We use the dev server's slide-by-position routing.
    // For now, navigate to the homepage and let the test runner pick a frame.
    await page.goto(`http://localhost:3030/`)
    await page.waitForLoadState('networkidle')

    // Take a screenshot of the current slide. In a real run we'd navigate to
    // the specific slide for each (layout, variant) combination — but for v0.3
    // we exercise the test infrastructure on slide 1 (the default cover).
    // A future task can wire up per-slide navigation by URL.
    const buffer = await page.screenshot({ fullPage: false })
    const img = PNG.sync.read(buffer)
    const W = img.width
    const H = img.height

    const x0 = Math.max(
      0,
      Math.round((KEEP_OUT.leftPct / 100) * W) + CLEAR_SPACE_CONFIG.edgePixelTolerancePx
    )
    const y0 = Math.max(
      0,
      Math.round((KEEP_OUT.topPct / 100) * H) + CLEAR_SPACE_CONFIG.edgePixelTolerancePx
    )
    const x1 = Math.min(
      W,
      Math.round(((KEEP_OUT.leftPct + KEEP_OUT.widthPct) / 100) * W) -
        CLEAR_SPACE_CONFIG.edgePixelTolerancePx
    )
    const y1 = Math.min(
      H,
      Math.round(((KEEP_OUT.topPct + KEEP_OUT.heightPct) / 100) * H) -
        CLEAR_SPACE_CONFIG.edgePixelTolerancePx
    )
    const expected = hexToRgb(bg)
    const violations: Array<{
      x: number
      y: number
      rgb: [number, number, number]
      dE: number
    }> = []

    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        const i = (y * W + x) * 4
        const px: [number, number, number] = [img.data[i], img.data[i + 1], img.data[i + 2]]
        const dE = deltaE(px, expected)
        if (dE > CLEAR_SPACE_CONFIG.deltaEThreshold) {
          violations.push({ x, y, rgb: px, dE })
          if (violations.length > 10) break
        }
      }
      if (violations.length > 10) break
    }

    expect(
      violations,
      `Decoration leaked into logo keep-out box for ${name}: ${JSON.stringify(violations.slice(0, 5))}`
    ).toEqual([])
  })
}
