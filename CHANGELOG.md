# Changelog

Two version dimensions:

- **Template version** (`package.json#version`) — structure, components, conventions
- **Brand version** (`package.json#brandVersion`) — POTX-derived

Both follow [semver](https://semver.org).

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
