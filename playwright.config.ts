import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  testMatch: /.*\.spec\.ts$/,
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:3031',
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  snapshotPathTemplate: '{testDir}/{testFileDir}/{testFileName}-snapshots/{arg}{ext}',
  webServer: {
    command: 'npm run gallery',
    url: 'http://localhost:3031',
    timeout: 60_000,
    reuseExistingServer: !process.env.CI
  },
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.005 }
  }
})
