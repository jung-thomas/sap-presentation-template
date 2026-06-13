import { test, expect } from '@playwright/test'

const SLIDE_COUNT = 99
const SETTLE_MS = 200

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
