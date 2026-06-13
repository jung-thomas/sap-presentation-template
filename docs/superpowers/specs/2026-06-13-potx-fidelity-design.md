# POTX Visual Fidelity — Design

**Status:** Draft for review
**Date:** 2026-06-13
**Author:** Thomas Jung (with Claude assistance)
**Supersedes:** No prior spec; extends the original v0.1.0 implementation
**Related:** [2026-06-13-sap-presentation-template-design.md](./2026-06-13-sap-presentation-template-design.md)

## 1. Summary

The v0.1.0 SAP Presentation Template ships a working theme but renders cover/divider/thank-you variants as approximations — flat color blocks instead of the layered geometric decorations the POTX actually uses, and content-layout typography that approximates rather than matches the POTX's specific spacing. This spec defines the work to bring **all major visual-heavy layouts** to genuine POTX visual fidelity.

The work has three stages within a single delivery:

- **Stage A** — Architecture + decoration-heavy covers and dividers (12 covers + 4 dividers)
- **Stage B** — Typography fidelity for thank-you (2 variants) and content layouts (~8 files)
- **Stage C** — Sample deck polish + Unsplash demo photo + CONTENT-GUIDE updates

The architectural foundation is a **decoration component library** (`theme/components/decorations/*.vue`) consumed by layouts that need POTX-faithful visual treatments. Decorations are inline SVG using brand-token CSS variables. The SAP logo uses the official Brand Tools SVG (color + white variants). Geometry constants (logo position, title position, photo placeholder) come from a new auto-generated `cover-tokens.css` extracted from POTX `<p:pic>` and placeholder rectangles. Typography constants (font sizes, line heights, gutters) come from a new auto-generated `typography-tokens.css`.

## 2. Goals

1. **Cover variants visually match the POTX** — the iconic SAP decorations (diagonal cuts, nested wedges, photo placeholders, multi-shape compositions) render correctly on each variant a–l.
2. **Dividers, thank-you, and content layouts feel POTX-correct** — typography, spacing, color treatments derive from the POTX rather than being hand-tuned approximations.
3. **All visual fidelity is brand-token-driven** — when SAP brand updates, the decorations and typography update automatically; no per-layout edits.
4. **Authoring API stays stable** — the existing `variant: a..l` system continues to work; descriptive aliases (`variant: photo`, `variant: wedges`) added as a non-breaking convenience.
5. **Logo treatment is automatic** — covers with dark backgrounds use the white-monochrome logo; covers with light backgrounds use the color logo; multi-shape covers can opt into per-component logo treatment.

## 3. Non-goals

- Animations and transitions matching POTX
- Internal-vs-external SAP lockup variants (POTX doesn't differentiate)
- Print/handout-specific layouts (PDF export covers this)
- RTL language support
- Embedding the actual SAP press-kit photo in the public repo (license clarity); we ship an Unsplash demo and document the swap

## 4. Architecture

### 4.1 Three-layer structure

```
┌─────────────────────────────────────────────────────┐
│ Layer 3: cover.vue / divider.vue / thank-you.vue    │
│  - Receives `variant` prop (letter or alias)        │
│  - Normalizes alias → letter via small map          │
│  - Picks the right decoration component to render   │
│  - Handles title/subtitle/presenter slots           │
│  - Picks logo color (primary/white/auto)            │
├─────────────────────────────────────────────────────┤
│ Layer 2: theme/components/decorations/*.vue         │
│  - One component per distinct decoration motif      │
│  - Mostly inline SVG using brand-token CSS vars     │
│  - Each ~30–80 lines, single responsibility         │
│  - Optionally exports `logoTreatment` constant      │
├─────────────────────────────────────────────────────┤
│ Layer 1: theme/styles/_extracted/*-tokens.css       │
│  - cover-tokens.css (logo/title/photo geometry)     │
│  - typography-tokens.css (font sizes, gutters,      │
│    line-heights, paragraph spacing)                 │
│  - Both auto-generated from POTX layouts.json       │
└─────────────────────────────────────────────────────┘
```

### 4.2 File inventory

**New (Stage A):**

| Path | Purpose |
|---|---|
| `theme/styles/_extracted/cover-tokens.css` | GENERATED — POTX-derived geometry constants |
| `theme/styles/_extracted/typography-tokens.css` | GENERATED — POTX-derived font/spacing constants |
| `theme/components/decorations/DecorationPhoto.vue` | Cover A — photo placeholder + fallback wedge motif |
| `theme/components/decorations/DecorationDiagonal.vue` | Covers B / J — diagonal-cut blue silhouette |
| `theme/components/decorations/DecorationWedges.vue` | Cover G — nested layered wedges |
| `theme/components/decorations/DecorationSolid.vue` | Covers F / H / I / K — solid full-bleed |
| `theme/components/decorations/DecorationMultiShape.vue` | Covers C / D / E — multi-element compositions |
| `theme/components/decorations/DecorationGradient.vue` | Cover L — gradient fade |
| `theme/components/decorations/DividerWedge.vue` | Divider A–D backgrounds |
| `theme/setup/cover-variants.ts` | Alias map + decoration picker + dark-bg classifier |
| `scripts/lib/emit-cover-tokens.mjs` (+ test) | Emits cover-tokens.css from layouts.json |
| `scripts/lib/emit-typography-tokens.mjs` (+ test) | Emits typography-tokens.css from layouts.json |

**New (Stage B):**

| Path | Purpose |
|---|---|
| `theme/components/decorations/DecorationThankYou.vue` | Thank-you variants a/b |

**Modified:**

| Path | Change |
|---|---|
| `scripts/lib/parse-layouts.mjs` | Capture `<p:pic>` geometry + `<a:lstStyle>` text styles |
| `scripts/extract-brand.mjs` | Call new emitters; cover-tokens & typography-tokens written |
| `theme/styles/index.css` | Import the two new token files (after horizon-mapping, before slide-styles) |
| `theme/layouts/cover.vue` | Rewrite using new architecture |
| `theme/layouts/divider.vue` | Rewrite using DividerWedge |
| `theme/layouts/thank-you.vue` | Rewrite using DecorationThankYou |
| `theme/layouts/title-text.vue` | Consume typography-tokens |
| `theme/layouts/title-text-2col.vue` | Consume typography-tokens |
| `theme/layouts/title-text-3col.vue` | Consume typography-tokens |
| `theme/layouts/content-image-2col.vue` | POTX gutter/spacing fidelity |
| `theme/layouts/content-image-3col.vue` | Same |
| `theme/layouts/content-image-4col.vue` | Same |
| `theme/layouts/title-content.vue` | Consume typography-tokens |
| `theme/layouts/title-only.vue` | Consume typography-tokens |
| `theme/layouts/title.vue` | Consume typography-tokens |
| `theme/layouts/title-photo.vue` | Consume typography-tokens |
| `theme/layouts/content-photo-1.vue` | Same |
| `theme/layouts/content-photo-2.vue` | Same |
| `theme/layouts/q-and-a.vue` | POTX closing-slide treatment |
| `theme/layouts/agenda.vue` | Numbered list spacing per POTX |

**New (Stage C):**

| Path | Purpose |
|---|---|
| `public/covers/cover-default.jpg` | Unsplash demo photo for sample deck |
| `slides.md` | Updated to use `image: /covers/cover-default.jpg` on cover |
| `CONTENT-GUIDE.md` | Variant alias table; photo override; SAP press-kit upgrade path; typography reference |

## 5. Component contracts

### 5.1 Common decoration contract

Every decoration component:

- Receives at most a `variant` prop (letter `a..l` for covers, `a..d` for dividers).
- Renders a `<div class="decoration">` with absolute positioning filling its parent.
- Inline SVG is `100% × 100%` with `preserveAspectRatio` chosen per motif.
- All colors via `var(--sap-brand-*)` — never hardcoded hex.
- `aria-hidden="true"` on the SVG (purely decorative).
- Zero side effects, no data fetching, no state.
- Optionally exports `logoTreatment: 'primary' | 'white'` for the auto logo treatment system.

### 5.2 Per-decoration spec

#### `DecorationPhoto.vue` (Cover A)

- **Props:** `image?: string`, `alt?: string`
- **Behavior:** if `image` is set, renders `<img object-fit: cover>` filling the right half. If unset, renders nested-wedges fallback in the right half (using brand-blue tints).
- **Background:** white (left half stays for title).
- **Logo treatment:** primary.

#### `DecorationDiagonal.vue` (Covers B / J)

- **Props:** `variant?: 'b' | 'j'`
- **Geometry:** `polygon(0 0, 1280 0, 1280 504, 896 720, 0 720)` (diagonal cut from upper-right going to lower-left, leaving a white triangle in the lower-right).
- **Variant b:** white background underneath, brand-blue polygon
- **Variant j:** brand-blue-darker background, brand-blue polygon (silhouette has internal contrast)
- **Logo treatment:** white.

#### `DecorationWedges.vue` (Cover G)

- **Props:** none
- **Behavior:** Full-slide nested wedges. 4 layers:
  - Outermost (full slide): `--sap-brand-blue-darker`
  - Layer 2 (~92% inset, diagonal-cut): `--sap-brand-blue`
  - Layer 3 (~80% inset): `--sap-brand-blue-light`
  - Layer 4 (~60% inset): `--sap-brand-blue-pale`
  - Each layer truncated by the same diagonal angle in the lower-right
- **Logo treatment:** white.

#### `DecorationSolid.vue` (Covers F / H / I / K)

- **Props:** `variant?: 'f' | 'h' | 'i' | 'k'`
- **Behavior:** Full-slide solid background by variant
  - `f`: `--sap-brand-blue-darker`
  - `h`: `--sap-brand-teal-dark`
  - `i`: `--sap-brand-purple`
  - `k`: `--sap-brand-blue-darker` (verify against POTX during implementation)
- **Logo treatment:** white.

#### `DecorationMultiShape.vue` (Covers C / D / E)

- **Props:** `variant?: 'c' | 'd' | 'e'`
- **Behavior:** Multiple decorative shapes/blocks. Variants differ in palette and composition.
- **Implementation note:** Examine `slideLayout3.xml`, `slideLayout4.xml`, `slideLayout5.xml` carefully before coding. If composition complexity exceeds ~80 lines for a single component, split into `DecorationMultiShapeC.vue`, `DecorationMultiShapeD.vue`, `DecorationMultiShapeE.vue`.
- **Logo treatment:** auto (each variant's component declares its own).

#### `DecorationGradient.vue` (Cover L)

- **Props:** none
- **Behavior:** Full-slide vertical gradient from `--sap-brand-blue-darker` (top) to `--sap-black` (bottom).
- **Implementation note:** Pure CSS background-image; no SVG needed.
- **Logo treatment:** white.

#### `DividerWedge.vue` (Divider A–D)

- **Props:** `variant?: 'a' | 'b' | 'c' | 'd'`
- **Behavior:** Full-slide background, single solid color OR two-tone diagonal split per variant
  - `a`: solid `--sap-brand-blue-darker`
  - `b`: diagonal `--sap-brand-blue-darker` → `--sap-brand-blue` split
  - `c`: solid `--sap-brand-teal-dark`
  - `d`: diagonal `--sap-brand-purple-dark` → `--sap-brand-blue-darker`

#### `DecorationThankYou.vue` (Thank-you a/b)

- **Props:** `variant?: 'a' | 'b'`
- **Behavior:** Full-slide treatment for closing slides
  - `a`: solid brand-blue-darker, large "Thank you" centered
  - `b`: diagonal split treatment
- **Refines based on POTX inspection during implementation.**

### 5.3 cover.vue contract

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { resolveCoverVariant, getDecoration, useDarkLogo } from '../setup/cover-variants'
import Speaker from '../components/Speaker.vue'
import { getEvent } from '../setup/data'

const props = defineProps<{ frontmatter?: Record<string, unknown> }>()

const fm = computed(() => props.frontmatter ?? {})
const variantLetter = computed(() => resolveCoverVariant(fm.value.variant as string | undefined))
const Decoration = computed(() => getDecoration(variantLetter.value))
const isDarkBg = computed(() => useDarkLogo(variantLetter.value, fm.value.image as string | undefined))
const logoSrc = computed(() => isDarkBg.value ? '/logos/logo-sap-white.svg' : '/logos/logo-sap-primary.svg')

const eventData = getEvent()
const eventName = computed(() => (fm.value.event as string) ?? eventData.name)
</script>

<template>
  <div :class="['cover', `cover--${variantLetter}`, { 'cover--dark': isDarkBg }]">
    <component :is="Decoration" :variant="variantLetter" :image="$frontmatter?.image" />
    <img class="cover-logo" :src="logoSrc" alt="SAP" />
    <div class="cover-content">
      <h1 v-if="$frontmatter?.title">{{ $frontmatter.title }}</h1>
      <p v-if="$frontmatter?.subtitle" class="subtitle">{{ $frontmatter.subtitle }}</p>
      <slot />
      <footer class="cover-footer">
        <Speaker :presenter="$frontmatter?.presenter" />
        <span class="event">{{ eventName }}</span>
      </footer>
    </div>
  </div>
</template>
```

Key points:
- `<component :is="Decoration">` for dynamic decoration selection.
- Explicit `Speaker` import to avoid the auto-resolution name-collision class of bug we hit with Agenda.
- The SAP logo is a peer of the decoration, not embedded in it — single source of truth for logo position.

### 5.4 setup/cover-variants.ts contract

```ts
import DecorationPhoto from '../components/decorations/DecorationPhoto.vue'
import DecorationDiagonal from '../components/decorations/DecorationDiagonal.vue'
import DecorationWedges from '../components/decorations/DecorationWedges.vue'
import DecorationSolid from '../components/decorations/DecorationSolid.vue'
import DecorationMultiShape from '../components/decorations/DecorationMultiShape.vue'
import DecorationGradient from '../components/decorations/DecorationGradient.vue'

const DECORATION_BY_LETTER = {
  a: DecorationPhoto,
  b: DecorationDiagonal, c: DecorationMultiShape, d: DecorationMultiShape, e: DecorationMultiShape,
  f: DecorationSolid, g: DecorationWedges, h: DecorationSolid,
  i: DecorationSolid, j: DecorationDiagonal, k: DecorationSolid, l: DecorationGradient
} as const

const ALIASES: Record<string, string> = {
  photo: 'a', diagonal: 'b',
  'photo-portrait': 'c', 'multi-shape': 'd', 'multi-shape-purple': 'e',
  'solid-blue': 'f', wedges: 'g', 'solid-teal': 'h',
  'solid-purple': 'i', 'diagonal-tinted': 'j',
  'solid-blue-darker': 'k', 'gradient-fade': 'l'
}

const DARK_BG_VARIANTS = new Set(['b', 'f', 'g', 'h', 'i', 'j', 'k', 'l'])
const AUTO_LOGO_VARIANTS = new Set(['c', 'd', 'e']) // resolved via component-exported logoTreatment

export function resolveCoverVariant(input?: string): string {
  if (!input) return 'a'
  const lower = input.toLowerCase()
  if (lower.length === 1 && lower >= 'a' && lower <= 'l') return lower
  return ALIASES[lower] ?? 'a'
}

export function getDecoration(letter: string) {
  return DECORATION_BY_LETTER[letter as keyof typeof DECORATION_BY_LETTER] ?? DecorationPhoto
}

export function useDarkLogo(letter: string, image?: string): boolean {
  // Cover A with no image renders the wedge fallback (dark) → white logo
  if (letter === 'a' && !image) return true
  if (DARK_BG_VARIANTS.has(letter)) return true
  if (AUTO_LOGO_VARIANTS.has(letter)) {
    const decoration = DECORATION_BY_LETTER[letter as keyof typeof DECORATION_BY_LETTER] as any
    return decoration?.logoTreatment === 'white'
  }
  return false
}
```

All synchronous, easily unit-tested.

### 5.5 cover-tokens.css generation

Emitted by `scripts/lib/emit-cover-tokens.mjs`. Reads layouts.json (specifically Cover A's placeholders + pics), derives percentages from POTX EMU, emits CSS:

```css
/* GENERATED — do not edit. Source: SAP_Corp.potx layouts. */
:root {
  /* SAP logo position (Cover A pic geometry) */
  --cover-logo-top: 7.35%;
  --cover-logo-left: 4.13%;
  --cover-logo-width: 5.96%;

  /* Cover A title placeholder */
  --cover-title-top: 39.46%;
  --cover-title-left: 4.13%;
  --cover-title-width: 39.08%;

  /* Cover A picture placeholder */
  --cover-photo-left: 48.95%;
  --cover-photo-width: 51.05%;
}
```

Slide dimensions baked in: 12,192,000 × 6,858,000 EMU (16:9 at 13.333" × 7.5").

### 5.6 typography-tokens.css generation

Emitted by `scripts/lib/emit-typography-tokens.mjs`. Reads placeholder text styles from layouts.json (`<a:lstStyle>` per placeholder), derives:

- Font sizes per heading level (h1/h2/h3) per layout family
- Line spacing percentages
- Paragraph space-before / space-after
- Bullet character + colors
- Default text color per placeholder type

**Implementation note:** the POTX has many possible text style overrides per placeholder. For tractability, we extract the 10 most-impactful values and emit them as named tokens. Layouts opt into specific tokens via class names like `.layout-content` or `.layout-title-only`.

Documented gaps: any per-placeholder override beyond the extracted set falls back to deck-level slide-styles.css defaults.

## 6. Logo treatment

### 6.1 Three modes

| Mode | When | Source |
|---|---|---|
| `primary` | Light backgrounds | `/logos/logo-sap-primary.svg` (color SAP logo) |
| `white` | Dark backgrounds | `/logos/logo-sap-white.svg` (white-monochrome) |
| `auto` | Multi-shape covers | Decoration component exports `logoTreatment` constant |

### 6.2 White logo asset

`theme/public/logos/logo-sap-white.svg` is the official white-monochrome SAP logo from Brand Tools (already placed during this brainstorm). 1.2 KB SVG, viewBox 792 × 612, all paths use `fill: #fff`.

### 6.3 Per-variant treatment

Already documented in 5.4. The `useDarkLogo()` function is the single source of truth.

### 6.4 Cover A special case

Cover A is light-background (white) when an image is supplied — primary logo. When no image (fallback wedge motif, blue-dominant) — white logo. The check is in `useDarkLogo(letter, image)`.

## 7. Implementation order

### Stage A — Architecture + decoration-heavy layouts (12 covers + 4 dividers)

1. Extend `parse-layouts.mjs` to capture `<p:pic>` geometry + placeholder text styles
2. New `emit-cover-tokens.mjs` + test (TDD)
3. New `emit-typography-tokens.mjs` + test (TDD)
4. Wire both emitters into `extract-brand.mjs`; re-extract
5. Set up `theme/components/decorations/` with `DecorationSolid` end-to-end (architectural pilot)
6. `setup/cover-variants.ts` resolver + tests
7. Rewrite `cover.vue` using new architecture (Cover A working)
8. Build remaining cover decorations: `DecorationDiagonal`, `DecorationWedges`, `DecorationGradient`, `DecorationMultiShape`
9. Verify all 12 covers in gallery
10. `divider.vue` + `DividerWedge` (4 dividers)

### Stage B — Typography fidelity + thank-you + content layouts

11. Build `DecorationThankYou` component; rewrite `thank-you.vue` (2 variants)
12. Update `title-text.vue`, `title-text-2col.vue`, `title-text-3col.vue` to consume typography-tokens
13. Update `content-image-2col`, `content-image-3col`, `content-image-4col` for POTX gutter/spacing
14. Update `q-and-a.vue` with proper closing-slide treatment from POTX
15. Update `agenda.vue` typography to match POTX
16. Update `title-content.vue`, `title-only.vue`, `title.vue`, `title-photo.vue`, `content-photo-1/2.vue`

### Stage C — Polish

17. Add `public/covers/cover-default.jpg` (Unsplash demo image)
18. Update `slides.md` so cover slide uses this image
19. Update Playwright baselines for all changed layouts (~25 baselines)
20. Update CONTENT-GUIDE: variant alias table, photo override pattern, SAP press-kit upgrade path, typography token reference, Unsplash attribution

## 8. Testing

**Unit tests (fast, ~ms each):**
- `cover-variants.test.ts` — alias resolution, decoration picker, dark-bg classification
- `emit-cover-tokens.test.ts` — CSS emission from synthetic layout data
- `emit-typography-tokens.test.ts` — CSS emission from synthetic layout data
- `parse-layouts.test.ts` (extended) — verify `pics` field is populated, `lstStyle` captured

**Visual regression:**
- ~25 baselines updated in `tests/visual.spec.ts-snapshots/`
- Existing workflow handles capture + commit
- The baseline diff is the visible "before/after" of the fidelity work

**Manual smoke tests:**
- End of Stage A: `npm run dev` → click through 12 covers + 4 dividers
- End of Stage B: typography on content layouts looks POTX-correct
- End of Stage C: demo deck looks polished with photo cover

## 9. Risks & mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Multi-shape covers (C/D/E) more complex than expected | Medium-High | Medium | Inspect XML before coding; split into 3 files if needed |
| Auto logo treatment heuristic gets corner wrong | Medium | Low (visual annoyance) | Kitchen-sink validation; explicit override per variant |
| Typography-tokens fidelity gap — POTX has placeholder-level overrides we can't fully express | High | Medium | Extract the 10 most-impactful values; document gaps; rely on slide-styles fallback |
| POTX percentages don't match expected visual proportions | Low | Medium | Trust the data; investigate rendering, not the numbers |
| `<component :is>` SSR/dev-mode quirks in Slidev | Low | Medium | Standard Vue 3; falls back to `v-if` cascade if needed |
| Demo Unsplash photo's URL changes | Very Low | Low | Pin specific Unsplash photo ID; document attribution |
| Photo aspect ratio mismatch — Cover A right-half is ≈0.91:1, most stock photos are 16:9 | Medium | Low | `object-fit: cover`; document portrait-leaning hero in CONTENT-GUIDE |
| Stage B typography churn breaks visual baselines for many slides at once | High | Low | Expected. Reviewers diff carefully; intentional sweep |

## 10. Out of scope

- Animations and transitions matching POTX
- Internal-vs-external SAP lockup variants
- Print/handout-specific layouts
- RTL language support
- Real SAP press-kit imagery shipped in the public repo (legal clarity)

## 11. Sample deck update specifics

- **Source:** Unsplash image, business or technology theme, permissive license, ≥2400 px on long side
- **Filename:** `public/covers/cover-default.jpg`
- **Used in:** `slides.md` first slide as `image: /covers/cover-default.jpg`
- **CONTENT-GUIDE entries:**
  - Photo attribution (photographer, Unsplash URL)
  - "Using SAP press-kit imagery" — link to brand portal, instructions to download .jpg, replace `cover-default.jpg`
  - Note that fork-authors with Brand Tools access should use the official imagery in production decks

## 12. Dependencies

No new runtime dependencies. The Unsplash photo is a static asset, not a fetch.

Existing dependencies cover all this work:
- `fast-xml-parser` (parsing extended `<p:pic>` and `<a:lstStyle>` elements)
- `vue` (`<component :is>` is core Vue 3)
- `@playwright/test` (baseline updates)

## 13. Versioning

This work is **v0.2.0** of the template. Brand version unchanged (still `2024.1`; same POTX). The changelog entry calls out the visual fidelity sweep.

## 14. Open questions (defer to implementation)

- Exact POTX geometry for Cover K — confirm whether it's `--sap-brand-blue-darker` or `--sap-brand-blue-darkest` during implementation
- Multi-shape variant decompositions — likely require splitting `DecorationMultiShape` into 3 files (C/D/E); decide based on actual XML complexity
- Specific typography token names — derived from placeholder text styles; finalized when extraction script is built
- Unsplash photo selection — pick during Stage C; not blocking

## 15. Estimated effort

- Stage A: ~6 hours (architecture + 16 layouts)
- Stage B: ~4 hours (10 typography-driven layouts)
- Stage C: ~1 hour (asset, demo deck, docs)

**Total: ~11 hours of focused work, ~1.5 days at sustained pace.**
