import { test, expect } from '@playwright/test'

const SLIDE_COUNT = 146
// Some slides load presenter / event / program / team data via
// import.meta.glob('.../*.yaml'); Vue mounts the components after the
// glob resolves. 200ms (the previous value) was tuned against the
// previously-broken gallery rendering, which was always blank and so
// effectively didn't need a settle. With v0.4.4's real rendering,
// 200ms catches pre-mount frames; 2000ms is empirically sufficient.
const SETTLE_MS = 2000

async function settle(page: import('@playwright/test').Page) {
  await page.waitForFunction(() => document.fonts.ready)
  await page.waitForTimeout(SETTLE_MS)
}

test.describe('Kitchen-sink gallery', () => {
  // Prime Vite's module graph. The first slide visit triggers cold compile
  // of the gallery's full module graph (theme layouts, components, YAML data
  // sources, all 146 slide modules). On the cold path, compile + Vue mount
  // can exceed SETTLE_MS, so Playwright captures pre-mount blank frames for
  // the first ~50 slides. Round-trip /1 → /2 → /1 forces a warm-state visit
  // before the per-slide loop runs. See spec §6.5.
  test.beforeAll(async ({ browser }) => {
    const ctx = await browser.newContext()
    const page = await ctx.newPage()
    await page.goto('http://localhost:3031/1')
    await page.waitForFunction(() => document.fonts.ready)
    await page.waitForTimeout(5000)
    await page.goto('http://localhost:3031/2')
    await page.waitForTimeout(500)
    await page.goto('http://localhost:3031/1')
    await page.waitForFunction(() => document.fonts.ready)
    await page.waitForTimeout(2000)
    await ctx.close()
  })

  for (let i = 1; i <= SLIDE_COUNT; i++) {
    test(`slide ${String(i).padStart(2, '0')}`, async ({ page }) => {
      await page.goto(`/${i}`)
      await settle(page)
      await expect(page).toHaveScreenshot(`slide-${String(i).padStart(2, '0')}.png`, {
        fullPage: false
      })
    })
  }
})
