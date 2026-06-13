# SAP Presentation Template

A GitHub-template repository for authoring SAP-branded HTML presentations with [Slidev](https://sli.dev). Auto-extracted brand tokens from `SAP_Corp.potx`, all 45 POTX layouts, a curated component library (Bio, Team, Roadmap, Disclaimer, …), and one-push deploy to GitHub Pages.

> **Built for external community speakers.** All brand resources linked here are publicly accessible. No internal-only URLs.

## Quick start (≈ 2 minutes)

1. Click **"Use this template"** above to create your own repo.
2. **Settings → Pages → Source: GitHub Actions** (one-time UI step).
3. **Replace the demo presenter:** the template ships `presenters/thomas-jung.yaml` so the demo deck renders. On fork, either replace its contents with your own data and rename the file, or delete it and copy `presenters/_example.yaml` → `presenters/<your-slug>.yaml`. Then update `event.yaml#defaultPresenter` to your slug.
4. **Edit `event.yaml`** — set event metadata.
5. **Edit `slides.md`** — write your talk.
6. `git push` → live in ~60 seconds at `https://<username>.github.io/<repo-name>/`.

## Local development

```bash
npm install
npm run dev              # localhost:3030, hot reload
npm run build            # static site → dist/
npm run export           # PDF export → slides-export.pdf
npm run gallery          # localhost:3031, kitchen-sink layout reference
npm test                 # Vitest unit tests
npm run test:visual      # Playwright visual regression
```

## Updating to a new SAP brand version

When SAP brand updates ship a new POTX:

```bash
# 1. Replace SAP_Corp.potx with the new version
# 2. Re-extract:
npm run extract-brand
# 3. Review the diff in theme/styles/_extracted/ (this *is* the change log)
# 4. Update curated logo roles if files changed (theme/public/logos/manifest.yaml)
# 5. Run visual regression to spot affected layouts
npm run test:visual
# 6. If everything looks right:
git add -A && git commit -m "chore: bump brand to <version>"
```

## Importing foreign-branded slides (e.g., SAP Insider)

For event organizers that mandate their own opening/closing slides:

```bash
# Requires LibreOffice on PATH; manual fallback documented below
npm run import-pptx -- ./insider-2025-frame.pptx
```

This produces:

- `public/imported/insider-2025-frame/slide-NN.png`
- `snippets/insider-2025-frame-frame.md`

**Manual fallback (no LibreOffice):**

1. Open the PPTX in PowerPoint.
2. File → Export → Change file type → PNG.
3. Drop PNGs into `public/imported/<event-name>/` named `slide-01.png`, `slide-02.png`, …
4. Reference with `layout: image-slide` and `src: /imported/<event-name>/slide-NN.png`.

## What's in the box

| Path | Purpose |
| --- | --- |
| `slides.md` | Your deck (Markdown) |
| `presenters/<slug>.yaml` | Your bio, photo, socials |
| `teams/<slug>.yaml` | Named groups of presenter slugs |
| `programs/<slug>.yaml` | Program metadata (taglines, engagement links) |
| `event.yaml` | This deck's event metadata + default presenter |
| `snippets/*.md` | Reusable Markdown fragments |
| `public/` | Your images, screenshots |
| `theme/` | The SAP theme (you don't usually edit) |
| `SAP_Corp.potx` | Source of truth for brand assets |

## Authoring

See [CONTENT-GUIDE.md](./CONTENT-GUIDE.md) for layout/component conventions, slide-text length budgets, and curated SAP brand voice references.

## License

The template scaffolding is MIT. Embedded SAP brand assets (`SAP_Corp.potx`, extracted media) remain SAP property — use according to SAP brand guidelines.

## Versioning

- `package.json#version` — template structure version (bumps with API changes).
- `package.json#brandVersion` — POTX-derived (bumps when `SAP_Corp.potx` changes).

See [CHANGELOG.md](./CHANGELOG.md).
