# Changelog

Two version dimensions:

- **Template version** (`package.json#version`) — structure, components, conventions
- **Brand version** (`package.json#brandVersion`) — POTX-derived

Both follow [semver](https://semver.org).

## [0.3.0] — 2026-06-14

### Added

- POTX-sourced decoration assets: Anvil Ripple (`image38.svg`), Flat Anvil primitive, SAP wordmark, brand-licensed cover photos, ~18 SAP icon glyphs (all bundled in `public/sap/`)
- Named color tokens: `--sap-blue-7`, `--sap-mango-6`, `--sap-text-on-blue-11`, etc. — 54 total, parsed from POTX legend slide 20
- Theme-scheme aliases: `--sap-accent-1..6`, `--sap-link`, `--sap-text-primary`, `--sap-text-secondary`
- SAP "72" typeface as the default body+heading font, sourced from `@sap-theming/theming-base-content` (Apache 2.0)
- `<RipplePattern>`, `<FlatAnvil>`, `<AnvilGrid>`, `<PhotoFrame>`, `<WordmarkBookmark>` decoration components
- `<SapIcon>`, `<HarveyBall>`, `<ClassificationFooter>` utility components
- Logo clear-space enforcement: `theme/setup/clear-space.ts` computes the keep-out box; per-pixel ΔE Playwright test scaffold (full coverage deferred to v0.4)
- `classification:` front-matter (per-deck and per-slide); default `INTERNAL` from POTX
- `themeConfig.font: 'inter'` per-deck opt-out via `theme/setup/font.ts`
- `agenda:` front-matter overrides for POTX-derived agenda config
- Layouts: Quote, Q&A (`Join the conversation`), Title Photo, Full-bleed Image, Screenshot — and 12 cover variants (was 5)
- `decisions.yaml`: every POTX layout has a documented ship/alias/exclude status (35 ship + 5 alias + 5 exclude)
- `THIRD-PARTY-NOTICES.md` for bundled SAP brand assets

### Changed

- v0.2 hand-rolled SVG decoration approximations replaced with POTX-sourced assets (Ripple, Flat Anvil)
- `<Bio>` extended to dual-API: v0.2 single-presenter (`:presenter`/`:compact`) keeps working AND new team-mode (`:people`) for POTX slide-14 composition
- All 22 non-excluded layouts render `<ClassificationFooter>`
- Theme parser (`parse-theme.mjs`) now returns `themeAccents` from clrScheme
- All v0.2 `--sap-brand-{descriptor}` and `--sap-color-{hex}` tokens kept as deprecated aliases pointing to canonical `--sap-{family}-{tint}` names (49-token rename map in `emit-palette-tokens.mjs`)

### Fixed

- Visual-regression baseline coverage: previous v0.2 baselines for slides 22-99 were silently testing the same demo slide due to a Playwright `reuseExistingServer` rogue-server issue. Rebaseline against the 148-slide gallery deck restored true coverage (84/99 baselines refreshed)

### Deprecated

- `--sap-brand-blue` and family — use `--sap-blue-7` and family
- `--sap-color-{hex}` fallbacks — use `--sap-{family}-{tint}`
- `--sap-font-major`, `--sap-font-minor` — use `--sap-font-family`

### Excluded from POTX

- 5 layouts: 3 author-only tip slides, `>Copilot layouts >`, `>DO NOT USE>`

### Out of scope (deferred to v0.4)

- Dimensional Graphic Pattern, Copilot/Joule layouts, animation/transition fidelity, i18n classification, deeper Templafy interop, `horizon-mapping.css` migration to canonical token names, per-slide Playwright navigation for clear-space tests, hidden-slide pruning at build time

## [0.2.0] — 2026-06-13

### Visual fidelity sweep — all major layouts now POTX-correct

**Architecture:**

- New `theme/components/decorations/` directory: thin SVG decoration
  components (Photo, Diagonal, Wedges, Solid, MultiShape, Gradient,
  DividerWedge, ThankYou) consumed by layouts via `<component :is>`
  composition.
- New auto-generated `cover-tokens.css` (POTX geometry → CSS percentages)
  and `typography-tokens.css` (font sizes, line-heights from placeholder
  text styles).
- Extended `parse-layouts.mjs` to capture `<p:pic>` (logos, fixed images)
  and `<a:lstStyle>` (text style overrides) per layout.
- New `setup/cover-variants.ts` — alias map (`photo`, `wedges`, etc.),
  decoration picker, dark-bg classifier with auto white/primary logo
  selection plus per-variant overrides (Cover D uses primary per POTX).
- New `decoration-logo-treatments.ts` — per-decoration logo color
  preferences extracted from SFCs (Vue compiler limitation workaround).

**Layout fidelity:**

- 12 cover variants now render proper POTX decorations (was: flat blue
  gradients).
- 4 divider variants properly themed.
- 2 thank-you variants get solid + diagonal decorations.
- 10 content/typography layouts consume typography-tokens for
  POTX-faithful font sizes and line-heights.

**Sample deck:**

- Cover A demonstrates the photo path with a permissively-licensed
  Unsplash image (Marvin Meyer, business/tech).
- Documented swap path for SAP press-kit imagery.

**Assets:**

- Official primary and white-monochrome SAP logos from Brand Tools at
  `public/logos/`. White variant used automatically on dark-background
  covers.

**Bug fixes:**

- Fix prettier corrupting slides.md front-matter (added to
  `.prettierignore`).

**Testing:**

- ~25 visual regression baselines updated.
- New unit tests: cover-variants resolver, cover-tokens emitter,
  typography-tokens emitter, extended parse-layouts.
- Test count grew from 25 → ~52.

---

## [0.1.0] — 2026-06-13

### Initial release

- Slidev-based template with workspace-package theme (`slidev-theme-sap`)
- Brand extraction from `SAP_Corp.potx` → CSS tokens, layout manifest, raw media
- 28 layouts covering all 45 POTX layouts (variants collapsed via `variant` props)
- 14 components: `<Bio>`, `<Speaker>`, `<Team>`, `<DeveloperAdvocates>`, `<Agenda>`, `<EventBadge>`, `<Disclaimer>`, `<Roadmap>`, `<QRCode>`, `<SocialIcon>`, `<Logo>`, `<DemoCallout>`, `<CodeBlock>`, `<KeyTakeaway>`
- Data layer: `presenters/`, `teams/`, `programs/`, `event.yaml`, `snippets/`
- PPTX import script (LibreOffice, optional)
- Kitchen-sink gallery (`pages/all-layouts.md`) — 99 slides
- Playwright visual regression on PR (Chromium baselines committed)
- GitHub Pages deploy on push to `main`
- README + CONTENT-GUIDE

### Brand version: 2024.1

- Initial extraction from `SAP_Corp.potx`: 51 colors, 45 layouts, 86 media files
- Major font: "72 Brand Medium" (web equivalent via @sap-theming/theming-base-content)
