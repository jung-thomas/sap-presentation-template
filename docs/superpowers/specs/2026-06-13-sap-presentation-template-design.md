# SAP Presentation Template — Design

**Status:** Draft for review
**Date:** 2026-06-13
**Author:** Thomas Jung (with Claude assistance)

## 1. Summary

A GitHub template repository for authoring SAP-branded HTML presentations. Users click "Use this template" to create a new repo per presentation; GitHub Pages publishes each deck on push to `main`.

The template uses **Slidev** (Vue 3 + Vite) for slide rendering with Markdown as the authoring format. Slides are styled to match the **SAP corporate brand** with **Fiori Horizon look-and-feel**, sourced from `@sap-theming/theming-base-content` and overlaid with brand tokens auto-extracted from the official `SAP_Corp.potx`. Live `@ui5/webcomponents` are embedded for Fiori-authentic in-slide elements.

Reusable content (presenter bios, team rosters, program info, disclaimers, snippets) is data-driven via YAML files at the repo root, so updating once propagates everywhere it's used.

The template ships with **all 45 POTX layouts** (collapsed to ~30 Vue layout files via `variant` props) plus a curated component library, an automation pipeline for importing foreign-branded slides (e.g., SAP Insider event covers), and a Playwright-based visual regression suite to detect brand drift on every PR.

## 2. Goals

1. **One-command publishing** — push to `main`, deck is live on GitHub Pages within ~60 seconds.
2. **Brand-correct out of the box** — fork the template, change a few YAML fields, get a SAP-brand-compliant deck without CSS knowledge.
3. **Adaptable to brand evolution** — when SAP brand updates ship a new POTX, one command (`npm run extract-brand`) refreshes the theme; old presentations stay frozen at their forked brand version.
4. **Reusable content as data** — bio, team, program info, common slides live in YAML/Markdown at well-known paths; updates propagate without per-slide edits.
5. **Foreign-brand interop** — easily incorporate event-mandated branding (SAP Insider covers, etc.) without recreating it in HTML.
6. **Public-friendly** — usable by external community speakers; no internal-only resources or URLs.

## 3. Non-goals (v1)

- Web-based editor or CMS — authoring is in the file system.
- Real-time collaboration — Git is the collaboration model.
- PowerPoint round-trip export with editable slides — would re-introduce brand drift.
- Animated transitions matching PowerPoint defaults — Slidev's transition vocabulary is used.
- Theme-customization UI — theme lives in the repo as code.
- Multi-deck workspace / shared component registry across decks — each fork is independent.
- Internationalization — English-only for v1; Slidev supports i18n if needed later.
- Analytics — privacy-friendly default (none).

## 4. Architecture

### 4.1 Repository layout

```
sap-presentation-template/
├── .github/workflows/
│   ├── deploy.yml                     # build + deploy to GitHub Pages
│   └── visual-regression.yml          # Playwright snapshots on PR
├── SAP_Corp.potx                      # source of truth for brand assets (committed binary)
├── scripts/
│   ├── extract-brand.mjs              # POTX → CSS tokens + layout manifest + media
│   └── import-pptx.mjs                # PPTX → PNG slides (optional, requires LibreOffice)
├── theme/                             # Slidev theme (workspace package, lift-out-ready)
│   ├── package.json                   # name: "slidev-theme-sap"
│   ├── layouts/                       # ~30 Vue files (covering all 45 POTX layouts via variants)
│   ├── components/                    # <Bio>, <Team>, <DeveloperAdvocates>, etc.
│   ├── styles/
│   │   ├── _extracted/                # GENERATED — committed for diff visibility
│   │   │   ├── brand-tokens.css
│   │   │   ├── layouts.json
│   │   │   ├── media/raw/             # all media extracted from POTX
│   │   │   └── README.md              # extraction metadata (POTX hash, date)
│   │   ├── horizon-mapping.css        # hand-written: brand tokens → UI5 Horizon vars
│   │   ├── slide-styles.css           # deck-level spacing, transitions
│   │   └── index.ts                   # entry: imports tokens + theming-base-content
│   ├── setup/
│   │   ├── main.ts                    # registers UI5 WC, sets Horizon theme
│   │   └── data.ts                    # YAML loaders, presenter resolution
│   └── public/
│       └── logos/
│           └── manifest.yaml          # curated map of POTX media → semantic logo names
├── slides.md                          # the actual deck (sample shipped)
├── presenters/                        # one YAML per person
│   ├── thomas-jung.yaml
│   └── _example.yaml                  # template for new contributors
├── teams/                             # named groups of presenter slugs
│   └── dev-advocates.yaml
├── programs/                          # program-level data
│   ├── developer-advocates.yaml       # tagline, description, engagement links
│   └── disclaimers.yaml               # forward-looking, informational, safe-harbor
├── event.yaml                         # this deck's event metadata + defaultPresenter
├── snippets/                          # reusable Markdown fragments
│   ├── codejam.md
│   ├── community-thanks.md
│   └── legal-disclaimer.md
├── public/                            # this deck's images, screenshots
│   └── imported/                      # foreign-branded slides (PNG/JPG)
├── tests/
│   ├── visual.spec.ts                 # Playwright kitchen-sink snapshots
│   └── __screenshots__/               # committed PNG baselines
├── package.json                       # workspaces: ["theme"]
├── README.md                          # quick start, "Use this template" instructions
├── CONTENT-GUIDE.md                   # authoring conventions + curated brand voice links
├── CHANGELOG.md                       # template version + brand version history
└── .gitignore
```

### 4.2 Layering (theme)

```
┌──────────────────────────────────────────────────────────────┐
│  4. slide-styles.css — deck-level spacing, transitions       │
├──────────────────────────────────────────────────────────────┤
│  3. horizon-mapping.css — aliases UI5 vars to brand tokens   │
├──────────────────────────────────────────────────────────────┤
│  2. _extracted/brand-tokens.css — generated from POTX        │
├──────────────────────────────────────────────────────────────┤
│  1. @sap-theming/theming-base-content — Horizon CSS + 72     │
│     fonts + SAP-icons (foundational, imported as-is)         │
└──────────────────────────────────────────────────────────────┘
```

The brand POTX is a _brand-specific overlay_ on top of `@sap-theming`, not a replacement. Maximum reuse of SAP's published theming infrastructure; minimum drift between web rendering and PowerPoint rendering.

### 4.3 Build & deploy flow

```
slides.md + presenters/* + theme/  →  Slidev build  →  dist/  →  GitHub Pages
                                          ↑
                                   Playwright visual
                                   regression on PR
```

GitHub Pages is the deploy target. The workflow uses GitHub's native Pages action (no `gh-pages` branch, no PAT). The base path is derived automatically from the repo name — fork-authors don't have to configure it.

## 5. Components & layouts

### 5.1 Layouts (~30 Vue files covering all 45 POTX layouts)

POTX layouts → Slidev layouts via kebab-case names. Visual variants of the same structure (Cover A–L, Divider A–D, Thank You A/B) collapse into a single Vue file with a `variant` prop. Authors select layouts via slide front-matter:

```yaml
layout: cover
variant: c
title: ...
```

| Slidev layout        | POTX origin                   | Notes                                          |
| -------------------- | ----------------------------- | ---------------------------------------------- |
| `cover`              | Cover A–L                     | 12 visual variants                             |
| `agenda`             | Agenda A, B                   | 2 variants                                     |
| `divider`            | Divider Page A–D              | 4 variants                                     |
| `title-only`         | Title Only                    |                                                |
| `title-text`         | Title and Text                | single content area                            |
| `title-text-2col`    | Title and Text: 2 Columns     | `::left::` / `::right::` slots                 |
| `title-text-3col`    | Title and Text: 3 Columns     | three slots                                    |
| `content-image-2col` | 2 Columns - Text and Images   |                                                |
| `content-image-3col` | 3 Columns - Text and Images   |                                                |
| `content-image-4col` | 4 Columns - Text and Images   |                                                |
| `title-image-third`  | Title and Text with Image 1/3 |                                                |
| `full-bleed-image`   | Full Bleed Image              |                                                |
| `text-screenshot`    | Text and Screenshot           |                                                |
| `title-content`      | Title and Content             |                                                |
| `quote`              | Quote                         |                                                |
| `q-and-a`            | Q & A                         |                                                |
| `thank-you`          | Thank You A, B                | 2 variants                                     |
| `blank`              | Blank                         | escape hatch                                   |
| `image-slide`        | (new)                         | full-bleed PNG/JPG for foreign-branded imports |
| `tips-tricks`        | User guide TIPS & TRICKS      |                                                |
| `color-palette`      | User guide COLOR PALETTE      |                                                |
| `brand-site`         | User guide SAP BRAND SITE     |                                                |
| `title-photo`        | Title Photo                   |                                                |
| `content-photo-1`    | Content Photo 1               |                                                |
| `content-photo-2`    | Content Photo 2               |                                                |
| `title`              | Title                         |                                                |
| `content-1`          | Content 1                     |                                                |
| `two-content`        | Two Content                   |                                                |

The POTX `>DO NOT USE>` and `>Copilot layouts>` placeholders are excluded by name.

### 5.2 Components

Organized by category. All components have sensible defaults — the simplest invocation (`<Bio />`, `<Speaker />`) renders the deck's default presenter from `event.yaml`.

**People & teams**

| Component              | Props                                                                    | Data source                                                      |
| ---------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| `<Bio>`                | `presenter?: string` (slug, default: event default), `compact?: boolean` | `presenters/<slug>.yaml`                                         |
| `<Speaker>`            | `presenter?: string` OR `presenters?: string[]`                          | `presenters/<slug>.yaml`                                         |
| `<Team>`               | `team: string` (slug)                                                    | `teams/<slug>.yaml` → `presenters/*.yaml`                        |
| `<DeveloperAdvocates>` | (none)                                                                   | `programs/developer-advocates.yaml` + `teams/dev-advocates.yaml` |

`<DeveloperAdvocates>` is a slide-level component — typically used on its own slide with `layout: blank` or `layout: title-only`. It composes `<Team team="dev-advocates" />` plus program tagline and engagement links.

**Deck framing**

| Component      | Props                                                         | Data source                                                                        |
| -------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `<Agenda>`     | `current?: number` (slide index for "you are here")           | deck-level `agenda:` front-matter                                                  |
| `<EventBadge>` | (none)                                                        | `event.yaml`                                                                       |
| `<Disclaimer>` | `kind: 'forward-looking' \| 'informational' \| 'safe-harbor'` | `programs/disclaimers.yaml`                                                        |
| `<Roadmap>`    | `phases: Phase[]`, `suppressDisclaimer?: boolean`             | inline data; auto-includes `<Disclaimer kind="forward-looking">` unless suppressed |

**In-slide elements**

| Component       | Props                                                                                            | Data source                                |
| --------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------ |
| `<QRCode>`      | `url: string`, `caption?: string`, `size?: number` (default 200)                                 | none — generated at build via `qrcode` npm |
| `<SocialIcon>`  | `platform: 'twitter' \| 'x' \| 'linkedin' \| 'mastodon' \| 'github' \| 'bsky'`, `handle: string` | none                                       |
| `<Logo>`        | `variant?: string` (e.g., `primary`, `monochrome`)                                               | `theme/public/logos/manifest.yaml`         |
| `<DemoCallout>` | `kind?: 'live' \| 'recorded' \| 'interactive'` (default `live`)                                  | none                                       |
| `<CodeBlock>`   | `lang: string`, `filename?: string`, `caption?: string`, `highlight?: string` (e.g., "3-5")      | default slot (the code)                    |
| `<KeyTakeaway>` | (default slot for the takeaway text)                                                             | none                                       |

### 5.3 Component design principles

1. **Defaults that work** — minimal-prop invocations should always produce a sensible slide.
2. **No raw text props** — content comes from YAML data files. This preserves single-source-of-truth.
3. **Composition over inheritance** — `<DeveloperAdvocates>` composes `<Team>`; `<Roadmap>` composes `<Disclaimer>`.
4. **Fiori-styled via UI5 Web Components** — components prefer `<ui5-card>`, `<ui5-avatar>`, `<ui5-timeline>` etc. over hand-rolled markup.

## 6. Brand extraction & theming

### 6.1 Pipeline

```
SAP_Corp.potx
    │  (npm run extract-brand)
    ▼
theme/styles/_extracted/      ← committed; diffs in git show brand changes
  ├── brand-tokens.css        ← CSS custom properties (colors, fonts, radii)
  ├── layouts.json            ← per-layout geometry hints (placeholder positions)
  ├── media/raw/              ← all media files extracted from POTX
  └── README.md               ← extraction metadata: POTX hash, date, brand version
    │
    ▼
theme/styles/index.ts (imports _extracted/* + @sap-theming/* + horizon-mapping.css)
    │
    ▼
Slidev runtime + UI5 Web Components (single source of CSS variables for both)
```

### 6.2 The extraction script

`scripts/extract-brand.mjs` is pure Node (no shell tooling), ~150 lines, runs identically on Win/Mac/Linux/CI.

**Input:** `SAP_Corp.potx`

**Output:**

1. `theme/styles/_extracted/brand-tokens.css` — semantic CSS custom properties (`--sap-brand-blue: #0070F2;`, `--sap-text-secondary: #...;`, etc.)
2. `theme/styles/_extracted/layouts.json` — for each POTX slide layout: name, placeholder positions in EMU (914400 per inch), default text styles. Used as a reference by Vue layout authors and by the visual regression baseline.
3. `theme/styles/_extracted/media/raw/` — all media files (PNGs, SVGs) extracted as-is.
4. `theme/public/logos/manifest.yaml` — on first run, a stub listing every media file with empty `role:` fields. On subsequent runs, files unchanged keep their roles; changed/new files surface as warnings.
5. `theme/styles/_extracted/README.md` — POTX SHA-256 hash, extraction date, declared font name, brand version.

**Steps:**

1. Unzip the POTX (using `unzipper` or Node 22's built-in zip support).
2. Parse `ppt/theme/theme1.xml` with `fast-xml-parser` to extract color scheme + font scheme.
3. Parse all `ppt/slideLayouts/slideLayout*.xml` to extract per-layout geometry and placeholder text styles.
4. Resolve color hex codes to semantic names via a hand-maintained crosswalk (e.g., `0070F2` → `--sap-brand-blue`).
5. Compare the POTX's declared typeface name (`72 Brand`, `72 Brand Medium`) to what's in `@sap-theming/theming-base-content`; warn if diverged.
6. Emit all output files; update `package.json#brandVersion` if it has changed.

### 6.3 The horizon-mapping layer

`theme/styles/horizon-mapping.css` is a hand-written, ~40-line CSS file that aliases UI5 Horizon CSS variables to our extracted brand tokens:

```css
:root {
  --sapBrandColor: var(--sap-brand-blue);
  --sapButton_Background: var(--sap-brand-blue);
  --sapContent_LabelColor: var(--sap-text-secondary);
  --sapList_Background: var(--sap-surface);
  /* ... */
}
```

This is the bridge that ensures live `<ui5-*>` components on slides match the brand exactly. Source of truth stays in the POTX; UI5 follows.

### 6.4 Versioning

Two version dimensions in `package.json`:

- **`version`** (template structure version) — bumps when components, layouts, or conventions change.
- **`brandVersion`** (POTX-derived) — bumps when a new POTX is extracted. Independent of template version.

Semver applies to both. Major brand version = breaking visual change (new primary color); minor = additions; patch = corrections.

Forks update brand independently of template (drop in new POTX → run script → commit). Forks update template via GitHub's "Sync template" feature.

### 6.5 Font handling

The POTX embeds proprietary `.fntdata` (PowerPoint binary format, not web-usable). The web equivalent is the `72` family shipped in `@sap-theming/theming-base-content` as `.woff2`. The theme depends on this package; the extraction script verifies the typeface names still align and warns if they diverge.

## 7. Reusable content & data files

All YAML files at the repo root are loaded at build time via the `@rollup/plugin-yaml` Vite plugin (configured in `theme/setup/main.ts`), which produces typed JS objects importable as ES modules. Component-facing helpers (e.g., `resolvePresenter(slug)`, default-presenter fallback) live in `theme/setup/data.ts`.

### 7.1 `presenters/<slug>.yaml`

```yaml
# presenters/thomas-jung.yaml
slug: thomas-jung
name: Thomas Jung
title: Developer Advocate, SAP
photo: /presenters/thomas-jung.jpg
initials: TJ
bio: |
  Thomas Jung is a Developer Advocate at SAP focused on cloud-native development
  with the SAP Cloud Application Programming Model.
socials:
  - { platform: linkedin, handle: thomas-jung }
  - { platform: github, handle: thomasjung }
email: thomas.jung@sap.com
```

### 7.2 `teams/<slug>.yaml`

```yaml
# teams/dev-advocates.yaml
slug: dev-advocates
name: SAP Developer Advocates
tagline: Helping developers build the future on SAP BTP.
members: [thomas-jung, jane-doe, ...]
```

### 7.3 `programs/<slug>.yaml`

```yaml
# programs/developer-advocates.yaml
slug: developer-advocates
tagline: ...
description: ...
engagementLinks:
  - { label: 'Newsletter', url: '...' }
  - { label: 'Discord', url: '...' }
  - { label: 'Office Hours', url: '...' }
```

```yaml
# programs/disclaimers.yaml
forward-looking: |
  This presentation outlines our general product direction...
informational: |
  This presentation is for informational purposes only...
safe-harbor: |
  ...
```

The shipped disclaimer texts are the **current public versions** (publicly available in SAP investor relations decks). The README directs users to verify wording against latest SAP IR docs before using in any binding context.

### 7.4 `event.yaml`

```yaml
# event.yaml — per-deck, edited per fork
name: SAP TechEd 2025
date: 2025-09-09
venue: Las Vegas, NV
hashtag: '#SAPTechEd'
defaultPresenter: thomas-jung
```

### 7.5 `snippets/*.md`

Reusable Markdown fragments embedded via Slidev's `<<< @/snippets/<file>.md` syntax. Ships with starter snippets:

- `snippets/codejam.md` — standard SAP CodeJam slide
- `snippets/community-thanks.md` — community thanks (uses `<Team>` against a configurable community team)
- `snippets/legal-disclaimer.md` — `<Disclaimer kind="forward-looking" />` plus context

## 8. Foreign-brand & PPTX import

### 8.1 Use cases

- **Reusable SAP-branded slides** (CodeJam, etc.) → covered by `snippets/`.
- **Foreign-branded slides** (SAP Insider event covers, etc.) → covered by `image-slide` layout + `import-pptx` script.

### 8.2 The `image-slide` layout

```yaml
---
layout: image-slide
src: /imported/insider-2025/cover.png
---
```

Renders a full-bleed image with no template chrome (no footer, no page number, no event badge). Preserves event branding pixel-perfect.

### 8.3 The `import-pptx` script

`scripts/import-pptx.mjs <file.pptx>`:

1. Shells out to LibreOffice (`soffice --convert-to pdf`) to render the PPTX as PDF.
2. Converts each PDF page to high-res PNG. Primary: `pdftoppm` if available on PATH (Poppler — typically present alongside LibreOffice on Mac/Linux). Fallback: the `pdf-to-img` npm package (pure JS, ~10 MB, only loaded if `pdftoppm` is missing). If both are unavailable, the script exits with a clear error and a pointer to the manual fallback.
3. Writes PNGs to `public/imported/<deckname>/slide-NN.png`.
4. Generates a `slides.json` manifest in the same directory.
5. Optionally generates a `snippets/<deckname>-frame.md` Markdown stub that places the first and last slides as `image-slide` layouts (for the "wrap your deck in foreign branding" pattern).

LibreOffice is **optional** — documented as a hard requirement of the script only. README documents the manual fallback (PowerPoint → File → Export → Change file type → PNG).

PNG/JPG and screenshots are zero-tooling: drop into `public/imported/<event>/`, reference by path.

## 9. Local development & deployment

### 9.1 npm scripts

| Command                      | Purpose                                         |
| ---------------------------- | ----------------------------------------------- |
| `npm run dev`                | Slidev dev server at localhost:3030, hot reload |
| `npm run build`              | Static build to `dist/`                         |
| `npm run export`             | PDF export of deck → `slides-export.pdf`        |
| `npm run gallery`            | Open the kitchen-sink layout gallery in dev     |
| `npm run extract-brand`      | Re-extract from POTX (run when brand changes)   |
| `npm run import-pptx <file>` | Import a foreign PPTX (requires LibreOffice)    |
| `npm run test:visual`        | Run Playwright visual regression locally        |
| `npm run test:visual:update` | Update Playwright snapshot baselines            |

### 9.2 Node version

**Node 22 LTS.** Aligns with current Slidev support and lets us use Node 22's native zip handling in the extraction script.

### 9.3 GitHub Pages workflow

`.github/workflows/deploy.yml`:

- Triggered on push to `main` and on `workflow_dispatch`.
- Uses GitHub's native Pages action (`actions/deploy-pages`) — no `gh-pages` branch, no PAT.
- Base path derived automatically from `${{ github.event.repository.name }}` so forks need no configuration.

### 9.4 First-time setup for a fork-author

1. Click "Use this template" → create a new repo.
2. **Settings → Pages → Source: GitHub Actions** _(one-time UI step; GitHub limitation, can't be automated for the user)._
3. **Replace the demo presenter:** the template ships with `presenters/thomas-jung.yaml` so the template repo's own GitHub Pages renders a working demo. On fork, either (a) replace its contents with your own data and rename the file, or (b) delete it and copy `presenters/_example.yaml` → `presenters/<your-slug>.yaml`. Then update `event.yaml#defaultPresenter` to your slug.
4. Edit `event.yaml` — set `defaultPresenter` and event metadata.
5. Edit `slides.md` — write your talk.
6. `git push` → live in ~60 seconds at `username.github.io/repo-name/`.

## 10. Visual regression testing

`tests/visual.spec.ts` uses Playwright to snapshot the kitchen-sink gallery (`/all-layouts` route) on every PR. Snapshots are committed to `tests/__screenshots__/` (PNG, no LFS by default). Approximate budget: ~30 MB at 45 layouts × 1920×1080; LFS upgrade documented if the suite grows.

**Test pre-flight:**

```ts
await page.goto('/all-layouts')
await page.waitForFunction(() => document.fonts.ready)
await page.waitForTimeout(200) // settle
```

The font-loading wait is critical — the `72` font must be loaded before screenshots are accurate.

**On baseline updates:** intentional brand changes produce a clear PR comment with before/after diffs. Reviewer approves or rolls back; baseline is updated via `npm run test:visual:update`.

## 11. Content & authoring guide

`CONTENT-GUIDE.md` at the repo root contains:

1. **Authoring conventions** — when to use which layout (decision tree); when to use which component (`<KeyTakeaway>` vs `<DemoCallout>` vs `<Disclaimer>`); slide-text length budgets per layout (measured during component implementation); image guidance.
2. **Curated SAP brand voice references** — public links only (`brand.sap.com` public pages, `experience.sap.com` design system, `news.sap.com` editorial guidelines, public SAP forward-looking statements policy). No reproduction, no internal-only links.
3. **Quality patterns** specific to the template — "one thought per slide" with kitchen-sink examples; when to compose multiple components vs use one.
4. **Anti-patterns** — don't override component colors locally; don't bypass `<Logo>` to embed logos directly; don't put long-form text in `<KeyTakeaway>`.

**Constraint: no internal-only URLs anywhere in the template.** Every link must work for an external community speaker. This applies to README, CONTENT-GUIDE, code comments, and component output.

## 12. Dependencies

**Runtime (production):**

- `@slidev/cli`, `@slidev/theme-default` (peer)
- `vue` (peer of Slidev)
- `@ui5/webcomponents`, `@ui5/webcomponents-fiori` (selective imports — per-component, not whole library)
- `@sap-theming/theming-base-content` (Horizon CSS + 72 fonts + SAP-icons)
- `qrcode` (build-time QR generation)

**Dev / build:**

- `unzipper`, `fast-xml-parser` (POTX extraction)
- `@playwright/test` (visual regression — CI only)
- `eslint`, `prettier`, `typescript`

**Optional (documented, not required):**

- LibreOffice (`soffice`) — for `import-pptx`. Manual fallback documented.

**Approximate `node_modules` size:**

- Without Playwright: ~120 MB
- With Playwright (full install): ~400 MB

## 13. Risks & mitigations

| Risk                                                                   | Likelihood | Impact | Mitigation                                                                                                                          |
| ---------------------------------------------------------------------- | ---------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| POTX OOXML schema changes between brand versions                       | Low        | Medium | Extraction script logs warnings; tests pin to known POTX shape; fork-authors don't auto-update — they re-run extract intentionally. |
| The `72` web font in `@sap-theming/theming-base-content` lags the POTX | Medium     | Low    | Extraction script warns when typeface names diverge. Visual difference normally imperceptible.                                      |
| UI5 Web Components version drift breaking themed components            | Medium     | Medium | Pin minor version in `package.json`. Visual regression catches drift on next CI run after `npm update`.                             |
| GitHub Pages soft bandwidth limit (100 GB/month)                       | Very Low   | Low    | Documented in README; typical decks well under limit.                                                                               |
| PPTX import via LibreOffice produces poor output for complex slides    | Medium     | Low    | Documented manual fallback (PowerPoint → PNG). `import-pptx` is best-effort.                                                        |
| Slidev breaking changes between major versions                         | Medium     | Medium | Pin Slidev major version. Document migration in CHANGELOG. Forks stay on pinned version until they choose to upgrade.               |
| Visual-regression false positives from font-loading timing             | Medium     | Low    | `waitForFunction(() => document.fonts.ready)` plus settle delay.                                                                    |
| Playwright snapshots bloat the repo                                    | Low        | Low    | Committed without LFS by default (~30 MB at 45 layouts). LFS upgrade documented.                                                    |

## 14. Open questions (resolve during implementation)

- **Speaker notes export** — Slidev supports `<!-- speaker notes -->` syntax. Default: ship `npm run export-notes` for printable handouts (low cost).
- **Internationalization** — out of scope for v1. Slidev supports per-slide content swapping if added later.
- **Analytics** — out of scope for v1 (privacy-friendly default).
- **Print stylesheet (A4)** — out of scope for v1 (PDF export covers handouts).
- **`<Logo>` manifest curation** — first extraction surfaces every POTX media file as a candidate; we curate the canonical names during implementation by examining the actual files.
- **Disclaimer text verification** — confirm we ship the current public versions of SAP forward-looking and informational disclaimers; add note in README about verifying against latest SAP IR sources.

## 15. Implementation order (high-level)

The detailed plan will live in a separate writing-plans output, but the rough sequence:

1. **Scaffolding** — Slidev project, npm workspace, theme package skeleton, Node 22, TypeScript config.
2. **Brand extraction script** — POTX → `_extracted/` (colors, fonts, layout manifest, media raw).
3. **Theme foundation** — `@sap-theming/theming-base-content` integration, `horizon-mapping.css`, UI5 Web Components setup.
4. **Core layouts (most-used 8–10)** — Cover, Title+Text, 2-Column, Divider, Quote, Section, Image+Text, Thank You, Q&A, Agenda. Validate the layout authoring approach.
5. **Core components** — `<Bio>`, `<Speaker>`, `<Team>`, `<DeveloperAdvocates>`, `<Agenda>`, `<EventBadge>`, data loaders.
6. **Remaining 35 layouts** — Cover variants, Divider variants, content/photo layouts.
7. **Remaining components** — `<Disclaimer>`, `<Roadmap>`, `<DemoCallout>`, `<CodeBlock>`, `<KeyTakeaway>`, `<QRCode>`, `<SocialIcon>`, `<Logo>`.
8. **PPTX import script** — LibreOffice path + `image-slide` layout integration.
9. **Visual regression** — kitchen-sink gallery + Playwright tests + CI workflow.
10. **GitHub Pages deploy workflow** — `.github/workflows/deploy.yml`.
11. **README + CONTENT-GUIDE** — quick start, authoring conventions, curated brand voice links.
12. **Sample deck** — `slides.md` demonstrating the full template, doubling as the demo deck on the template repo's own Pages.

Estimated effort: ~3 focused days for v1 (~1 day on scaffolding + extraction + theme; ~1 day on layouts + components; ~1 day on import script + visual regression + workflows + docs).
