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
- Fonts loaded differently across machines → font hinting noise. The 0.5% pixel-diff tolerance should absorb this.

## CI

The `.github/workflows/visual-regression.yml` job runs on every PR. Failed snapshots upload as artifacts; download to inspect locally.
