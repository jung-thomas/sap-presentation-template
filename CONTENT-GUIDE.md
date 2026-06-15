# Content Guide

Authoring conventions for the SAP Presentation Template.

> **No internal-only URLs.** Every link in this template — README, this guide, code comments, component output — must work for external community speakers. If you have access to internal SAP brand resources, use them yourself; don't link to them from the template.

---

## Layout selection

Choose the layout that matches what you're communicating, not the one that fits your content volume.

| Situation                                   | Layout               |
| ------------------------------------------- | -------------------- |
| Opening slide, session title                | `cover`              |
| Section break / topic transition            | `divider`            |
| Concept with a few sentences of explanation | `title-text`         |
| Concept with two columns of text            | `title-text-2col`    |
| Three comparison points (text)              | `title-text-3col`    |
| Title with a bulleted list                  | `title-content`      |
| Title with a large image on the right (1/3) | `title-image-third`  |
| Title with a photo or avatar (right side)   | `title-photo`        |
| 1-up content with a screenshot or diagram   | `content-photo-1`    |
| 2-up content + screenshot                   | `content-photo-2`    |
| 2-column content (no images)                | `two-content`        |
| Image with a caption                        | `content-1`          |
| 2-column image grid                         | `content-image-2col` |
| 3-column image grid                         | `content-image-3col` |
| 4-column image grid                         | `content-image-4col` |
| Full-viewport image (no text overlay)       | `full-bleed-image`   |
| Screenshot + code block side-by-side        | `text-screenshot`    |
| A single impactful quote                    | `quote`              |
| Numbered tips or tricks list                | `tips-tricks`        |
| Brand/product site embed                    | `brand-site`         |
| Static image from imported PPTX             | `image-slide`        |
| Agenda overview                             | `agenda`             |
| Q&A / discussion prompt                     | `q-and-a`            |
| Closing / thank-you                         | `thank-you`          |
| Title only, no body                         | `title-only`         |
| No chrome (free-form)                       | `blank`              |
| Color swatch reference (internal)           | `color-palette`      |

---

## Component decision tree

Use components to add structured, on-brand elements inside any layout.

| Situation                                       | Component              |
| ----------------------------------------------- | ---------------------- |
| Introduce a speaker or author                   | `<Bio>`                |
| Inline speaker card (name + title + photo)      | `<Speaker>`            |
| Multiple speakers or team roster                | `<Team>`               |
| SAP Developer Advocates group                   | `<DeveloperAdvocates>` |
| Session agenda with step icons                  | `<Agenda>`             |
| Conference / event branding badge               | `<EventBadge>`         |
| Legal disclaimer (safe harbor, forward-looking) | `<Disclaimer>`         |
| Product/release roadmap with timeline           | `<Roadmap>`            |
| Scannable QR code linking to a resource         | `<QRCode>`             |
| Social platform icon (link or decorative)       | `<SocialIcon>`         |
| SAP logo (official, themed, role-based)         | `<Logo>`               |
| Highlighted demo callout banner                 | `<DemoCallout>`        |
| Syntax-highlighted code with optional output    | `<CodeBlock>`          |
| Key insight or closing message                  | `<KeyTakeaway>`        |

---

## Cover layout

Use the cover layout for the opening slide of a deck (and the divider slide of major sections, as a stylistic match).

### Variants (v0.4.0 ships `a`, `k`, `l`; `b`–`j` arrive in v0.4.1)

- **`variant: a`** — white left, dark navy right with anvil-grid pattern. No photo. Use when you want the title to dominate.
- **`variant: k`** — blue left, photo right with anvil-grid overlay. Requires `image:` front-matter. Use when the speaker / topic visual is central.
- **`variant: l`** — white left, light blue right with single Flat Anvil shape behind a photo. Requires `image:`. Use for keynote or product-launch covers.

### Front-matter

```yaml
---
layout: cover
variant: a            # 'a' | 'k' | 'l'
title: Your Title Here
presenter: <slug>     # resolves to Name from presenters/<slug>.yaml
event: SAP TechEd 2026     # optional; falls back to event.yaml
date: 2026-09-15           # optional; defaults to today
image: /covers/photo.png   # required for variants k and l, ignored for a
partnerLogo: /covers/partner.png   # optional partner-co-branding logo
                                    # omit for dashed placeholder; use null to hide
classification: PUBLIC
---
```

### Title length

The L-half title region is roughly 770 × 180 px on a 1280 × 720 slide. Two lines of 72-Bold fit ~5–7 words per line, so a soft cap of 14 words keeps titles readable without truncation. Longer titles will line-clamp.

### Partner logo

Three states for `partnerLogo:`:

- **Omitted** → dashed-border placeholder showing "Add partner logo and alt text" (matches POTX wording)
- **String** (path to image) → renders that image
- **`null`** → renders nothing (no placeholder)

### Migration from v0.3

If you have a v0.3 deck using `variant: b`–`j`, you have two options:

1. Change `variant:` to `a`, `k`, or `l` (the three v0.4.0 variants). Build will succeed.
2. Wait for v0.4.1 — the remaining variants will be ported.

Using `variant: b`–`j` in v0.4.0 throws a build error pointing at `docs/superpowers/audit/2026-06-14-v0.4-findings.md` for the v0.4.1 backlog.

---

## Cover photos

Cover A (`variant: photo` or `variant: a`) supports a custom hero image:

```yaml
layout: cover
variant: a
image: /covers/my-photo.jpg
title: My Talk Title
```

**Where to put photos:**

- Drop image files in `public/covers/`
- Reference as `/covers/<filename>` in slide front-matter
- Recommended aspect ratio: portrait or near-square (1:1 to 1:1.4)
- Recommended resolution: at least 1920px on long edge
- Subjects should be on the right side (the title sits on the left half)

**When no `image` is set,** Cover A renders the brand-blue nested-wedges
fallback decoration so the deck always looks complete.

**For SAP-internal users:** the official SAP press-kit imagery
([brand.sap.com](https://brand.sap.com)) is the recommended source for
production decks. Download the .jpg and replace `cover-default.jpg`. The
Unsplash photo shipped with the template is a permissively-licensed
placeholder for the public demo; replace it for your own deck.

---

## Slide-text length budgets

Keep slides sparse. These are maximums, not targets.

| Layout            | Title     | Subtitle / tagline    | Body / bullets                   |
| ----------------- | --------- | --------------------- | -------------------------------- |
| `cover`           | ~60 chars | ~80 chars             | —                                |
| `divider`         | ~50 chars | ~80 chars             | —                                |
| `title-text`      | ~60 chars | —                     | ~400 chars (~3 short paragraphs) |
| `title-content`   | ~60 chars | —                     | 4–6 bullets, ~60 chars each      |
| `title-text-2col` | ~60 chars | —                     | ~200 chars per column            |
| `title-text-3col` | ~60 chars | —                     | ~120 chars per column            |
| `quote`           | —         | attribution ~60 chars | 1 sentence, ~120 chars           |
| `tips-tricks`     | ~60 chars | —                     | 3–5 tips, ~80 chars each         |
| `agenda`          | ~60 chars | —                     | 4–7 items (driven by `<Agenda>`) |
| `q-and-a`         | ~40 chars | optional ~80 chars    | —                                |
| `thank-you`       | ~60 chars | ~100 chars            | optional ~200 chars              |

If your content exceeds these budgets, split into two slides or use a `full-bleed-image` layout with minimal text.

---

## Image guidance

### Resolution and format

| Use                            | Format            | Minimum size   |
| ------------------------------ | ----------------- | -------------- |
| Diagrams, icons, logos         | SVG (preferred)   | —              |
| Screenshots, photos            | PNG               | 1920 × 1080 px |
| Photos where file size matters | JPEG (90 quality) | 1920 × 1080 px |

- **Never stretch** images below native resolution — Slidev renders at 1920×1080; anything smaller will appear blurry on external displays.
- **Prefer SVG** for all diagrams and line art — they scale perfectly and are smaller.
- **Avoid GIF** in presentation output; use short MP4 or a static frame.

### Paths

- Place your own images in `public/` (e.g., `public/my-diagram.png` → reference as `/my-diagram.png`).
- Imported PPTX frames land in `public/imported/<event-name>/` — reference as `/imported/<event-name>/slide-NN.png`.
- Theme-provided logos are in `theme/public/logos/` — always access them via the `<Logo>` component, not with raw paths.

---

## SAP brand voice — curated public links

These resources are publicly accessible to any community speaker.

| Resource                      | URL                                          | Purpose                                  |
| ----------------------------- | -------------------------------------------- | ---------------------------------------- |
| SAP Brand                     | https://www.sap.com/about/company/brand.html | Logo usage, color palette, typography    |
| SAP Experience (Fiori Design) | https://experience.sap.com                   | UX patterns, design language             |
| SAP Newsroom                  | https://news.sap.com                         | Current SAP messaging and press releases |
| SAP Help Portal               | https://help.sap.com                         | Product documentation and terminology    |

**Forward-looking statements:** before using `<Disclaimer kind="forward-looking" />` in any binding context (customer meetings, recorded webcasts, investor events), verify the exact wording against the latest SAP investor relations guidance. The template's default text is illustrative. SAP investor relations: https://www.sap.com/investors.html

---

## Typography tokens

Layouts consume font sizes and line-heights via CSS variables emitted
from the POTX. The current tokens (auto-generated in
`theme/styles/_extracted/typography-tokens.css`):

- `--typography-cover-title-size` and `--typography-cover-title-line-height`
- `--typography-content-title-size` and `--typography-content-title-line-height`
- `--typography-content-body-size` and `--typography-content-body-line-height`
- `--typography-divider-title-size` and `--typography-divider-title-line-height`
- `--typography-thankyou-title-size` and `--typography-thankyou-title-line-height`
- `--typography-quote-title-size` and `--typography-quote-body-size` (when present)

If you need a one-off override, set the token at the slide level:

```html
<div style="--typography-content-title-size: 2rem">
  <!-- this slide's title is smaller -->
</div>
```

Don't override globally — the tokens regenerate from the POTX on each
`npm run extract-brand` run, so any global hand-tune would be lost.

**Note:** if a layout's token is absent in `typography-tokens.css` (the
POTX may not have `lstStyle` data for every placeholder), the layout
falls back to its hardcoded CSS default value.

---

## Quality patterns

These patterns keep slides effective and on-brand.

- **One thought per slide.** If you're explaining two things, use two slides.
- **Show, then tell.** Lead with the visual or demo result; explain after.
- **Compose, don't customize.** Use the provided layouts and components — resist restyling individual slides.
- **Short code blocks.** Show the 5–10 lines that matter; link to a full repo for the rest. Use `<CodeBlock>` for syntax highlighting.
- **Demos fail loudly.** If a slide depends on a live demo, include a fallback screenshot (use `content-photo-1` layout with the screenshot).
- **Alt text.** Fill in `alt:` on all `<img>` and layout image props for accessibility.

---

## Anti-patterns

Avoid these patterns — they break the brand or make maintenance harder.

| Anti-pattern                                                      | Why it matters                                                                                         | Fix                                             |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| Overriding component colors with inline `style=`                  | Breaks automatic dark-mode and future brand updates                                                    | Use the CSS variable (`--sap-*`) or theme class |
| Bypassing `<Logo>` with a hardcoded `<img src="...">`             | Logo paths change when brand assets update                                                             | Always use `<Logo role="...">`                  |
| Long-form text in `<KeyTakeaway>`                                 | Designed for a single sentence; overflow hides on small screens                                        | One sentence maximum; split if needed           |
| Hardcoding hex or RGB colors                                      | Breaks theming                                                                                         | Use `var(--sap-color-*)` CSS variables          |
| Reusing the same slug across `presenters/`, `teams/`, `programs/` | YAML data loader merges by slug — collisions corrupt data                                              | Slugs must be unique within each namespace      |
| Committing `dist/`                                                | GitHub Actions builds `dist/` from source; committing it causes merge conflicts and inflates repo size | `dist/` is in `.gitignore` — keep it there      |
| Images in `theme/public/`                                         | The theme package is versioned separately; putting your assets there couples them to theme updates     | Use root `public/` for your content             |

---

## Updating the brand (7-step flow)

When SAP releases an updated `SAP_Corp.potx`:

1. Download the new POTX from the official SAP Brand portal (https://www.sap.com/about/company/brand.html).
2. Replace `SAP_Corp.potx` in the repo root.
3. Run `npm run extract-brand` — this overwrites `theme/styles/_extracted/` and `theme/public/`.
4. Review the git diff in `theme/styles/_extracted/` — this is the authoritative change log for brand token changes.
5. If any logo files were renamed or removed, update `theme/public/logos/manifest.yaml` accordingly.
6. Run `npm run test:visual` — Playwright will flag any layout regressions against the committed baselines.
7. If the snapshots look correct, update baselines with `npm run test:visual:update`, then commit:

```bash
git add -A && git commit -m "chore: bump brand to <version>"
```

If the visual diff reveals unintended regressions (e.g., a spacing token changed), fix the affected layout before updating baselines.

---

## Asset attributions

- **`public/covers/cover-default.jpg`** — Photo by [Marvin Meyer](https://unsplash.com/@marvelous) on [Unsplash](https://unsplash.com/photos/SYTO3xs06fU). Used under the [Unsplash License](https://unsplash.com/license).
- **`public/logos/logo-sap-primary.svg`** and **`logo-sap-white.svg`** — Official SAP brand assets from SAP Brand Tools. Use according to SAP brand guidelines.
