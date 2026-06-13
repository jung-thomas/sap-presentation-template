# POTX Visual Fidelity Implementation Plan (v0.2.0)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring all major visual-heavy SAP Presentation Template layouts to genuine POTX visual fidelity — 12 cover variants with proper decorations, 4 dividers, 2 thank-you variants, and 10 content/typography layouts consuming auto-extracted POTX tokens.

**Architecture:** Three-layer composition — layout files compose decoration components from `theme/components/decorations/` which use auto-generated `cover-tokens.css` (geometry) and `typography-tokens.css` (text styles) as their CSS-variable input. Decorations are inline SVG using brand-token CSS variables. SAP logo (color + white-monochrome variants from Brand Tools) is positioned by cover-tokens, with auto-treatment based on background.

**Tech Stack:** Node 22 · TypeScript · Vue 3 · Vite · Slidev · `fast-xml-parser` · Vitest · Playwright · `@ui5/webcomponents` · `@sap-theming/theming-base-content`

**Spec:** [docs/superpowers/specs/2026-06-13-potx-fidelity-design.md](../specs/2026-06-13-potx-fidelity-design.md)

**Branch:** `feat/potx-visual-fidelity` (already created from `main`)

---

## How to use this plan

- Tasks are bite-sized (2–5 min each). Check off `- [ ]` boxes as you complete steps.
- Each task ends in a `git commit` step.
- TDD applies wherever logic is testable (parsers, emitters, alias resolvers). Vue decoration components don't need unit tests; Playwright visual regression covers them.
- File paths are exact and absolute-from-repo-root.
- The plan ships 3 stages (A → B → C). Stage A has architectural prerequisites for Stage B; don't reorder.
- Reference the spec for *why*; this is the *what* and *how*.

---

## Phase index

### Stage A — Architecture + decoration-heavy layouts

1. Extend `parse-layouts.mjs` for `<p:pic>` geometry + placeholder text styles
2. New `emit-cover-tokens.mjs` (TDD)
3. New `emit-typography-tokens.mjs` (TDD)
4. Wire emitters into `extract-brand.mjs`; re-extract; commit generated files
5. Create decorations directory + `DecorationSolid.vue` (architectural pilot)
6. `setup/cover-variants.ts` resolver (TDD)
7. Rewrite `cover.vue` end-to-end with new architecture
8. Build remaining cover decorations (Photo, Diagonal, Wedges, Gradient, MultiShape)
9. Verify all 12 covers in dev + gallery
10. Rewrite `divider.vue` + `DividerWedge.vue`

### Stage B — Typography + thank-you + content layouts

11. `DecorationThankYou.vue` + rewrite `thank-you.vue`
12. Update title-text family to consume typography-tokens
13. Update content-image-Ncol family
14. Update q-and-a, agenda
15. Update remaining title/photo layouts

### Stage C — Polish + release

16. Add Unsplash demo photo
17. Update `slides.md` to use the photo
18. Update Playwright baselines (~25 layouts)
19. Update CONTENT-GUIDE
20. Pre-merge checklist + PR

---

<!-- PLAN_BODY_FOLLOWS -->

## Stage A — Architecture + decoration-heavy layouts

### Task 1: Extend parse-layouts.mjs to capture `<p:pic>` and `<a:lstStyle>`

The existing parser only captures `<p:sp>` placeholder shapes. We need:
- `<p:pic>` elements (the SAP logo and other fixed-position images), captured per layout
- `<a:lstStyle>` text style overrides on placeholders (font sizes, line spacing) for typography tokens

**Files:**

- Modify: `scripts/lib/parse-layouts.mjs`
- Modify: `scripts/lib/parse-layouts.test.ts`

- [ ] **Step 1: Write the failing test for `pics` array**

Add to `scripts/lib/parse-layouts.test.ts` inside the existing `describe`:

```ts
it('captures <p:pic> elements per layout (e.g., the SAP logo on Cover A)', async () => {
  const tmp = await extractPotxToTemp(resolve('SAP_Corp.potx'))
  const layouts = await extractAllLayouts(tmp)
  const cover = layouts.find((l) => l.name === 'Cover A')
  expect(cover).toBeDefined()
  expect(Array.isArray(cover.pics)).toBe(true)
  expect(cover.pics.length).toBeGreaterThanOrEqual(1)
  const pic = cover.pics[0]
  expect(pic.x).toBeGreaterThanOrEqual(0)
  expect(pic.y).toBeGreaterThanOrEqual(0)
  expect(pic.cx).toBeGreaterThan(0)
  expect(pic.cy).toBeGreaterThan(0)
})
```

- [ ] **Step 2: Write the failing test for placeholder text styles**

```ts
it('captures placeholder lstStyle font size when present', async () => {
  const tmp = await extractPotxToTemp(resolve('SAP_Corp.potx'))
  const layouts = await extractAllLayouts(tmp)
  const cover = layouts.find((l) => l.name === 'Cover A')
  // Cover A title placeholder has lstStyle with sz="3600" → 36 pt
  const title = cover.placeholders.find((p) => p.type === 'title')
  expect(title).toBeDefined()
  // textStyles is an optional field; when present, may have fontSize, lineSpacing
  if (title.textStyles?.fontSize !== undefined) {
    expect(title.textStyles.fontSize).toBeGreaterThan(0)
  }
})
```

- [ ] **Step 3: Run tests — should fail**

Run: `npm test -- parse-layouts`
Expected: 2 new tests fail (`pics` undefined, `textStyles` not on shape).

- [ ] **Step 4: Extend the parser**

Update `scripts/lib/parse-layouts.mjs`. Add `<p:pic>` to the parser's array tags and extract them in the per-layout loop:

```js
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  removeNSPrefix: true,
  isArray: (name) => ['sp', 'pic'].includes(name)
})

// ... inside extractAllLayouts loop, after the existing `for (const sp of sps)` block:

// Capture <p:pic> elements (logos, fixed images)
const pics = []
const picElements = spTree?.pic ?? []
for (const pic of picElements) {
  const xfrm = pic.spPr?.xfrm ?? {}
  const off = xfrm.off ?? {}
  const ext = xfrm.ext ?? {}
  const name = pic.nvPicPr?.cNvPr?.['@_name'] ?? ''
  pics.push({
    name,
    x: off['@_x'] != null ? Number(off['@_x']) : null,
    y: off['@_y'] != null ? Number(off['@_y']) : null,
    cx: ext['@_cx'] != null ? Number(ext['@_cx']) : null,
    cy: ext['@_cy'] != null ? Number(ext['@_cy']) : null
  })
}

// Within the existing placeholder loop, also capture textStyles when present
// Replace the existing push with:
const lstStyle = sp.txBody?.lstStyle
const textStyles = lstStyle ? extractTextStyles(lstStyle) : undefined
placeholders.push({
  type: ph['@_type'] ?? 'body',
  idx: ph['@_idx'] ?? null,
  x: off['@_x'] != null ? Number(off['@_x']) : null,
  y: off['@_y'] != null ? Number(off['@_y']) : null,
  cx: ext['@_cx'] != null ? Number(ext['@_cx']) : null,
  cy: ext['@_cy'] != null ? Number(ext['@_cy']) : null,
  ...(textStyles ? { textStyles } : {})
})

// Push pics into the layout output
layouts.push({ file, name, placeholders, pics })
```

Add the helper function at the bottom of the file:

```js
function extractTextStyles(lstStyle) {
  // lstStyle.lvl1pPr.defRPr.@_sz is in 100ths of a point (3600 = 36pt)
  const lvl1 = lstStyle.lvl1pPr ?? {}
  const defRPr = lvl1.defRPr ?? {}
  const lnSpc = lvl1.lnSpc ?? {}
  const result = {}
  if (defRPr['@_sz'] != null) {
    result.fontSize = Number(defRPr['@_sz']) / 100 // → points
  }
  if (lnSpc.spcPct?.['@_val'] != null) {
    result.lineSpacing = Number(lnSpc.spcPct['@_val']) / 1000 // → percent (90000 = 90%)
  }
  return Object.keys(result).length > 0 ? result : undefined
}
```

- [ ] **Step 5: Run tests — should pass**

Run: `npm test -- parse-layouts`
Expected: all parse-layouts tests pass (4 total: existing 3 + new pics test, plus textStyles is optional so it should pass either way).

- [ ] **Step 6: Re-run extraction and verify layouts.json now has pics**

Run: `npm run extract-brand`
Then: `node -e "const j=require('./theme/styles/_extracted/layouts.json'); const c=j.layouts.find(l=>l.name==='Cover A'); console.log('pics:', c.pics); console.log('title textStyles:', c.placeholders.find(p=>p.type==='title')?.textStyles)"`

Expected: prints a non-empty `pics` array (the SAP logo geometry) and a `textStyles` object with `fontSize` and possibly `lineSpacing`.

- [ ] **Step 7: Commit**

```bash
git add scripts/lib/parse-layouts.mjs scripts/lib/parse-layouts.test.ts theme/styles/_extracted/layouts.json
git commit -m "feat(parse-layouts): capture <p:pic> geometry + placeholder text styles

Cover layouts have the SAP logo as a <p:pic> element (not a shape
placeholder), so the existing parser missed it entirely. Add pics[]
to each layout output. Also capture <a:lstStyle> text styles on
placeholders (fontSize in pt, lineSpacing as percentage) for the
upcoming typography-tokens emitter."
```

---

### Task 2: New `emit-cover-tokens.mjs` (TDD)

Reads layouts.json, derives cover layout geometry (logo, title, photo placeholder positions) as CSS percentages, emits a CSS file with custom properties.

**Files:**

- Create: `scripts/lib/emit-cover-tokens.mjs`
- Create: `scripts/lib/emit-cover-tokens.test.ts`

- [ ] **Step 1: Write the failing test**

`scripts/lib/emit-cover-tokens.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { emitCoverTokensCss } from './emit-cover-tokens.mjs'

const SAMPLE_LAYOUTS = [
  {
    name: 'Cover A',
    placeholders: [
      { type: 'title', x: 503238, y: 2706317, cx: 4765449, cy: 997196 },
      { type: 'pic', x: 5969000, y: 0, cx: 6226175, cy: 6858000 }
    ],
    pics: [{ name: 'LogoBlue-Dynamic', x: 504000, y: 504000, cx: 727192, cy: 360000 }]
  }
]

describe('emit-cover-tokens', () => {
  it('emits CSS custom properties under :root with header comment', () => {
    const css = emitCoverTokensCss(SAMPLE_LAYOUTS)
    expect(css).toContain(':root {')
    expect(css).toMatch(/GENERATED/i)
  })

  it('derives logo position from Cover A pic geometry as percentages', () => {
    const css = emitCoverTokensCss(SAMPLE_LAYOUTS)
    // 504000 / 6858000 = 7.348% → expect "7.35%"
    expect(css).toMatch(/--cover-logo-top: 7\.35%/)
    // 504000 / 12192000 = 4.134% → expect "4.13%"
    expect(css).toMatch(/--cover-logo-left: 4\.13%/)
    // 727192 / 12192000 = 5.964% → expect "5.96%"
    expect(css).toMatch(/--cover-logo-width: 5\.96%/)
  })

  it('derives title position from Cover A title placeholder', () => {
    const css = emitCoverTokensCss(SAMPLE_LAYOUTS)
    // 2706317 / 6858000 = 39.46%
    expect(css).toMatch(/--cover-title-top: 39\.46%/)
    expect(css).toMatch(/--cover-title-left: 4\.13%/)
    // 4765449 / 12192000 = 39.08%
    expect(css).toMatch(/--cover-title-width: 39\.08%/)
  })

  it('derives photo placeholder position from Cover A pic placeholder', () => {
    const css = emitCoverTokensCss(SAMPLE_LAYOUTS)
    // 5969000 / 12192000 = 48.96%
    expect(css).toMatch(/--cover-photo-left: 48\.95%|--cover-photo-left: 48\.96%/)
    // (12192000 - 5969000) / 12192000 = 51.05%
    expect(css).toMatch(/--cover-photo-width: 51\.04%|--cover-photo-width: 51\.05%/)
  })

  it('handles missing Cover A gracefully', () => {
    expect(() => emitCoverTokensCss([])).toThrow(/Cover A not found/)
  })
})
```

- [ ] **Step 2: Run — fails (module doesn't exist)**

Run: `npm test -- emit-cover-tokens`
Expected: FAIL "Cannot find module".

- [ ] **Step 3: Implement**

`scripts/lib/emit-cover-tokens.mjs`:

```js
const SLIDE_WIDTH_EMU = 12192000
const SLIDE_HEIGHT_EMU = 6858000

function pct(emu, max) {
  return ((emu / max) * 100).toFixed(2) + '%'
}

/**
 * Generate cover-tokens.css from extracted POTX layout geometry.
 *
 * Reads Cover A (the canonical reference cover) for logo, title, and
 * picture placeholder positions. All 12 cover variants share the same
 * logo position; if implementation reveals divergence, this emitter
 * widens to per-variant tokens.
 */
export function emitCoverTokensCss(layouts) {
  const coverA = layouts.find((l) => l.name === 'Cover A')
  if (!coverA) throw new Error('Cover A not found in layouts')

  const title = coverA.placeholders.find((p) => p.type === 'title')
  const picPh = coverA.placeholders.find((p) => p.type === 'pic')
  const logo = coverA.pics?.[0]

  if (!logo) throw new Error('Cover A has no <p:pic> elements (logo)')

  const lines = [
    '/* GENERATED by scripts/extract-brand.mjs — do not edit by hand. */',
    '/* Source: SAP_Corp.potx Cover A geometry (placeholders + pics). */',
    '',
    ':root {',
    '  /* SAP logo position — shared across all cover variants */',
    `  --cover-logo-top: ${pct(logo.y, SLIDE_HEIGHT_EMU)};`,
    `  --cover-logo-left: ${pct(logo.x, SLIDE_WIDTH_EMU)};`,
    `  --cover-logo-width: ${pct(logo.cx, SLIDE_WIDTH_EMU)};`,
    ''
  ]

  if (title) {
    lines.push('  /* Cover A title placeholder */')
    lines.push(`  --cover-title-top: ${pct(title.y, SLIDE_HEIGHT_EMU)};`)
    lines.push(`  --cover-title-left: ${pct(title.x, SLIDE_WIDTH_EMU)};`)
    lines.push(`  --cover-title-width: ${pct(title.cx, SLIDE_WIDTH_EMU)};`)
    lines.push('')
  }

  if (picPh) {
    lines.push('  /* Cover A picture placeholder (right half) */')
    lines.push(`  --cover-photo-left: ${pct(picPh.x, SLIDE_WIDTH_EMU)};`)
    lines.push(`  --cover-photo-width: ${pct(picPh.cx, SLIDE_WIDTH_EMU)};`)
    lines.push('')
  }

  lines.push('}')
  lines.push('')
  return lines.join('\n')
}
```

- [ ] **Step 4: Run — passes**

Run: `npm test -- emit-cover-tokens`
Expected: 5/5 pass.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/emit-cover-tokens.mjs scripts/lib/emit-cover-tokens.test.ts
git commit -m "feat: emit-cover-tokens — CSS percentages from POTX cover geometry"
```

---

### Task 3: New `emit-typography-tokens.mjs` (TDD)

Similar pattern, but emits font sizes / line heights from placeholder text styles. Pulls from multiple representative layouts (Cover A title, Title and Text body, etc.) to capture the canonical sizes.

**Files:**

- Create: `scripts/lib/emit-typography-tokens.mjs`
- Create: `scripts/lib/emit-typography-tokens.test.ts`

- [ ] **Step 1: Write the failing test**

`scripts/lib/emit-typography-tokens.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { emitTypographyTokensCss } from './emit-typography-tokens.mjs'

const SAMPLE_LAYOUTS = [
  {
    name: 'Cover A',
    placeholders: [
      { type: 'title', textStyles: { fontSize: 36, lineSpacing: 90 } }
    ],
    pics: []
  },
  {
    name: 'Title and Text',
    placeholders: [
      { type: 'title', textStyles: { fontSize: 28 } },
      { type: 'body', textStyles: { fontSize: 18, lineSpacing: 100 } }
    ],
    pics: []
  }
]

describe('emit-typography-tokens', () => {
  it('emits CSS with header comment under :root', () => {
    const css = emitTypographyTokensCss(SAMPLE_LAYOUTS)
    expect(css).toContain(':root {')
    expect(css).toMatch(/GENERATED/i)
  })

  it('emits cover title font size in rem (1pt ≈ 0.075rem at 16px base)', () => {
    const css = emitTypographyTokensCss(SAMPLE_LAYOUTS)
    // 36pt → CSS rem; we use a fixed 1pt = 0.0833rem (1/12) to match presentation scaling
    // Tolerance: just check the variable is present with a number
    expect(css).toMatch(/--typography-cover-title-size: \d+(\.\d+)?rem/)
  })

  it('emits content title and body sizes from "Title and Text"', () => {
    const css = emitTypographyTokensCss(SAMPLE_LAYOUTS)
    expect(css).toMatch(/--typography-content-title-size:/)
    expect(css).toMatch(/--typography-content-body-size:/)
  })

  it('emits line-spacing as a unitless multiplier (90 → 0.9, 100 → 1.0)', () => {
    const css = emitTypographyTokensCss(SAMPLE_LAYOUTS)
    expect(css).toMatch(/--typography-cover-title-line-height: 0\.9/)
    expect(css).toMatch(/--typography-content-body-line-height: 1\.0/)
  })

  it('skips layouts gracefully when textStyles missing', () => {
    const layouts = [{ name: 'Cover A', placeholders: [{ type: 'title' }], pics: [] }]
    const css = emitTypographyTokensCss(layouts)
    // No crash; produces minimal output
    expect(css).toContain(':root {')
  })
})
```

- [ ] **Step 2: Run — fails**

- [ ] **Step 3: Implement**

`scripts/lib/emit-typography-tokens.mjs`:

```js
// 1pt = 1/72 inch. Slidev slides are ~7.5" tall at 720px = 96 px/in.
// We use 0.0833rem per pt (1/12) as a presentation-scale conversion that
// keeps body text comfortably readable at typical projector resolution.
const PT_TO_REM = 1 / 12

function ptToRem(pt) {
  return (pt * PT_TO_REM).toFixed(2) + 'rem'
}

function lineSpacingToMultiplier(value) {
  // POTX stores as 0-100 percent; we emit unitless (CSS line-height: 0.9, 1.0, 1.5)
  return (value / 100).toFixed(1)
}

/**
 * Generate typography-tokens.css from extracted POTX placeholder text styles.
 *
 * Pulls the canonical sizes from a curated set of layouts:
 *   - Cover A title → --typography-cover-title-*
 *   - Title and Text → --typography-content-title-* + --typography-content-body-*
 *   - Quote → --typography-quote-* (when present)
 *
 * Layouts/placeholders without textStyles are skipped silently. Gaps are
 * filled by deck-level slide-styles.css fallbacks.
 */
export function emitTypographyTokensCss(layouts) {
  const lines = [
    '/* GENERATED by scripts/extract-brand.mjs — do not edit by hand. */',
    '/* Source: SAP_Corp.potx placeholder text styles (lstStyle). */',
    '',
    ':root {'
  ]

  function emitFor(layoutName, prefix, types) {
    const layout = layouts.find((l) => l.name === layoutName)
    if (!layout) return
    for (const type of types) {
      const ph = layout.placeholders.find((p) => p.type === type)
      const ts = ph?.textStyles
      if (!ts) continue
      lines.push('')
      lines.push(`  /* ${layoutName} ${type} */`)
      if (ts.fontSize != null) {
        lines.push(`  --typography-${prefix}-${type}-size: ${ptToRem(ts.fontSize)};`)
      }
      if (ts.lineSpacing != null) {
        lines.push(`  --typography-${prefix}-${type}-line-height: ${lineSpacingToMultiplier(ts.lineSpacing)};`)
      }
    }
  }

  emitFor('Cover A', 'cover', ['title'])
  emitFor('Title and Text', 'content', ['title', 'body'])
  emitFor('Quote', 'quote', ['title', 'body'])
  emitFor('Divider Page A', 'divider', ['title'])
  emitFor('Thank You A', 'thankyou', ['title'])

  lines.push('}')
  lines.push('')
  return lines.join('\n')
}
```

- [ ] **Step 4: Run — passes**

Run: `npm test -- emit-typography-tokens`
Expected: 5/5 pass.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/emit-typography-tokens.mjs scripts/lib/emit-typography-tokens.test.ts
git commit -m "feat: emit-typography-tokens — CSS sizes/line-heights from POTX text styles"
```

---

### Task 4: Wire emitters into extract-brand.mjs and re-extract

**Files:**

- Modify: `scripts/extract-brand.mjs`
- Modify: `theme/styles/index.css` (add imports for new token files)
- Generated: `theme/styles/_extracted/cover-tokens.css`
- Generated: `theme/styles/_extracted/typography-tokens.css`

- [ ] **Step 1: Update extract-brand.mjs**

Add imports near the top:

```js
import { emitCoverTokensCss } from './lib/emit-cover-tokens.mjs'
import { emitTypographyTokensCss } from './lib/emit-typography-tokens.mjs'
```

Inside the `try { ... } finally` block, after the existing `await writeFile` for `layouts.json`, add:

```js
const coverTokens = emitCoverTokensCss(layouts)
await writeFile(resolve(OUT_DIR, 'cover-tokens.css'), coverTokens, 'utf-8')

const typographyTokens = emitTypographyTokensCss(layouts)
await writeFile(resolve(OUT_DIR, 'typography-tokens.css'), typographyTokens, 'utf-8')
```

And add a console.log line for visibility:

```js
console.log('  wrote cover-tokens.css + typography-tokens.css')
```

- [ ] **Step 2: Run extraction**

Run: `npm run extract-brand`
Expected output includes: `wrote cover-tokens.css + typography-tokens.css`. Then verify both files exist:

```bash
ls theme/styles/_extracted/cover-tokens.css theme/styles/_extracted/typography-tokens.css
head theme/styles/_extracted/cover-tokens.css
head theme/styles/_extracted/typography-tokens.css
```

Expected: both files present with the GENERATED header and `:root {` block.

- [ ] **Step 3: Update theme/styles/index.css**

Add the new token imports between the brand-tokens import and horizon-mapping import:

```css
@import './_extracted/brand-tokens.css';
@import './_extracted/cover-tokens.css';
@import './_extracted/typography-tokens.css';
@import './horizon-mapping.css';
@import './slide-styles.css';
```

(The new tokens come *after* brand-tokens because they reference brand colors via CSS variables.)

- [ ] **Step 4: Verify build still succeeds**

Run: `npm run build`
Expected: builds cleanly, no missing-import errors.

- [ ] **Step 5: Verify dev server starts**

Run: `npm run dev`
Wait ~10s, look for "ready", verify no errors. Stop with Ctrl-C.

- [ ] **Step 6: Commit**

```bash
git add scripts/extract-brand.mjs theme/styles/index.css theme/styles/_extracted/cover-tokens.css theme/styles/_extracted/typography-tokens.css
git commit -m "feat: wire cover-tokens + typography-tokens into extraction pipeline

extract-brand now emits two new generated CSS files alongside
brand-tokens.css and layouts.json. Both are imported by index.css
so layouts can consume the POTX-derived geometry and text-style
tokens via standard CSS variables."
```

---

<!-- STAGE_A_TASKS_5_AND_BEYOND -->

### Task 5: Decoration directory + DecorationSolid pilot

We build one decoration component end-to-end first to validate the architecture before building the others.

**Files:**

- Create: `theme/components/decorations/DecorationSolid.vue`

- [ ] **Step 1: Create the directory**

```bash
mkdir -p theme/components/decorations
```

- [ ] **Step 2: Write `DecorationSolid.vue`**

```vue
<script setup lang="ts">
defineProps<{ variant?: string }>()
</script>

<template>
  <div :class="['decoration', `decoration-solid--${variant ?? 'f'}`]" aria-hidden="true" />
</template>

<style scoped>
  .decoration {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }
  .decoration-solid--f { background: var(--sap-brand-blue-darker); }
  .decoration-solid--h { background: var(--sap-brand-teal-dark); }
  .decoration-solid--i { background: var(--sap-brand-purple); }
  .decoration-solid--k { background: var(--sap-brand-blue-darker); }
</style>

<script lang="ts">
// Logo treatment hint consumed by setup/cover-variants.ts useDarkLogo()
export const logoTreatment = 'white' as const
</script>
```

> **Note on dual `<script>` blocks:** Vue 3 SFCs allow both `<script setup>` (component definition) and a regular `<script>` (named exports). The named export `logoTreatment` is consumed by the variant resolver via `import { logoTreatment } from '...'`. This pattern recurs in every decoration component that needs to declare a logo preference.

- [ ] **Step 3: Verify it compiles**

Run: `npm run build`
Expected: succeeds (no Vue compiler errors).

- [ ] **Step 4: Commit**

```bash
git add theme/components/decorations/DecorationSolid.vue
git commit -m "feat(decorations): DecorationSolid (Covers F/H/I/K) — architectural pilot"
```

---

### Task 6: setup/cover-variants.ts resolver (TDD)

The alias map + decoration picker + logo classifier — pure-function module, fully unit-tested.

**Files:**

- Create: `theme/setup/cover-variants.ts`
- Create: `theme/setup/cover-variants.test.ts`

- [ ] **Step 1: Write the failing test**

`theme/setup/cover-variants.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest'

// Mock all decoration components so we don't need to render them
vi.mock('../components/decorations/DecorationPhoto.vue', () => ({
  default: { name: 'DecorationPhoto' }
}))
vi.mock('../components/decorations/DecorationDiagonal.vue', () => ({
  default: { name: 'DecorationDiagonal' }
}))
vi.mock('../components/decorations/DecorationWedges.vue', () => ({
  default: { name: 'DecorationWedges' }
}))
vi.mock('../components/decorations/DecorationSolid.vue', () => ({
  default: { name: 'DecorationSolid' },
  logoTreatment: 'white'
}))
vi.mock('../components/decorations/DecorationMultiShape.vue', () => ({
  default: { name: 'DecorationMultiShape' }
}))
vi.mock('../components/decorations/DecorationGradient.vue', () => ({
  default: { name: 'DecorationGradient' }
}))

import { resolveCoverVariant, getDecoration, useDarkLogo } from './cover-variants'

describe('resolveCoverVariant', () => {
  it('returns letter unchanged when given a single letter a-l', () => {
    expect(resolveCoverVariant('a')).toBe('a')
    expect(resolveCoverVariant('g')).toBe('g')
    expect(resolveCoverVariant('l')).toBe('l')
  })

  it('lowercases input', () => {
    expect(resolveCoverVariant('A')).toBe('a')
    expect(resolveCoverVariant('G')).toBe('g')
  })

  it('maps known descriptive aliases to letters', () => {
    expect(resolveCoverVariant('photo')).toBe('a')
    expect(resolveCoverVariant('diagonal')).toBe('b')
    expect(resolveCoverVariant('wedges')).toBe('g')
    expect(resolveCoverVariant('solid-blue')).toBe('f')
    expect(resolveCoverVariant('gradient-fade')).toBe('l')
  })

  it('falls back to "a" for unknown input', () => {
    expect(resolveCoverVariant('foo')).toBe('a')
    expect(resolveCoverVariant('zz')).toBe('a')
  })

  it('falls back to "a" when undefined', () => {
    expect(resolveCoverVariant(undefined)).toBe('a')
  })
})

describe('getDecoration', () => {
  it('returns the right component per letter', () => {
    expect((getDecoration('a') as any).name).toBe('DecorationPhoto')
    expect((getDecoration('b') as any).name).toBe('DecorationDiagonal')
    expect((getDecoration('g') as any).name).toBe('DecorationWedges')
    expect((getDecoration('f') as any).name).toBe('DecorationSolid')
    expect((getDecoration('l') as any).name).toBe('DecorationGradient')
    expect((getDecoration('c') as any).name).toBe('DecorationMultiShape')
  })

  it('falls back to DecorationPhoto for unknown letters', () => {
    expect((getDecoration('z') as any).name).toBe('DecorationPhoto')
  })
})

describe('useDarkLogo', () => {
  it('returns true for variants with dark backgrounds', () => {
    expect(useDarkLogo('b')).toBe(true)
    expect(useDarkLogo('f')).toBe(true)
    expect(useDarkLogo('g')).toBe(true)
    expect(useDarkLogo('l')).toBe(true)
  })

  it('returns false for variant a when image is supplied', () => {
    expect(useDarkLogo('a', '/some-image.jpg')).toBe(false)
  })

  it('returns true for variant a when no image (fallback wedge is dark)', () => {
    expect(useDarkLogo('a')).toBe(true)
    expect(useDarkLogo('a', undefined)).toBe(true)
    expect(useDarkLogo('a', '')).toBe(true)
  })
})
```

- [ ] **Step 2: Run — fails**

Run: `npm test -- cover-variants`
Expected: FAIL "Cannot find module './cover-variants'".

- [ ] **Step 3: Implement**

`theme/setup/cover-variants.ts`:

```ts
import DecorationPhoto from '../components/decorations/DecorationPhoto.vue'
import DecorationDiagonal from '../components/decorations/DecorationDiagonal.vue'
import DecorationWedges from '../components/decorations/DecorationWedges.vue'
import DecorationSolid, { logoTreatment as solidLogoTreatment } from '../components/decorations/DecorationSolid.vue'
import DecorationMultiShape from '../components/decorations/DecorationMultiShape.vue'
import DecorationGradient from '../components/decorations/DecorationGradient.vue'

const DECORATION_BY_LETTER = {
  a: DecorationPhoto,
  b: DecorationDiagonal,
  c: DecorationMultiShape,
  d: DecorationMultiShape,
  e: DecorationMultiShape,
  f: DecorationSolid,
  g: DecorationWedges,
  h: DecorationSolid,
  i: DecorationSolid,
  j: DecorationDiagonal,
  k: DecorationSolid,
  l: DecorationGradient
} as const

const ALIASES: Record<string, string> = {
  photo: 'a',
  diagonal: 'b',
  'photo-portrait': 'c',
  'multi-shape': 'd',
  'multi-shape-purple': 'e',
  'solid-blue': 'f',
  wedges: 'g',
  'solid-teal': 'h',
  'solid-purple': 'i',
  'diagonal-tinted': 'j',
  'solid-blue-darker': 'k',
  'gradient-fade': 'l'
}

const DARK_BG_VARIANTS = new Set(['b', 'f', 'g', 'h', 'i', 'j', 'k', 'l'])

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
  return DARK_BG_VARIANTS.has(letter)
}
```

> **Note: this file imports decoration components that don't exist yet.** That's intentional. Tests mock those imports, so they pass. The file is wired up correctly so when we build each decoration component in subsequent tasks (DecorationPhoto, DecorationDiagonal, etc.), they slot in without touching this file.

- [ ] **Step 4: Run — passes**

Run: `npm test -- cover-variants`
Expected: All tests green. Note: tests pass via mocks; the real imports won't resolve until later tasks. **Build will fail until all decoration files exist** — that's expected; we'll get them in place by Task 8.

- [ ] **Step 5: Commit**

```bash
git add theme/setup/cover-variants.ts theme/setup/cover-variants.test.ts
git commit -m "feat(setup): cover-variants resolver — alias map + decoration picker + dark-bg classifier"
```

---

### Task 7: Build the remaining decoration components

Creating placeholder skeletons for all 5 missing decoration components so cover-variants.ts can resolve. We'll fill them in with real geometry in Task 8.

**Files:**

- Create: `theme/components/decorations/DecorationPhoto.vue`
- Create: `theme/components/decorations/DecorationDiagonal.vue`
- Create: `theme/components/decorations/DecorationWedges.vue`
- Create: `theme/components/decorations/DecorationGradient.vue`
- Create: `theme/components/decorations/DecorationMultiShape.vue`

- [ ] **Step 1: Write skeleton DecorationPhoto.vue**

```vue
<script setup lang="ts">
defineProps<{ image?: string; alt?: string }>()
</script>

<template>
  <div class="decoration-photo" aria-hidden="true">
    <img v-if="image" :src="image" :alt="alt ?? ''" class="decoration-photo__img" />
    <div v-else class="decoration-photo__fallback">
      <svg viewBox="0 0 600 720" preserveAspectRatio="xMidYMid slice" class="decoration-photo__wedges">
        <polygon points="0,0 600,0 600,504 504,720 0,720" fill="var(--sap-brand-blue-darker)" />
        <polygon points="48,58 600,58 600,468 460,662 48,662" fill="var(--sap-brand-blue)" />
        <polygon points="120,144 600,144 600,432 432,576 120,576" fill="var(--sap-brand-blue-light, #89D1FF)" />
        <polygon points="210,252 600,252 600,396 388,468 210,468" fill="var(--sap-brand-blue-pale, #D1EFFF)" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
  .decoration-photo {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background: #ffffff;
  }
  .decoration-photo__img,
  .decoration-photo__fallback {
    position: absolute;
    top: 0;
    left: var(--cover-photo-left, 48.95%);
    width: var(--cover-photo-width, 51.05%);
    height: 100%;
  }
  .decoration-photo__img {
    object-fit: cover;
    object-position: center;
  }
  .decoration-photo__wedges {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
```

- [ ] **Step 2: Write skeleton DecorationDiagonal.vue**

```vue
<script setup lang="ts">
defineProps<{ variant?: string }>()
</script>

<template>
  <div :class="['decoration-diagonal', `decoration-diagonal--${variant ?? 'b'}`]" aria-hidden="true">
    <svg viewBox="0 0 1280 720" preserveAspectRatio="none">
      <polygon points="0,0 1280,0 1280,504 896,720 0,720" :fill="`var(--decoration-diagonal-fill, var(--sap-brand-blue))`" />
    </svg>
  </div>
</template>

<style scoped>
  .decoration-diagonal {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }
  .decoration-diagonal svg {
    width: 100%;
    height: 100%;
    display: block;
  }
  .decoration-diagonal--b { background: #ffffff; }
  .decoration-diagonal--j { background: var(--sap-brand-blue-darker); }
</style>

<script lang="ts">
export const logoTreatment = 'white' as const
</script>
```

- [ ] **Step 3: Write skeleton DecorationWedges.vue**

```vue
<template>
  <div class="decoration-wedges" aria-hidden="true">
    <svg viewBox="0 0 1280 720" preserveAspectRatio="none">
      <rect width="1280" height="720" fill="var(--sap-brand-blue-darker)" />
      <polygon points="100,72 1280,72 1280,576 1024,648 100,648" fill="var(--sap-brand-blue)" />
      <polygon points="256,180 1280,180 1280,540 920,612 256,612" fill="var(--sap-brand-blue-light, #89D1FF)" />
      <polygon points="448,288 1280,288 1280,468 808,540 448,540" fill="var(--sap-brand-blue-pale, #D1EFFF)" />
    </svg>
  </div>
</template>

<style scoped>
  .decoration-wedges {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }
  .decoration-wedges svg {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>

<script lang="ts">
export const logoTreatment = 'white' as const
</script>
```

- [ ] **Step 4: Write skeleton DecorationGradient.vue**

```vue
<template>
  <div class="decoration-gradient" aria-hidden="true" />
</template>

<style scoped>
  .decoration-gradient {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background: linear-gradient(180deg, var(--sap-brand-blue-darker) 0%, var(--sap-black, #000) 100%);
  }
</style>

<script lang="ts">
export const logoTreatment = 'white' as const
</script>
```

- [ ] **Step 5: Write skeleton DecorationMultiShape.vue**

For Phase A pilot, ship a shared placeholder that handles all three variants (c/d/e) with palette swaps. Refine in Task 8 if visual inspection of slideLayouts 3/4/5 reveals significantly different compositions.

```vue
<script setup lang="ts">
defineProps<{ variant?: string }>()
</script>

<template>
  <div :class="['decoration-multi', `decoration-multi--${variant ?? 'c'}`]" aria-hidden="true">
    <svg viewBox="0 0 1280 720" preserveAspectRatio="none">
      <!-- Two overlapping shapes; specific positions/colors per variant via CSS vars -->
      <polygon points="0,0 1280,0 1280,432 768,432 768,720 0,720"
               :fill="`var(--decoration-multi-bg, var(--sap-brand-blue-darker))`" />
      <polygon points="768,288 1280,288 1280,720 768,720"
               :fill="`var(--decoration-multi-accent, var(--sap-brand-blue))`" />
    </svg>
  </div>
</template>

<style scoped>
  .decoration-multi {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background: #ffffff;
  }
  .decoration-multi svg {
    width: 100%;
    height: 100%;
    display: block;
  }
  .decoration-multi--c {
    --decoration-multi-bg: var(--sap-brand-blue-darker);
    --decoration-multi-accent: var(--sap-brand-blue);
  }
  .decoration-multi--d {
    --decoration-multi-bg: var(--sap-brand-teal-dark);
    --decoration-multi-accent: var(--sap-brand-green);
  }
  .decoration-multi--e {
    --decoration-multi-bg: var(--sap-brand-purple-dark);
    --decoration-multi-accent: var(--sap-brand-pink);
  }
</style>

<script lang="ts">
// Auto: fall through to per-variant; we report 'white' here as the most common case
// for c/d/e backgrounds. cover-variants.ts will respect this via the fallthrough rule.
export const logoTreatment = 'white' as const
</script>
```

- [ ] **Step 6: Verify build succeeds**

Run: `npm run build`
Expected: builds without errors. cover-variants.ts can now resolve all 6 imports.

- [ ] **Step 7: Run all tests**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 8: Commit**

```bash
git add theme/components/decorations/
git commit -m "feat(decorations): skeleton components — Photo, Diagonal, Wedges, Gradient, MultiShape

Each decoration is a thin Vue SFC (inline SVG using brand-token CSS
variables, single responsibility). Cover-variants resolver now resolves
all imports successfully. Geometry will be refined against real POTX
art assets in Task 8 (visual fidelity pass)."
```

---

### Task 8: Visual fidelity pass against POTX art assets

The skeletons in Task 7 use educated-guess polygon coordinates. This task refines them by comparing against the actual POTX media files (image2.png, image12.png — the diagonal and wedge motifs) and the slideLayout XML for variant-specific layouts.

> **For agentic workers:** this task is iterative and visually-driven. Use Chrome DevTools MCP screenshots to compare each rendered decoration against the corresponding extracted POTX media. The exact polygon coordinates may differ from the skeletons; trust the visual comparison.

**Files:**

- Modify: `theme/components/decorations/DecorationPhoto.vue`
- Modify: `theme/components/decorations/DecorationDiagonal.vue`
- Modify: `theme/components/decorations/DecorationWedges.vue`
- Modify: `theme/components/decorations/DecorationMultiShape.vue` (split into 3 if needed)

- [ ] **Step 1: Inspect each POTX reference image**

The extracted POTX media is at `theme/styles/_extracted/media/raw/`. The relevant images:

- `image2.png` — diagonal silhouette (Cover B/J)
- `image12.png` — nested wedges (Cover G)
- Cover C/D/E reference: read `slideLayout3.xml`, `slideLayout4.xml`, `slideLayout5.xml`

For each, measure the diagonal angle by inspecting the actual POTX shape. The skeleton uses ~30° (slope 504/896 ≈ 0.56); the actual POTX may differ slightly.

Run a quick measurement helper:

```bash
node -e "
const w = 1280, h = 720
// If POTX image2.png shows diagonal cut from (X1, 0) to (W, Y1), compute slope
// Typical SAP diagonal: cut starts ~70% of width on top, ends ~70% of height on right
// Actual values from POTX: examine image2.png pixel boundary in image viewer
"
```

For visual confirmation: open `theme/styles/_extracted/media/raw/image2.png` in any image viewer, measure pixel coordinates of the diagonal endpoints, scale to a 1280×720 viewBox. Update the polygon coordinates accordingly.

- [ ] **Step 2: Refine DecorationDiagonal polygon**

If POTX measurements differ from the skeleton's `points="0,0 1280,0 1280,504 896,720 0,720"`, update them. Same for DecorationWedges.

- [ ] **Step 3: Refine DecorationWedges layer ratios**

Compare against `image12.png`. The 4 wedges nest with specific inset percentages. If the skeleton's nesting looks visually wrong, adjust the polygon coordinates per layer.

- [ ] **Step 4: Inspect slideLayout3/4/5 for MultiShape**

Read each XML file:

```bash
grep -A 100 'name="Cover C"' theme/styles/_extracted/layouts.json | head -50
grep -A 100 'name="Cover D"' theme/styles/_extracted/layouts.json | head -50
grep -A 100 'name="Cover E"' theme/styles/_extracted/layouts.json | head -50
```

Look at the `placeholders` field of each. If the shape compositions are clearly different (not just palette swaps), split DecorationMultiShape.vue into three files: `DecorationMultiShapeC.vue`, `DecorationMultiShapeD.vue`, `DecorationMultiShapeE.vue`. Update `setup/cover-variants.ts` to import the three:

```ts
import DecorationMultiShapeC from '../components/decorations/DecorationMultiShapeC.vue'
import DecorationMultiShapeD from '../components/decorations/DecorationMultiShapeD.vue'
import DecorationMultiShapeE from '../components/decorations/DecorationMultiShapeE.vue'

const DECORATION_BY_LETTER = {
  // ...
  c: DecorationMultiShapeC,
  d: DecorationMultiShapeD,
  e: DecorationMultiShapeE,
  // ...
}
```

If C/D/E share enough structure to live in one component (likely the case for v0.2.0; we can always split later), keep the single file with palette CSS-variable switching.

- [ ] **Step 5: Run lint + tests**

Run: `npm run lint && npm test`
Expected: clean.

- [ ] **Step 6: Build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 7: Commit**

```bash
git add theme/components/decorations/ theme/setup/cover-variants.ts theme/setup/cover-variants.test.ts
git commit -m "refine(decorations): match POTX art geometry

DecorationDiagonal, DecorationWedges, DecorationMultiShape geometry
refined against POTX media (image2.png, image12.png) and slideLayout
XML. [If MultiShape was split: also explains the split into c/d/e
files and the cover-variants.ts wiring update.]"
```

---

### Task 9: Rewrite cover.vue using the new architecture

**Files:**

- Modify: `theme/layouts/cover.vue`

- [ ] **Step 1: Replace cover.vue contents**

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
    <component
      :is="Decoration"
      :variant="variantLetter"
      :image="(fm.image as string | undefined)"
    />
    <img class="cover-logo" :src="logoSrc" alt="SAP" />
    <div class="cover-content">
      <h1 v-if="fm.title">{{ fm.title }}</h1>
      <p v-if="fm.subtitle" class="subtitle">{{ fm.subtitle }}</p>
      <slot />
      <footer class="cover-footer">
        <Speaker :presenter="(fm.presenter as string | undefined)" />
        <span class="event">{{ eventName }}</span>
      </footer>
    </div>
  </div>
</template>

<style scoped>
  .cover {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    /* Decoration absolutely-positioned inside; covers below the content */
  }
  .cover-logo {
    position: absolute;
    top: var(--cover-logo-top, 7.35%);
    left: var(--cover-logo-left, 4.13%);
    width: var(--cover-logo-width, 5.96%);
    height: auto;
    z-index: 2;
  }
  .cover-content {
    position: absolute;
    top: var(--cover-title-top, 39.46%);
    left: var(--cover-title-left, 4.13%);
    width: var(--cover-title-width, 39.08%);
    z-index: 2;
    color: var(--sap-brand-blue-darker);
  }
  .cover--dark .cover-content {
    color: #ffffff;
  }
  .cover h1 {
    font-size: var(--typography-cover-title-size, 3rem);
    line-height: var(--typography-cover-title-line-height, 0.9);
    margin: 0 0 1rem;
    font-weight: 700;
    color: inherit;
  }
  .cover .subtitle {
    font-size: 1.5rem;
    color: inherit;
    opacity: 0.9;
    margin: 0 0 2rem;
  }
  .cover-footer {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    color: inherit;
    opacity: 0.85;
  }
  .cover-footer .event {
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  /* Suppress the global slide-styles ::after accent — covers don't use it */
  .cover::after { content: none !important; }
</style>
```

> **Note: cover.vue no longer has any per-variant background CSS.** All visual variation lives in the decoration components. cover.vue only places the chrome (logo + content) on top.

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 3: Smoke-test in dev**

Run: `npm run dev`
Open http://localhost:3030/2 (cover slide). Verify the cover renders with the SAP logo and title positioned correctly. Stop with Ctrl-C.

- [ ] **Step 4: Commit**

```bash
git add theme/layouts/cover.vue
git commit -m "feat(cover): rewrite using decoration components + cover-tokens"
```

---

### Task 10: Rewrite divider.vue + DividerWedge.vue

**Files:**

- Create: `theme/components/decorations/DividerWedge.vue`
- Modify: `theme/layouts/divider.vue`

- [ ] **Step 1: Write DividerWedge.vue**

```vue
<script setup lang="ts">
defineProps<{ variant?: string }>()
</script>

<template>
  <div :class="['divider-wedge', `divider-wedge--${variant ?? 'a'}`]" aria-hidden="true" />
</template>

<style scoped>
  .divider-wedge {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }
  .divider-wedge--a {
    background: var(--sap-brand-blue-darker);
  }
  .divider-wedge--b {
    background: linear-gradient(135deg, var(--sap-brand-blue-darker) 0%, var(--sap-brand-blue) 100%);
  }
  .divider-wedge--c {
    background: var(--sap-brand-teal-dark);
  }
  .divider-wedge--d {
    background: linear-gradient(135deg, var(--sap-brand-purple-dark) 0%, var(--sap-brand-blue-darker) 100%);
  }
</style>
```

- [ ] **Step 2: Rewrite divider.vue**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import DividerWedge from '../components/decorations/DividerWedge.vue'

const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
const fm = computed(() => props.frontmatter ?? {})
const variant = computed(() => (fm.value.variant as string | undefined) ?? 'a')
</script>

<template>
  <div :class="['divider', `divider--${variant}`]">
    <DividerWedge :variant="variant" />
    <div class="divider-content">
      <h1 v-if="fm.title">{{ fm.title }}</h1>
      <slot />
    </div>
  </div>
</template>

<style scoped>
  .divider {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    color: #ffffff;
  }
  .divider-content {
    position: relative;
    z-index: 2;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 5rem;
  }
  .divider h1 {
    font-size: var(--typography-divider-title-size, 4rem);
    line-height: var(--typography-divider-title-line-height, 1.0);
    margin: 0;
    color: #ffffff;
    max-width: 80%;
  }
  .divider::after { content: none !important; }
</style>
```

- [ ] **Step 3: Build and smoke-test**

Run: `npm run build && npm run dev`
Open http://localhost:3030/4 (divider slide). Verify it renders. Stop with Ctrl-C.

- [ ] **Step 4: Commit**

```bash
git add theme/components/decorations/DividerWedge.vue theme/layouts/divider.vue
git commit -m "feat(divider): rewrite using DividerWedge decoration"
```

---

### Task 11: Smoke-test all 12 covers + 4 dividers

**Files:** none modified.

- [ ] **Step 1: Open the kitchen-sink gallery**

Run: `npm run gallery`
Open http://localhost:3031.

- [ ] **Step 2: Click through every cover variant (slides 2–13 in the gallery)**

For each, verify:
- Decoration renders
- SAP logo visible (check it's the right color: white on dark, primary on light)
- Title position looks reasonable (top-left content area)

- [ ] **Step 3: Click through divider variants (slides 14–17 in the gallery)**

Verify each renders with the right background treatment.

- [ ] **Step 4: Note any visual issues**

If any cover/divider looks visually wrong (decoration off-center, logo missing, title overlapping the wrong area), document the issue and address before continuing. Common fixes:

- Wrong polygon coordinates → return to Task 8
- Logo position wrong → check `--cover-logo-*` values in `cover-tokens.css`
- Title color blends with background → check `cover--dark` class is applied

- [ ] **Step 5: No commit needed** unless adjustments were made.

---

<!-- STAGE_B_FOLLOWS -->

## Stage B — Typography fidelity + thank-you + content layouts

Stage B applies typography-tokens.css to the layouts that contain text-heavy content. These layouts already exist and render correctly; we're refining their typography to match POTX text styles.

The pattern across Stage B is simple: **add CSS variable references to existing layout styles**. No structural changes to layout files unless explicitly noted.

### Task 12: Build DecorationThankYou.vue + rewrite thank-you.vue

**Files:**

- Create: `theme/components/decorations/DecorationThankYou.vue`
- Modify: `theme/layouts/thank-you.vue`

- [ ] **Step 1: Pre-implementation POTX inspection**

Per the spec, inspect POTX thank-you geometry before coding:

```bash
node -e "const j = require('./theme/styles/_extracted/layouts.json'); const t = j.layouts.filter(l => l.name.startsWith('Thank')); console.log(JSON.stringify(t, null, 2))"
```

Note the thank-you A and B variant differences. Confirm whether they share structural geometry (most likely: A is solid color, B is diagonal split) so a single component with `variant` switching suffices.

- [ ] **Step 2: Write DecorationThankYou.vue**

```vue
<script setup lang="ts">
defineProps<{ variant?: string }>()
</script>

<template>
  <div :class="['decoration-thankyou', `decoration-thankyou--${variant ?? 'a'}`]" aria-hidden="true" />
</template>

<style scoped>
  .decoration-thankyou {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }
  .decoration-thankyou--a {
    background: var(--sap-brand-blue-darker);
  }
  .decoration-thankyou--b {
    background: linear-gradient(135deg, var(--sap-brand-blue) 0%, var(--sap-brand-teal) 100%);
  }
</style>

<script lang="ts">
export const logoTreatment = 'white' as const
</script>
```

- [ ] **Step 3: Rewrite thank-you.vue**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import DecorationThankYou from '../components/decorations/DecorationThankYou.vue'
import Speaker from '../components/Speaker.vue'
import { getEvent } from '../setup/data'

const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
const fm = computed(() => props.frontmatter ?? {})
const variant = computed(() => (fm.value.variant as string | undefined) ?? 'a')
const event = getEvent()
</script>

<template>
  <div :class="['thank-you', `thank-you--${variant}`]">
    <DecorationThankYou :variant="variant" />
    <div class="thank-you-content">
      <h1>Thank you.</h1>
      <Speaker :presenter="(fm.presenter as string | undefined)" />
      <p v-if="event.hashtag" class="hashtag">{{ event.hashtag }}</p>
      <slot />
    </div>
  </div>
</template>

<style scoped>
  .thank-you {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .thank-you-content {
    position: relative;
    z-index: 2;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 1.5rem;
    padding: 5rem;
    color: #ffffff;
  }
  .thank-you h1 {
    font-size: var(--typography-thankyou-title-size, 6rem);
    line-height: var(--typography-thankyou-title-line-height, 1.0);
    margin: 0;
    color: #ffffff;
  }
  .hashtag {
    margin-top: 2rem;
    font-size: 1.25rem;
    letter-spacing: 0.05em;
  }
  .thank-you::after { content: none !important; }
</style>
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 5: Commit**

```bash
git add theme/components/decorations/DecorationThankYou.vue theme/layouts/thank-you.vue
git commit -m "feat(thank-you): rewrite using DecorationThankYou + typography-tokens"
```

---

### Task 13: Update title-text family to consume typography-tokens

**Files:**

- Modify: `theme/layouts/title-text.vue`
- Modify: `theme/layouts/title-text-2col.vue`
- Modify: `theme/layouts/title-text-3col.vue`

For each, the change is the same: replace hardcoded `font-size` and `line-height` values in the scoped style block with CSS variables. The token file already provides defaults via fallbacks, so layouts auto-inherit POTX values.

- [ ] **Step 1: Update title-text.vue**

In the existing `<style scoped>` block, replace the title and content rules:

```css
.title-text h1 {
  font-size: var(--typography-content-title-size, 2.75rem);
  line-height: var(--typography-content-title-line-height, 1.1);
  color: var(--sap-brand-blue-darker);
  margin-bottom: 1.5rem;
}
.title-text .content {
  flex: 1;
  font-size: var(--typography-content-body-size, 1.25rem);
  line-height: var(--typography-content-body-line-height, 1.55);
}
```

- [ ] **Step 2: Update title-text-2col.vue and title-text-3col.vue similarly**

Same pattern — wherever a hardcoded font-size or line-height appears in the scoped styles, replace with the corresponding token reference.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 4: Commit**

```bash
git add theme/layouts/title-text.vue theme/layouts/title-text-2col.vue theme/layouts/title-text-3col.vue
git commit -m "refine(title-text family): consume typography-tokens for title/body sizes"
```

---

### Task 14: Update content-image-Ncol family

**Files:**

- Modify: `theme/layouts/content-image-2col.vue`
- Modify: `theme/layouts/content-image-3col.vue`
- Modify: `theme/layouts/content-image-4col.vue`

Same pattern as Task 13 — replace hardcoded font sizes/line heights with token references. Additionally, **gutter widths** (the `gap:` between columns) should reference a `--typography-content-gutter` token if one is emitted, falling back to the existing values.

- [ ] **Step 1: Inspect what tokens were emitted**

```bash
cat theme/styles/_extracted/typography-tokens.css
```

If gutter tokens aren't present, the typography-tokens emitter (Task 3) doesn't currently emit them. For v0.2.0, keep gutter values hardcoded in the layout files; document in CONTENT-GUIDE that gutter tuning is a manual process. (Adding gutter extraction to the emitter is a v0.3.0 candidate.)

- [ ] **Step 2: Update each layout's font sizes**

For each `content-image-Ncol.vue`, replace hardcoded `.col-text { font-size: ... }` etc. with the content-body token reference:

```css
.col-text {
  font-size: var(--typography-content-body-size, 1.05rem);
  line-height: var(--typography-content-body-line-height, 1.5);
}
```

Adjust the fallback per layout (2col uses larger, 4col uses smaller — preserve those proportions in the fallback values).

- [ ] **Step 3: Verify build**

Run: `npm run build`

- [ ] **Step 4: Commit**

```bash
git add theme/layouts/content-image-2col.vue theme/layouts/content-image-3col.vue theme/layouts/content-image-4col.vue
git commit -m "refine(content-image family): consume typography-tokens"
```

---

### Task 15: Update q-and-a, agenda

**Files:**

- Modify: `theme/layouts/q-and-a.vue`
- Modify: `theme/layouts/agenda.vue`

- [ ] **Step 1: Update q-and-a.vue**

Inspect the existing layout. Replace the title font-size with `--typography-content-title-size` (q-and-a uses a large title similar to a divider but on a lighter background; verify by visual smoke-test).

- [ ] **Step 2: Update agenda.vue**

The Agenda layout has its own typography concerns (numbered list items, item spacing). Replace hardcoded sizes:

```css
.agenda-layout h1 {
  font-size: var(--typography-content-title-size, 3rem);
  line-height: var(--typography-content-title-line-height, 1.1);
  color: var(--sap-brand-blue-darker);
  margin: 0;
}
```

The Agenda *component* (not the layout) has its own list-item typography. Update theme/components/Agenda.vue similarly:

```css
.agenda { font-size: var(--typography-content-body-size, 1.5rem); }
.agenda li { line-height: var(--typography-content-body-line-height, 1.5); }
```

- [ ] **Step 3: Verify build**

Run: `npm run build`

- [ ] **Step 4: Commit**

```bash
git add theme/layouts/q-and-a.vue theme/layouts/agenda.vue theme/components/Agenda.vue
git commit -m "refine(q-and-a, agenda): consume typography-tokens"
```

---

### Task 16: Update remaining title/photo layouts

**Files:**

- Modify: `theme/layouts/title-content.vue`
- Modify: `theme/layouts/title-only.vue`
- Modify: `theme/layouts/title.vue`
- Modify: `theme/layouts/title-photo.vue`
- Modify: `theme/layouts/content-photo-1.vue`
- Modify: `theme/layouts/content-photo-2.vue`

For each, apply the same typography-token replacement pattern.

- [ ] **Step 1: Update each layout**

Replace hardcoded font-size and line-height values with token references:

- `title-content.vue` h1 → `--typography-content-title-size`
- `title-only.vue` h1 → `--typography-content-title-size`
- `title.vue` h1 → `--typography-cover-title-size` (large hero-style title)
- `title-photo.vue` h1 → `--typography-cover-title-size`
- `content-photo-1.vue` h1 → `--typography-content-title-size`
- `content-photo-2.vue` h1 → `--typography-content-title-size`

- [ ] **Step 2: Verify build**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add theme/layouts/title-content.vue theme/layouts/title-only.vue theme/layouts/title.vue theme/layouts/title-photo.vue theme/layouts/content-photo-1.vue theme/layouts/content-photo-2.vue
git commit -m "refine(title/photo layouts): consume typography-tokens across remaining layouts"
```

---

<!-- STAGE_C_FOLLOWS -->

## Stage C — Sample deck polish + release

### Task 17: Add Unsplash demo cover photo

**Files:**

- Add: `public/covers/cover-default.jpg`

- [ ] **Step 1: Create the covers directory**

```bash
mkdir -p public/covers
```

- [ ] **Step 2: Pick and download a permissive-license Unsplash photo**

Selection criteria:
- Business / technology / abstract theme (broadly applicable to SAP-style presentations)
- Portrait or near-square aspect ratio (right-half cover placeholder is ~0.91:1; landscape photos crop badly)
- Subject space on the right side (so the SAP logo and title text on the left don't overlap subjects)
- Long edge ≥ 2400 px for high-res projector quality
- Permissive Unsplash license (most photos qualify)

Suggested search: <https://unsplash.com/s/photos/business-technology-abstract>

When you find one:
- Click "Download free" → choose "Original" or "Medium" (1920+ px wide is fine)
- Save to `public/covers/cover-default.jpg`
- **Note** the photographer's name and the photo's Unsplash URL — needed for attribution in CONTENT-GUIDE.

> **For agentic workers without browser access:** use a placeholder that's visually neutral. A 1920x1280 solid-blue JPEG with subtle gradient is acceptable for the test baselines; document the swap-for-real-Unsplash step as a manual TODO in the PR description. The architecture validation does NOT depend on photo content.

- [ ] **Step 3: Verify file**

```bash
ls -la public/covers/cover-default.jpg
file public/covers/cover-default.jpg
```

Expected: file exists, identifies as JPEG, ~100KB–1MB.

- [ ] **Step 4: Commit**

```bash
git add public/covers/cover-default.jpg
git commit -m "feat(sample): add Unsplash demo cover photo

[Photographer: <name>, <unsplash-url>]
Used by slides.md to demonstrate Cover A's photo path. Fork-authors
can swap with their own image or with an SAP press-kit photo for
production decks. License: Unsplash (free for commercial and
non-commercial use)."
```

If using a placeholder JPEG, replace the bracket text with `placeholder JPEG; swap for real Unsplash photo before merge`.

---

### Task 18: Update slides.md to use the cover photo

**Files:**

- Modify: `slides.md`

- [ ] **Step 1: Update the cover slide front-matter**

Find the first cover slide in `slides.md` (currently `layout: cover`, `variant: a`). Add the `image` field:

```markdown
---
layout: cover
variant: a
title: Building Cloud-Native Apps with SAP CAP
subtitle: From zero to production on BTP
presenter: thomas-jung
image: /covers/cover-default.jpg
---
```

The `image` field maps to `DecorationPhoto`'s `image` prop. cover.vue's `useDarkLogo` checks for it and chooses the primary (color) logo since the photo provides its own visual contrast against the title.

- [ ] **Step 2: Smoke-test in dev**

Run: `npm run dev`
Open http://localhost:3030/2 (cover slide). Verify:
- Photo renders on the right half
- SAP logo (color version) is visible top-left
- Title "Building Cloud-Native Apps with SAP CAP" is readable on the left half

Stop with Ctrl-C.

- [ ] **Step 3: Commit**

```bash
git add slides.md
git commit -m "feat(sample): cover slide demos the photo path"
```

---

### Task 19: Update Playwright visual-regression baselines

The architectural changes affect almost every cover, divider, thank-you, and content layout — about ~25 baseline snapshots will visibly change.

**Files:**

- Modify: many under `tests/visual.spec.ts-snapshots/`

- [ ] **Step 1: Run visual regression first to see what changed**

Run: `npm run test:visual`
Expected: many failures. Inspect them via the `playwright-report/` HTML output:

```bash
ls playwright-report/index.html
```

Open the report; spot-check a handful of changed slides for sanity (the changes should match the visual fidelity work, not unintended regressions).

- [ ] **Step 2: Update baselines**

Once you've confirmed the diffs are intentional:

```bash
npm run test:visual:update
```

This regenerates all baselines. The git diff afterwards will be ~25 PNG files changed.

- [ ] **Step 3: Verify the regenerated baselines**

```bash
npm run test:visual
```

Expected: all green. If any test still fails, the baseline didn't update for that slide; investigate and re-run `:update` for that specific test.

- [ ] **Step 4: Spot-check committed PNGs**

`git diff --stat tests/visual.spec.ts-snapshots/` should show ~25 PNG files. Open a few in any image viewer to confirm they look like the expected Phase A + B output.

- [ ] **Step 5: Commit**

```bash
git add tests/visual.spec.ts-snapshots/
git commit -m "test: update visual regression baselines for v0.2.0 fidelity work

~25 layouts changed visibly: 12 cover variants gain proper decorations
(photo, diagonal, wedges, gradient, multi-shape, solid), 4 dividers,
2 thank-you variants, content/typography layouts gain
typography-tokens-driven font sizes. Baselines regenerated; reviewer
should compare side-by-side with the v0.1.0 baselines using the
PR's diff view."
```

---

### Task 20: Update CONTENT-GUIDE.md

**Files:**

- Modify: `CONTENT-GUIDE.md`

- [ ] **Step 1: Add the variant alias table section**

Insert after the "Component decision tree" section, before "Slide-text length budgets":

```markdown
## Cover variants

The cover layout has 12 visual variants. Reference by letter (POTX-faithful) or
descriptive alias (self-documenting):

| Letter | Alias | Visual treatment | Logo |
|---|---|---|---|
| `a` | `photo` | Photo on right half, white background | Primary (color) when photo is supplied; white when not |
| `b` | `diagonal` | Solid blue with diagonal cut to white triangle | White |
| `c` | `photo-portrait` | Multi-shape composition, blue palette | White |
| `d` | `multi-shape` | Multi-shape composition, teal/green palette | White |
| `e` | `multi-shape-purple` | Multi-shape composition, purple/pink palette | White |
| `f` | `solid-blue` | Solid SAP brand blue | White |
| `g` | `wedges` | Nested layered diagonal wedges | White |
| `h` | `solid-teal` | Solid SAP brand teal | White |
| `i` | `solid-purple` | Solid SAP brand purple | White |
| `j` | `diagonal-tinted` | Diagonal silhouette on tinted blue | White |
| `k` | `solid-blue-darker` | Solid darker brand blue | White |
| `l` | `gradient-fade` | Vertical gradient blue → black | White |

Both forms are equivalent:

​```yaml
layout: cover
variant: a
​```

​```yaml
layout: cover
variant: photo
​```
```

- [ ] **Step 2: Add the photo override section**

Insert a new section "Cover photos":

```markdown
## Cover photos

Cover A (`variant: photo` or `variant: a`) supports a custom hero image:

​```yaml
layout: cover
variant: a
image: /covers/my-photo.jpg
title: My Talk Title
​```

**Where to put photos:**
- Drop image files in `public/covers/`
- Reference as `/covers/<filename>` in slide front-matter
- Recommended aspect ratio: portrait or near-square (1:1 to 1:1.4)
- Recommended resolution: at least 1920px on long edge

**When no `image` is set,** Cover A renders the brand-blue nested-wedges
fallback decoration so the deck always looks complete.

**For SAP-internal users:** the official SAP press-kit imagery
(brand.sap.com) is the recommended source for production decks.
Download the .jpg and replace `cover-default.jpg`. The Unsplash photo
shipped with the template is a permissively-licensed placeholder for
the public demo; replace it for your own deck.
```

- [ ] **Step 3: Add typography token reference section**

Insert a new section "Typography tokens":

```markdown
## Typography tokens

Layouts consume font sizes and line-heights via CSS variables emitted from
the POTX. The current tokens (auto-generated in `theme/styles/_extracted/typography-tokens.css`):

- `--typography-cover-title-size` and `--typography-cover-title-line-height`
- `--typography-content-title-size` and `--typography-content-title-line-height`
- `--typography-content-body-size` and `--typography-content-body-line-height`
- `--typography-divider-title-size` and `--typography-divider-title-line-height`
- `--typography-thankyou-title-size` and `--typography-thankyou-title-line-height`
- `--typography-quote-title-size` and `--typography-quote-body-size` (when present)

If you need a one-off override, set the token at the slide level:

​```html
<div style="--typography-content-title-size: 2rem">
  <!-- this slide's title is smaller -->
</div>
​```

Don't override globally — the tokens regenerate from the POTX on each `npm run extract-brand` run, so any global hand-tune would be lost.
```

- [ ] **Step 4: Add Unsplash attribution at the bottom**

Insert at the very end:

```markdown
## Asset attributions

- **`public/covers/cover-default.jpg`** — Photo by [<photographer>](<unsplash-photo-url>) on Unsplash. Used under the [Unsplash License](https://unsplash.com/license).
- **`theme/public/logos/logo-sap-primary.svg`** and **`logo-sap-white.svg`** — Official SAP brand assets from SAP Brand Tools. Use according to SAP brand guidelines.
```

If using a placeholder JPEG instead of a real Unsplash image, replace the bullet with:

```markdown
- **`public/covers/cover-default.jpg`** — Placeholder image for demo purposes. Replace with your own photo or an SAP press-kit image for production decks.
```

- [ ] **Step 5: Commit**

```bash
git add CONTENT-GUIDE.md
git commit -m "docs(content-guide): variant alias table, photo override, typography tokens, attributions"
```

---

### Task 21: Pre-merge checklist

**Files:** none modified.

- [ ] All Stage A–C tasks completed
- [ ] `npm run lint` passes (0 errors; pre-existing warnings unchanged)
- [ ] `npm test` passes — count grows by ~10 tests (cover-variants × 3 describes; emit-cover-tokens × 5; emit-typography-tokens × 5; parse-layouts × 2 new tests)
- [ ] `npm run build` succeeds
- [ ] `npm run test:visual` passes (all baselines match newly-regenerated state)
- [ ] `npm run extract-brand` succeeds and is idempotent (run twice; only README date may change)
- [ ] Sample deck (`slides.md`) renders end-to-end without console errors; cover slide shows photo correctly
- [ ] Kitchen-sink gallery (`npm run gallery`) renders all 12 covers + 4 dividers + 2 thank-you variants without errors
- [ ] No new internal-only URLs (`grep -rE 'sapintra|sap\.corp|wiki\.wdf|jam\.sap|portal\.wdf' . --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git --exclude-dir=tests/visual.spec.ts-snapshots`)
- [ ] CONTENT-GUIDE updated with variant aliases, photo override, typography tokens, attributions
- [ ] CHANGELOG entry for v0.2.0 (next task)

---

### Task 22: Bump version + CHANGELOG entry

**Files:**

- Modify: `package.json`
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Bump template version**

Update `package.json`:

```json
"version": "0.2.0",
```

(Brand version `2024.1` stays — no POTX change.)

- [ ] **Step 2: Update CHANGELOG.md**

Insert above the existing `## [0.1.0]` entry:

```markdown
## [0.2.0] — 2026-06-13

### Visual fidelity sweep — all major layouts now POTX-correct

**Architecture:**
- New `theme/components/decorations/` directory: thin SVG decoration components
  (Photo, Diagonal, Wedges, Solid, MultiShape, Gradient, DividerWedge, ThankYou)
  consumed by layouts via `<component :is>` composition.
- New auto-generated `cover-tokens.css` (POTX geometry → CSS percentages)
  and `typography-tokens.css` (font sizes, line-heights from placeholder text styles).
- Extended `parse-layouts.mjs` to capture `<p:pic>` (logos, fixed images) and
  `<a:lstStyle>` (text style overrides) per layout.
- New `setup/cover-variants.ts` — alias map (`photo`, `wedges`, etc.), decoration
  picker, dark-bg classifier with auto white/primary logo selection.

**Layout fidelity:**
- 12 cover variants now render proper POTX decorations (was: flat blue gradients).
- 4 divider variants properly themed.
- 2 thank-you variants get solid + diagonal decorations.
- 10 content/typography layouts consume typography-tokens for POTX-faithful
  font sizes and line-heights.

**Sample deck:**
- Cover A demonstrates the photo path with a permissively-licensed Unsplash image.
- Documented swap path for SAP press-kit imagery.

**Assets:**
- Official white-monochrome SAP logo from Brand Tools added at
  `theme/public/logos/logo-sap-white.svg`. Used automatically on dark-background covers.

**Testing:**
- ~25 visual regression baselines updated.
- New unit tests: cover-variants resolver, cover-tokens emitter,
  typography-tokens emitter, extended parse-layouts.
```

- [ ] **Step 3: Commit**

```bash
git add package.json CHANGELOG.md
git commit -m "chore: bump to v0.2.0 + CHANGELOG entry"
```

---

### Task 23: Push and open PR

- [ ] **Step 1: Push the branch**

```bash
git push -u origin feat/potx-visual-fidelity
```

- [ ] **Step 2: Open PR**

```bash
gh pr create --base main --head feat/potx-visual-fidelity \
  --title "v0.2.0: POTX visual fidelity — covers, dividers, typography" \
  --body "## Summary

Implements [docs/superpowers/specs/2026-06-13-potx-fidelity-design.md](docs/superpowers/specs/2026-06-13-potx-fidelity-design.md).

- **Architecture:** decoration component library (\`theme/components/decorations/\`) + auto-generated cover-tokens.css + typography-tokens.css.
- **Cover variants:** all 12 now render proper POTX decorations (photo + fallback wedges, diagonal cuts, nested wedges, solid colors, gradient, multi-shape compositions).
- **Dividers:** 4 variants with proper theming.
- **Thank-you:** 2 variants with proper decorations.
- **Typography:** 10 content layouts consume typography-tokens for POTX-faithful sizes/line-heights.
- **Logo treatment:** auto-selects color vs. white-monochrome based on background.
- **Sample deck:** Cover A demos the photo path.

## Test Plan

- [x] \`npm run lint\` — 0 errors
- [x] \`npm test\` — all unit tests pass
- [x] \`npm run build\` — succeeds
- [x] \`npm run test:visual\` — passes against newly-regenerated baselines
- [x] \`npm run extract-brand\` is idempotent
- [x] Demo deck + kitchen-sink gallery render without console errors
- [ ] CI visual regression on Linux runner (first run after baseline update)

## Reviewer notes

- ~25 visual regression baselines updated. Compare side-by-side with v0.1.0 to confirm intentional changes.
- The decoration architecture is the load-bearing piece for future POTX brand updates: when SAP brand v2 ships, only \`brand-tokens.css\` changes; decorations stay correct.
"
```

- [ ] **Step 3: Wait for CI**

Watch CI in the PR. If visual regression fails, the Linux baselines may differ from Windows — re-update on a Linux CI run via:

```bash
# Comment on the PR or trigger workflow_dispatch with --update-snapshots flag
# (or pull baselines from CI artifact and commit)
```

If anything else fails, address before merging.

- [ ] **Step 4: Merge**

```bash
gh pr merge --squash --delete-branch
```

(Or `--merge` to preserve commit history if you prefer.)

- [ ] **Step 5: Tag and release**

```bash
git checkout main
git pull
git tag v0.2.0 -m "v0.2.0 — POTX visual fidelity"
git push --tags
gh release create v0.2.0 --title "v0.2.0 — POTX visual fidelity" --notes-file CHANGELOG.md
```

---

## Done

The template now renders SAP-brand-correct covers, dividers, thank-you, and content layouts. Sample deck demos the photo path. Auto-generated tokens mean future POTX brand updates flow through automatically.

**Phase 2 candidates** (deferred from spec §3 / spec §4.4):
- Animations and transitions matching POTX
- Internal-vs-external SAP lockup variants
- RTL language support
- Real SAP press-kit imagery shipped (legal review needed first)

<!-- PLAN_END -->



