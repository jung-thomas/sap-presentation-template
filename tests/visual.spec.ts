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
