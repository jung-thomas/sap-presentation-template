# Changelog

Two version dimensions:

- **Template version** (`package.json#version`) — structure, components, conventions
- **Brand version** (`package.json#brandVersion`) — POTX-derived

Both follow [semver](https://semver.org).

## [0.4.2.1] — 2026-06-15

### Fixed (brand-fidelity hotfix)

v0.4.2 violated the SAP brand rule "never distort or rotate the anvil"
across every layout that consumed `<FlatAnvil>` or `<FlatAnvilOutline>`.
Reported as showstopper. Root cause: both SVG components had
`preserveAspectRatio="none"`, which let the canonical 605:297 trapezoid
stretch into whatever rectangle the host CSS gave it.

- **`<FlatAnvil>` and `<FlatAnvilOutline>`** — drop
  `preserveAspectRatio="none"`. Default `xMidYMid meet` preserves the
  canonical 2.04:1 silhouette. Hosts now MUST size their container at the
  same aspect ratio (`aspect-ratio: 605 / 297;`).
- **AnvilGridDecoration tile (`public/sap/anvil-tile.svg`)** — enlarge
  canvas from 120×60 to 240×120 with the anvil in the top-left quadrant
  and 50% whitespace right + below. Tile renders with visible gaps
  between anvils; fixes the "shark teeth" pattern on divider-c, agenda,
  and thank-you-b.
- **AnvilGridDecoration `background-size`** — 60×30 → 200×100 to match
  the new tile dimensions.
- **divider variant b (4 FlatAnvil shapes)** — each shape container
  switched from independent width/height percentages to width-only +
  `aspect-ratio: 605 / 297`. Previously the 4 shapes had wildly
  different aspect ratios (e.g. br1 was ≈2.42:1).
- **quote `.quote-highlight`** — was `inset: 20% 25%` (≈1.48:1, heavily
  distorted, diagonal extending off the slide's right edge). Now
  `width: 70%` + `aspect-ratio: 605 / 297`, centered, fully inside slide
  bounds.
- **q-and-a `.qa-anvil-frame` + `.qa-photo`** — was `inset: 15% 8%` on
  qa-frame (≈1.07:1, drew the outline well past slide bounds). Now
  `width: 84%` + `aspect-ratio: 605 / 297` for the outline, and
  `width: 70%` + `aspect-ratio: 4 / 3` for the photo.
- **`title-only` layout + Bio team mode contrast** — when the slide body
  renders Bio team mode's dark anvil band, the default dark-blue title
  was unreadable on the dark band (reported "Meet our team"). Added
  `.title-only:has(.bio--team) h1 { color: #fff; z-index: 5 }`.

No API changes. No removed features. All 174 vitest tests still pass;
production build clean.

## [0.4.2] — 2026-06-15

### Added

- **Divider — 4 POTX-faithful variants** (a/b/c/d). Variant `a` is white minimal,
  `b` is sap-blue-6 with a 4-shape FlatAnvil composition, `c` is a 50/50 split with
  AnvilGridDecoration tile pattern on the bottom half, and `d` is white with a
  pale-blue (sap-blue-2) horizontal band. Author API unchanged from v0.3.
- **Thank-you A** — minimal white close: "Contact information:" label,
  `<SapTaglineLockup>` lockup bottom-right, `<LegalNotice>` © line bottom-center.
- **Thank-you B** — substantial close: top 50% sap-blue-10 anvil header band,
  "Thank you." headline, presenter contact card (name / title / address / city /
  email), optional QR code, tagline lockup, © line.
- **Quote** — sap-blue-2 background with a giant FlatAnvil highlight in
  sap-blue-4 behind the quote text. New `company` and `role` frontmatter fields;
  v0.3 `source` still works as a `company` alias.
- **Q&A** — sap-blue-2 background with `<FlatAnvilOutline>` (new component) as a
  photo frame on the right half. New `eyebrow`, `subtitle`, `image` frontmatter
  fields. Title defaults to "Questions?" when absent.
- **`<SapTaglineLockup>`** — SAP logo + "Bring out your best." tagline. Used by
  both thank-you variants. `invert` prop for dark-background placement.
- **`<LegalNotice>`** — © corporate notice component. Sources from
  `theme/setup/legal.ts` constant; per-deck override via `legalNotice:` frontmatter.
- **`<FlatAnvilOutline>`** — stroked variant of `<FlatAnvil>` (same canonical SVG
  path, `fill="none"` + `stroke="currentColor"`). Used as the Q&A photo frame.
- **`address?` and `city?` on Presenter type** — surfaces in thank-you-b's
  contact card. Added to thomas-jung fixture. v-if guards suppress empty rows.
- **CI production-build smoke test** — `npm run build` step in
  `.github/workflows/visual-regression.yml`, run before Playwright. Catches
  production-only failures (like v0.4.1's `import('@slidev/client/state/index')`
  ENOENT) before they reach GitHub Pages.

### Removed

- **`theme/components/decorations/RipplePattern.vue`** — the v0.3
  wrong-abstraction. Final consumers (divider + thank-you) migrated to
  POTX-correct primitives in this release.

### Notes

- Default thank-you variant remains `b` (v0.3 backward-compat). Decks omitting
  `variant:` keep their existing visual.
- Inherited `bi/o` icon-resolution flake is unchanged from v0.3; some
  visual-regression snapshots may still differ from a clean rebaseline. Tracked
  for a separate fix.

## [0.4.1] — 2026-06-15

### Added

- New `<AgendaItem>` component (`theme/components/agenda/AgendaItem.vue`) — one row of the agenda list (number + title + optional description + hairline). Number is 0-based in the prop API and rendered 1-based, zero-padded to 2 digits per POTX convention.
- New `description` field on agenda items, rendered below the title in the POTX agenda-b style.
- Bio team-mode `console.warn` when `people.length !== 4` (POTX is a 4-card layout) and when both `people` and `presenter` are passed (mutually exclusive; team mode wins).

### Changed

- **P-4: Agenda layout fully rewritten** to match POTX agenda-b. 66.56% left content + 33.44% right `<AnvilGridDecoration>` column with `bg=var(--sap-blue-10)` and `color=var(--sap-blue-6)`. Hairlines between items are 2px `var(--sap-blue-6)`, NOT light-grey as the audit text initially described. All measurements pixel-derived from `audit/potx-renders/agenda-b.png` (1920×1080).
- **P-5: Bio team mode fully rewritten** to match POTX slide 14 ("Meet our team"). 50% top `<AnvilGridDecoration>` band + 4-card fixed grid (`grid-template-columns: repeat(4, 1fr)`) anchored at `top: 24.4%; bottom: 12%` so cards intrude into the band by 25.6% of slide height. 47px (2.45%) gap between cards, 80px (4.2%) outer margin. Photo 4:5 portrait aspect with `object-fit: cover`. Replaces v0.3's full-bleed `<AnvilGrid>` and `auto-fit, minmax` cards.
- `title-only` layout's `<h1>` now renders white when the slide hosts `<Bio :people=...>`, via a `:has(.bio--team)` CSS rule. This keeps the title-only template unchanged (no prop API) while restoring POTX's white-title-on-band overlay.
- Agenda `variant: a` / `variant: b` distinction removed (POTX agenda-a is just a blank slide; the new layout always renders the agenda-b composition).

### Fixed

- **P-2 (corrected): Slidev "Goto..." dialog** (`g` hotkey) — now stays inside the viewport regardless of slide count, and offers a visible × close button. The v0.4.0 attempt at this fix targeted the wrong DOM element (the `slidev-quick-overview` panel, not the goto dialog). The corrected fix bounds `#slidev-goto-dialog` max-height and injects a real `<button.theme-goto-close>` via `theme/setup/main.ts` that calls Slidev's exported `showGotoDialog` ref. CSS in `theme/styles/index.css` styles the button.
- `theme/setup/main.ts` import path corrected from `@slidev/client/state` to `@slidev/client/state/index` to avoid a Vite EISDIR error when slides loaded.

### Backward compatibility

- Agenda `items[]` accepts both v0.3 plain strings (coerced to `{ title }`) and v0.4.1 `{ title, description?, subsections? }` objects.
- Agenda's v0.3 `subsections` field still renders bulleted child rows when `agenda.showSubsections: true`. New `description` field is additive — items can use both (description renders first, then subsections list).
- Bio single-presenter mode (`<Bio presenter="...">`) is unchanged.
- Bio team mode (`<Bio :people=[]>`) keeps the existing prop API; only the rendered output differs.

### Deferred to v0.4.2+

- Cover variants `b`–`j` rebuild (still the audit's primary backlog).
- `RipplePattern.vue` removal (still gated on divider/thank-you rebuilds).
- Full visual-regression baseline refresh (still gated on the upstream `bi/o` icon-resolution flake — VR baselines for slides hosting UI5 web components currently match against pre-existing flake renders).
- Other audit findings (A-6 Quote, A-7 Q&A, A-8/9 Thank-you, A-10 DataPoint, A-11 NumberedCards).

See [docs/superpowers/audit/2026-06-14-v0.4-findings.md](docs/superpowers/audit/2026-06-14-v0.4-findings.md) for the full layout audit informing v0.4 / v0.4.1 / v0.4.2 scope.

## [0.4.0] — 2026-06-14

### Added

- New `<AnvilGridDecoration>` component using CSS `background-image: repeat` of a Flat Anvil tile, sourced from `public/sap/anvil-tile.svg` (a 120×60 viewBox with `currentColor` fill so per-variant coloring works via the CSS `color` cascade).
- New `<PartnerLogoPlaceholder>` component matching POTX's dashed-border partner-logo placeholder. Three states: `partnerLogo:` set to a string renders the logo; omitted renders the dashed placeholder; `null` renders nothing.
- New `<CoverContent>` and `<CoverDecoration>` components implementing the L/R-split (60/40) cover composition matching POTX cover specimens.
- Cover layout `date:` front-matter — falls back to today, formatted via `Intl.DateTimeFormat('en-US', { dateStyle: 'long' })`.
- Cover layout `partnerLogo:` front-matter (string | null | omitted, see three-state behavior above).
- Build-time `validateVariant()` helper in `theme/setup/cover-variants.ts` throws helpful errors on unimplemented cover variants (`b`–`j`) pointing at the v0.4.1 backlog, and on variants `k`/`l` missing required `image:` front-matter; warns when variant `a` has `image:` set.
- New "Cover layout" section in `CONTENT-GUIDE.md` documenting the three shipping variants, front-matter shape, 14-word soft title cap, partner-logo control, and v0.3 → v0.4.0 migration.

### Changed

- Cover layout `theme/layouts/cover.vue` rewritten to use a config-table architecture (`COVER_VARIANTS` in `theme/setup/cover-variants.ts`) and a flex-based 60/40 L/R split, replacing v0.3's `<component :is>` decoration loop and the `clear-space` / `cover-tokens` keep-out math.
- Cover variants `a`, `k`, `l` now match POTX specimens. Other variants (`b`–`j`) defer to v0.4.1 and currently throw build-time errors.
- Bio avatar size reduced from `size="L"` (80 px) to `size="M"` (48 px) to prevent overlap with title text in single-presenter mode (P-3).
- Slide-overview close button (`o` key) now stays in the visible viewport via `position: sticky` (P-2).
- `CoverLetter` type tightened from 12 letters (`'a'..'l'`) to 3 (`'a' | 'k' | 'l'`); descriptive aliases (`photo`, `multi-shape`, etc.) removed from the resolver.
- Sample deck (`slides.md`) cover slide migrated to v0.4.0 front-matter (date, classification, no longer references unsupported variants); kitchen-sink gallery deck (`pages/all-layouts.md`) cover slides for `b`–`j` swapped to `layout: title-only` placeholders so the gallery compiles under the new validator.

### Deferred to v0.4.1

- Cover variants `b`–`j` rebuild (the audit's primary backlog).
- `RipplePattern.vue` removal — kept for v0.4.0 because `theme/layouts/divider.vue` and `theme/layouts/thank-you.vue` still depend on it. Those layouts rebuild as part of v0.4.1, at which point RipplePattern can be removed cleanly.
- Visual-regression baselines for cover-a/k/l + Bio — VR test infrastructure has a pre-existing `bi/o` icon-resolution flake (inherited from v0.3) that prevents gallery-deck slide content from rendering during Playwright runs, so baselines silently match against v0.3 broken renders. The gallery deck source code is migrated for v0.4.0 validators, but actual baseline PNG refresh requires fixing the upstream flake first.

### Migration from v0.3

- Decks using `variant: a`, `k`, or `l` continue to work — visual changes apply automatically (the L/R-split + AnvilGrid replaces the v0.3 footer Ripple).
- Decks using `variant: b`–`j` will throw at build with a v0.4.1-pointing error message; switch to `variant: a` (or wait for v0.4.1).
- The new `date:` and `partnerLogo:` front-matter are additive — existing decks render today's date and a dashed partner placeholder by default.
- v0.3 alias values (`photo`, `multi-shape`, etc.) for the `variant:` field no longer resolve. Use the letter form.

### Open visual-tuning items (deferred per spec §8 Open Questions)

- Anvil-tile size (currently `60×30px` background-size) is a placeholder; final density tuning is v0.4.1 polish.
- Variant-a anvil contrast (`var(--sap-blue-6)` on `var(--sap-blue-11)`) reads dark-on-dark; lighter accent color may be appropriate.
- Variant-k anvil overlay color (`rgba(255,255,255,0.4)`) may need tuning depending on photo contrast.

See [docs/superpowers/audit/2026-06-14-v0.4-findings.md](docs/superpowers/audit/2026-06-14-v0.4-findings.md) for the full layout audit informing v0.4.0 and v0.4.1 scope.

## [0.3.1] — 2026-06-14

### Fixed

- **Ripple decoration no longer renders under cover-slide text.** v0.3.0 set `<RipplePattern>`'s default bottom-band height to 30% of the slide and used `object-fit: cover`, which upscaled the SVG (natural aspect ~3.4:1) far past the band's intended boundary and produced a noisy backdrop behind the cover title and presenter signature. v0.3.1 reduces the band to 12% of slide height, switches to `object-fit: contain` to preserve the SVG's intended density, and pins the image to the bottom edge — the ripple now reads as a thin decorative footer matching the SAP brand portal examples.

### Documentation

- Added a "Keyboard shortcuts" section to [README.md](./README.md) listing Slidev's standard keybindings (`o` for slide overview, `f` for full-screen, etc.) and a tip for dismissing the overview panel when its close affordance is positioned outside the visible viewport.

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
