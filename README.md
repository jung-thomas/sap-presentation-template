# SAP Presentation Template

A GitHub-template repository for authoring SAP-branded HTML presentations with [Slidev](https://sli.dev). All 45 POTX layouts, a curated component library (Bio, Team, Roadmap, Disclaimer, …), brand tokens auto-extracted from the official `SAP_Corp.potx`, and one-push deploy to GitHub Pages.

> **Built for external community speakers.** All brand resources linked here are publicly accessible. No internal-only URLs.

> **The official `SAP_Corp.potx` file is SAP-internal and is NOT distributed in this repository.** SAP employees and authorized partners obtain it from the SAP brand portal and place it locally before running `npm run extract-brand`. The repo ships with the _derived_ outputs of a prior extraction (`theme/styles/_extracted/brand-tokens.css`, `layouts.json`, and a curated logo placeholder) so the template renders with brand-correct colors and fonts out of the box. Re-extraction is only needed when the brand POTX itself updates.

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

When the SAP brand portal ships an updated POTX (SAP-internal users / authorized partners):

```bash
# 1. Place the new SAP_Corp.potx at the repo root (it is gitignored).
# 2. Re-extract:
npm run extract-brand
# 3. Review the diff in theme/styles/_extracted/ (this *is* the change log).
# 4. Update curated logo roles if files changed (theme/public/logos/manifest.yaml).
# 5. Run visual regression to spot affected layouts:
npm run test:visual
# 6. If everything looks right:
git add -A && git commit -m "chore: bump brand to <version>"
```

External community speakers can use this template as-is — the committed extracted tokens and the placeholder logo will render a recognizable SAP-styled deck. Replace the placeholder logo with the official SAP logo (download from the public SAP brand site) at `theme/public/logos/logo-sap-primary.svg` for full brand fidelity.

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

| Path                       | Purpose                                                                           |
| -------------------------- | --------------------------------------------------------------------------------- |
| `slides.md`                | Your deck (Markdown)                                                              |
| `presenters/<slug>.yaml`   | Your bio, photo, socials                                                          |
| `teams/<slug>.yaml`        | Named groups of presenter slugs                                                   |
| `programs/<slug>.yaml`     | Program metadata (taglines, engagement links)                                     |
| `event.yaml`               | This deck's event metadata + default presenter                                    |
| `snippets/*.md`            | Reusable Markdown fragments                                                       |
| `public/`                  | Your images, screenshots                                                          |
| `theme/`                   | The SAP theme (you don't usually edit)                                            |
| `theme/styles/_extracted/` | Derived brand tokens + layout geometry (generated; committed for diff visibility) |

`SAP_Corp.potx` is **not** in the repo (gitignored). See "Updating to a new SAP brand version" above.

## Authoring

See [CONTENT-GUIDE.md](./CONTENT-GUIDE.md) for layout/component conventions, slide-text length budgets, and curated SAP brand voice references.

### Keyboard shortcuts (Slidev built-ins)

While presenting or previewing, the deck supports Slidev's standard keyboard shortcuts:

| Key                       | Action                                  |
| ------------------------- | --------------------------------------- |
| `→` / `←`                 | Next / previous slide                   |
| `o`                       | Toggle slide overview / navigator panel |
| `f`                       | Toggle full-screen                      |
| `g <number>` then `Enter` | Go to slide by number                   |
| `d`                       | Toggle dark mode                        |
| `?`                       | Show full Slidev shortcut reference     |

> **Tip:** if the slide overview panel (opened with `o`) appears cut off at the edges of your browser window, press `o` again to dismiss it, or click the `×` icon at the top-right of the overview. Slidev positions the close affordance relative to the viewport — very tall slide lists may extend past the visible area in non-full-screen browser windows.

## License

The template scaffolding is MIT-licensed. Derived brand-token CSS files in `theme/styles/_extracted/` reflect publicly-documented SAP Horizon palette colors. Any SAP brand assets you place locally (`SAP_Corp.potx`, official logos) remain SAP property — use according to SAP brand guidelines.

## Versioning

- `package.json#version` — template structure version (bumps with API changes).
- `package.json#brandVersion` — POTX-derived (bumps when the source POTX changes).

See [CHANGELOG.md](./CHANGELOG.md).
