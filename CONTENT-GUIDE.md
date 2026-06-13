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
