# Changelog

Two version dimensions:

- **Template version** (`package.json#version`) — structure, components, conventions
- **Brand version** (`package.json#brandVersion`) — POTX-derived

Both follow [semver](https://semver.org).

## [0.4.4] — 2026-06-19

### Fixed

- **VR test fidelity (showstopper):** `pages/all-layouts.md` had `theme: ./theme`,
  which Slidev resolves relative to the markdown file (i.e., `pages/theme/`,
  which doesn't exist). The gallery silently fell back to Slidev's built-in
  default theme, so the project's SAP layouts (cover, divider, thank-you,
  agenda, text-with-icons, table, q-and-a, …) didn't render — and every VR
  baseline captured blank/un-themed content. Combined with `maxDiffPixelRatio:
  0.05`, the VR suite was a silent no-op. Fixed by changing the front-matter
  to `theme: ../theme` and adding an in-place comment so the trap is
  documented.
- **`bi/o` icon-resolution flake (inherited from v0.3):** the unresolved `<Bio>`
  tag in the gallery deck triggered `unplugin-icons` (configured with empty
  prefix by Slidev) to reinterpret it as a Bootstrap Icons lookup `bi:o`,
  producing `[vite] Pre-transform error: Icon 'bi/o' not found` on every
  gallery boot. Resolved as a side-effect of the theme path fix: with the
  theme correctly loaded, `theme/components/Bio.vue` is scanned and `<Bio>`
  resolves cleanly. No separate fix needed.
- **`theme/setup/_dataSources.ts` absolute-path imports** (latent bug exposed by
  the theme path fix): the file imported project-root YAML data files via
  `'/event.yaml'`, `'/presenters/*.yaml'`, etc. Slidev resolves `/` to
  `dirname(entry)`, so absolute paths worked for `slides.md` (project root)
  but resolved to non-existent `pages/event.yaml` for `pages/all-layouts.md`.
  Fixed by switching to file-relative paths (`'../../event.yaml'` etc.).
- **`theme/vite.config.ts` introduced** (latent bug exposed by the theme path
  fix): Slidev only loads `vite.config.ts` from each path in its `roots`
  array. For `pages/all-layouts.md` the user-root is `pages/`, which has no
  `vite.config.ts` — so the project-root `vite.config.ts` (with
  `@rollup/plugin-yaml`) was never loaded for the gallery, and YAML imports
  threw `Failed to parse source for import analysis`. Fixed by shipping a
  `vite.config.ts` at the theme root (always in Slidev's `roots`) that
  registers the YAML plugin.
- **`SETTLE_MS` 200 → 2000** (latent timing bug exposed by the theme path
  fix): the previous value was tuned against the broken (= always blank)
  rendering. With v0.4.4's real rendering, slides that load YAML data via
  `import.meta.glob` need ~2s for Vue to mount components after the data
  resolves. 2000ms is a conservative middle ground.
- **VR cold-compile warm-up** (latent timing bug exposed by the theme path
  fix): the first slide visit during a Playwright session triggers cold
  Vite transforms across the full module graph. Cold compile + Vue mount
  exceeds `SETTLE_MS` for the first ~50 slides, producing pre-mount blank
  screenshots even with the timing bump. Added a `test.beforeAll` warm-up
  that round-trips `/1 → /2 → /1` to prime Vite's cache before the per-slide
  loop runs.

### Changed

- VR coverage expanded from 101 to 146 slides — covers the full
  `pages/all-layouts.md` gallery for the first time.
- 8 existing VR baselines regenerated against the now-correctly-themed
  gallery (slides 1, 56, 58, 60, 62, 74, 92, 94). 45 new baselines added
  for slides 102–146. The remaining 94 baselines remain byte-identical
  to v0.3 because their slides have pre-existing source-markdown bugs
  in `pages/all-layouts.md` whose front-matter isn't being parsed by
  Slidev — those slides render through Slidev's default-layout fallback
  and the v0.4.4 capture matches the v0.3 capture. Per spec §5 non-
  goals, this pre-existing tech debt is deferred to v0.4.5 / v0.5.
- `tests/README.md` corrected: tolerance numbers updated from "0.5%" to
  "5%" to match `playwright.config.ts:31`'s `maxDiffPixelRatio: 0.05`.

### Added

- `tests/regression/theme-path.spec.ts` — Playwright smoke test that locks
  the theme-path fix by asserting on the compiled slide module's import
  paths (theme layout vs. built-in default; theme component vs. icon
  hijack).
- `theme/vite.config.ts` — yaml plugin registration at the theme root so
  it loads for any deck (see fix above).
- `docs/superpowers/findings/2026-06-18-v0.4.4-rebaseline-findings.md` —
  spot-check results from the rebaseline + class-level finding for the
  pre-existing source-markdown debt + drift findings (Bio capture-timing
  artifact on slide 82, missing SAP wordmark image on slide 1, etc.) all
  deferred to v0.4.5 / v0.5 per the v0.4.4 spec §5 non-goals.

### Notes

- v0.4.4 is a test-infrastructure repair release. The substantive code
  change is one character (`./theme` → `../theme`) — but that fix exposed
  4 latent bugs that had been hidden by the silent theme fallback. Each
  fix was empirically verified during implementation; the cascade is
  fully documented in spec §6.1 / §6.3 / §6.4 / §6.5.
- The VR test suite is now non-trivially functional for the first time.
  Baselines reflect actual rendering, so future PRs will produce
  meaningful diffs.

## [0.4.3] — 2026-06-17

### Added

- **`text-with-icons` layout** — POTX-faithful icon grid (slide 9 of POTX).
  Auto-fits to 1-3 (1×N row) / 4 (2×2) / 5 (3+2 centered) / 6 (3×2) / 7+
  (3×N) item counts per spec §4.2. Uses the existing `<SapIcon>` component
  (18-icon catalog at `theme/styles/_extracted/icons.json`). Frontmatter
  `items:` array with required `icon`+`title`, optional `description`,
  `link.text`+`link.url`, `iconColor`. Console.warn fires when items is
  missing or empty.
- **`table` layout** — POTX-faithful styled 4-column table (slide 11 of
  POTX). Slidev native markdown table syntax in slide body; scoped CSS
  styles `thead th` with sap-blue-7 fill / white text / 18pt 72 Brand
  Medium and `tbody td` with sap-blue-4 cell borders. Optional `title:`
  frontmatter.
- **Gallery + main-deck demos** for both layouts — `slides.md` exercises
  `text-with-icons` (Why CAP?) and `table` (CAP vs. ABAP Cloud);
  `pages/all-layouts.md` adds gallery entries at slides 73 + 74.

### Notes

- No new dependencies. Both layouts reuse `<SapIcon>` and
  `<ClassificationFooter>`.
- Pre-impl gate verified Slidev's markdown plugin emits `<thead>` and
  `<tbody>` from a `|---|` divider table — the spec's default `:deep(thead th)`
  and `:deep(tbody td)` CSS path is correct.
- Vitest: +13 unit tests (9 text-with-icons, 4 table); 197/198 passing
  (1 unrelated skip). Production build clean.
- Spec: `docs/superpowers/specs/2026-06-16-v0.4.3-text-icons-table-design.md`
- Plan: `docs/superpowers/plans/2026-06-16-v0.4.3.md`
- Inherited `bi/o` icon-resolution flake from v0.3 still surfaces in the
  gallery dev server overlay; documented but not addressed in this release.
- Pre-existing VR coverage gap (gallery slides 102-146 not snapshotted by
  `tests/visual.spec.ts` SLIDE_COUNT=101) remains as tech debt for a
  future cleanup release; v0.4.3's gallery entries were positioned at
  slides 73 + 74 to fit within the existing window.

## [0.4.2.3] — 2026-06-16

### Changed (breaking)

- **Divider collapsed to a single canonical POTX design.** v0.4.2 introduced
  four creative variants (`a` / `b` / `c` / `d`); only variant `c` matched
  the actual POTX. The divider layout now always renders the canonical
  POTX design (white top half + navy bottom half with the source anvil
  pattern) and ignores any `variant:` front-matter.
- **Migration:** decks that set `variant: a|b|c|d` on a divider slide
  will silently get the canonical design. Drop the `variant:` line for
  cleanliness, but it's not strictly required.

### Fixed

- **Agenda content overflow.** Decks with 6 agenda items had the last
  row clipped below the slide bottom. Tightened the agenda layout's
  top padding (8.4% → 6%), bottom padding (5% → 3%), inter-row gap
  (1.5rem → 0.5rem), and `<AgendaItem>` padding-bottom (0.8% → 0.4%) +
  hairline margin (1.5% → 0.8%). 6 items now fit within 1080px slide
  height with ~30px clearance.

### Removed

- **Divider variant CSS** (`.divider--a/b/c/d`, `.divider-flat-anvil--*`,
  `.divider-band`) and the variant-resolution logic in `divider.vue`.
- **The 3 redundant divider entries** in `pages/all-layouts.md`
  (variants A/B/D); the single "Divider" entry now exercises the full
  canonical design.

### Notes

- Vitest: 171/171 passing (was 174/174; -3 = collapsed variant tests
  replaced by simpler single-design tests)
- Production build: clean
- Every other layout (cover, agenda, thank-you, quote, q-and-a, Bio
  team-mode) is unchanged.

## [0.4.2.2] — 2026-06-16

### Fixed (anvil-pattern fidelity hotfix)

v0.4.2.1 fixed anvil silhouette distortion (the brand-rule violation), but
the **anvil-grid background pattern** itself was a CSS-tiled approximation
that never matched the POTX. Reported as a recurring issue across the
agenda sidebar, divider variant c, the Bio team-mode "Meet our team"
band, and the thank-you variant b band.

Root cause: the original `<AnvilGridDecoration>` rendered a small SVG
tile via `background-repeat`. No combination of tile size and density
reproduced the POTX layout because the POTX is **not** a uniform tile —
it's `image38.svg` ("Ripple_Pattern"), a hand-composed pattern of 1,040
individual anvil shapes at 5 different sizes, embedded directly in the
`SAP_Corp.potx` file at `ppt/media/image38.svg`.

Fix:

- **Extract the canonical pattern from POTX** — the source SVG is now
  shipped at `public/sap/anvil-pattern-source.svg`, byte-for-byte from
  `SAP_Corp.potx → ppt/media/image38.svg`. 1,040 anvil paths,
  viewBox 5242.82 × 1553.5, color sap-blue-6.
- **`<HandPlacedAnvils>`** — new component that fetches the source SVG,
  parses it via `DOMParser` (XML mode), and inserts it into the host
  container at mount-time. Renders the literal POTX pattern, not a JS
  composition.
- **`shape` prop** — `'wide'` (default) for ~3.5:1 bands (thank-you,
  Bio team-mode, divider-c) selects POTX slide-6's `srcRect` window.
  `'portrait'` for narrow tall containers (agenda right column ≈ 0.6:1)
  selects a vertical slice from the source so anvils render at native
  pixel scale.
- **Migrated consumers**: `thank-you.vue`, `agenda.vue`, `divider.vue`
  (variant c), and `Bio.vue` (team mode) all use `<HandPlacedAnvils>`.

### Added

- **`scripts/inspect-potx.mjs`** — utility to extract or list POTX inner
  files (slide layouts, masters, media). Useful for future POTX work.

### Notes

- The cover slide (`<CoverDecoration>`) still uses the v0.4.0
  `<AnvilGridDecoration>` tile — that's a different brand treatment
  (POTX cover slide pattern), out of scope for this hotfix.
- `<HandPlacedAnvils>` color is fixed at sap-blue-6 (the value baked
  into the source SVG paths). If a future consumer needs a different
  color, replace the SVG's literal `fill="#1B90FF"` with
  `fill="currentColor"` and thread color through.
- Vitest: 187/187 passing (+13 over the v0.4.2.1 baseline; previously-
  skipped tests now run). Production build clean.

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
