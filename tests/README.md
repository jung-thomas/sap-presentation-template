# Visual regression tests

Playwright snapshots the kitchen-sink gallery on every PR. Brand changes that affect layouts or components produce a clear before/after diff for review.

## Run locally

```bash
npm run test:visual              # check current code against committed baselines
npm run test:visual:update       # update baselines (run after intentional changes)
```

## When to update baselines

- Brand version bumped (re-extracted from new POTX) → baselines will change visibly. Review the diff carefully.
- Layout or component visual change → expected; update.
- Fonts loaded differently across machines → font hinting noise. The 5% pixel-diff tolerance should absorb this.

## CI

The `.github/workflows/visual-regression.yml` job runs on every PR. Failed snapshots upload as artifacts; download to inspect locally.

## Cross-platform baselines

Baselines were initially captured on Windows. CI runs on `ubuntu-latest` (Linux). The `snapshotPathTemplate` in `playwright.config.ts` omits `{platform}` and `{projectName}` so snapshot filenames are `slide-NN.png` rather than `slide-NN-chromium-win32.png` — making them platform-independent in naming.

**Font-hinting drift:** On the first CI run after new baselines are captured on a different OS, small font-hinting differences may cause pixel diffs. The 5% `maxDiffPixelRatio` tolerance should absorb this. If it does not, review the diff artifacts uploaded by CI carefully before updating baselines — genuine visual regressions must not be masked.

To update baselines to the Linux/CI rendering (run in CI or a Linux environment):

```bash
npm run test:visual:update
```
