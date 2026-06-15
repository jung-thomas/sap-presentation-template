---
theme: ./theme
title: 'Kitchen-Sink Gallery — All Layouts & Components'
info: |
  Visual regression reference deck.
  One slide per layout variant + one slide per component.
  Consumed by Phase 13 Playwright snapshots.
---

<script setup>
const roadmapPhases = [
  {
    label: 'Q1 2026',
    status: 'available',
    items: ['Feature A', 'Feature B', 'Feature C'],
  },
  {
    label: 'Q2 2026',
    status: 'in-development',
    items: ['Feature D', 'Feature E'],
  },
  {
    label: 'Q3 2026',
    status: 'planned',
    items: ['Feature F', 'Feature G', 'Feature H'],
  },
  {
    label: 'Q4 2026',
    status: 'planned',
    items: ['Feature I'],
  },
]
</script>

---

layout: cover
title: "Cover A"
subtitle: "Subtitle text"
variant: a
presenter: thomas-jung

---

---

layout: title-only
title: "Cover B (v0.4.1)"

---

Variant `b` ships in v0.4.1.

---

layout: title-only
title: "Cover C (v0.4.1)"

---

Variant `c` ships in v0.4.1.

---

layout: title-only
title: "Cover D (v0.4.1)"

---

Variant `d` ships in v0.4.1.

---

layout: title-only
title: "Cover E (v0.4.1)"

---

Variant `e` ships in v0.4.1.

---

layout: title-only
title: "Cover F (v0.4.1)"

---

Variant `f` ships in v0.4.1.

---

layout: title-only
title: "Cover G (v0.4.1)"

---

Variant `g` ships in v0.4.1.

---

layout: title-only
title: "Cover H (v0.4.1)"

---

Variant `h` ships in v0.4.1.

---

layout: title-only
title: "Cover I (v0.4.1)"

---

Variant `i` ships in v0.4.1.

---

layout: title-only
title: "Cover J (v0.4.1)"

---

Variant `j` ships in v0.4.1.

---

layout: cover
title: "Cover K"
subtitle: "Subtitle text"
variant: k
image: /sap/covers/cover-1.png
presenter: thomas-jung

---

---

layout: cover
title: "Cover L"
subtitle: "Subtitle text"
variant: l
image: /sap/covers/cover-2.png
presenter: thomas-jung

---

---

layout: divider
title: "Divider A"
variant: a

---

---

layout: divider
title: "Divider B"
variant: b

---

---

layout: divider
title: "Divider C"
variant: c

---

---

layout: divider
title: "Divider D"
variant: d

---

---

layout: agenda
title: "Agenda Layout"
items:

- title: Introduction
  description: Welcome and overview of today's session
- title: Architecture overview
  description: Explore the system design and key components
- title: Live demo
  description: See the platform in action with real-world scenarios
- title: Q & A
  description: Questions and answers with the team
current: 2

---

---

layout: title-text
title: "Title + Text Layout"

---

Body text goes here. This layout is for slides with a heading and flowing prose or bullet points beneath it.

- Bullet one
- Bullet two
- Bullet three

---

layout: title-text-2col
title: "Title + 2-Column Text"

---

::left::

Left column content. Use this for comparisons, before/after, pros/cons.

- Item A
- Item B

::right::

Right column content. Keeps both sides balanced at a glance.

- Item C
- Item D

---

layout: title-text-3col
title: "Title + 3-Column Text"

---

::col1::

Column 1

Short text or icon + label pattern.

::col2::

Column 2

Short text or icon + label pattern.

::col3::

Column 3

Short text or icon + label pattern.

---

layout: title-content
title: "Title + Content Layout"

---

Use this layout for code, components, images, or rich content below a heading.

```sql
SELECT * FROM Books WHERE stock > 0
```

---

layout: title-only
title: "Title Only Layout"

---

---

layout: title
title: "Title Layout (POTX Title Slide)"

---

Subtitle or brief description goes here.

---

layout: content-1
title: "Content-1 Layout"

---

Single content area. Good for full-width tables, diagrams, or large images.

---

layout: two-content
title: "Two-Content Layout"

---

::left::

First content pane — e.g. a diagram or bullet list.

::right::

Second content pane — e.g. a code snippet or chart.

---

layout: content-image-2col
title: "Content + Image 2-Col"

---

::text::

Descriptive text alongside an image. Useful for annotated screenshots or architecture diagrams with callouts.

::image::

![Placeholder](https://placehold.co/600x400/0070F2/white?text=Image)

---

layout: content-image-3col
title: "Content + Image 3-Col"

---

::col1::

Text pane one.

::col2::

![Placeholder](https://placehold.co/400x300/0070F2/white?text=Image)

::col3::

Text pane three.

---

layout: content-image-4col
title: "Content + Image 4-Col"

---

::col1::

Pane 1

::col2::

Pane 2

::col3::

Pane 3

::col4::

Pane 4

---

layout: content-photo-1
title: "Content + Photo (1-up)"

---

Photo-forward layout. Place a full-bleed or large photo with a short caption or overlay text.

---

layout: content-photo-2
title: "Content + Photo (2-up)"

---

::left::

Caption for photo one.

::right::

Caption for photo two.

---

## layout: full-bleed-image

![Full-bleed placeholder](https://placehold.co/1920x1080/222222/white?text=Full+Bleed+Image)

---

layout: image-slide
title: "Image Slide Layout"

---

![Image slide placeholder](https://placehold.co/800x500/0070F2/white?text=Image+Slide)

---

layout: title-image-third
title: "Title + Image (Third)"

---

![Third image placeholder](https://placehold.co/640x480/0070F2/white?text=Title+Image+Third)

---

layout: title-photo
title: "Title + Photo"

---

![Photo placeholder](https://placehold.co/800x600/1A1A2E/white?text=Title+Photo)

---

## layout: quote

"The best way to predict the future is to invent it."

— Alan Kay

---

## layout: blank

Blank layout — no chrome. Full canvas for custom content.

---

layout: tips-tricks
title: "Tips & Tricks Layout"

---

- Tip 1: Use the `variant` prop on covers and dividers to pick a colour scheme.
- Tip 2: Frontmatter `presenter:` auto-resolves to `presenters/<slug>.yaml`.
- Tip 3: `cds up` is one-stop build + deploy for CAP on BTP.

---

layout: color-palette
title: "Color Palette Reference"

---

---

layout: brand-site
title: "Brand Site Layout"

---

---

layout: text-screenshot
title: "Text + Screenshot Layout"

---

::text::

Describe what the screenshot shows. Keep it brief — one or two sentences maximum.

::screenshot::

![Screenshot placeholder](https://placehold.co/960x600/F0F0F0/333333?text=Screenshot)

---

layout: q-and-a
presenter: thomas-jung

---

---

layout: thank-you
presenter: thomas-jung
variant: a

---

---

layout: thank-you
presenter: thomas-jung
variant: b

---

---

layout: title-content
title: "Component: Bio"

---

<Bio presenter="thomas-jung" />

---

layout: title-content
title: "Component: Bio (compact)"

---

<Bio presenter="thomas-jung" :compact="true" />

---

layout: title-only
title: "Component: Bio (team mode)"

---

<Bio :people="[
  { name: 'Nina Thompson', role: 'Data Analyst', photo: 'https://placehold.co/200x250/0070F2/white?text=Nina', qr: 'https://example.com/nina' },
  { name: 'Marcus Bennett', role: 'Product Manager', photo: 'https://placehold.co/200x250/0070F2/white?text=Marcus', qr: 'https://example.com/marcus' },
  { name: 'Sofia Nguyen', role: 'Engineer', photo: 'https://placehold.co/200x250/0070F2/white?text=Sofia', qr: 'https://example.com/sofia' },
  { name: 'Ethan Brooks', role: 'Designer', photo: 'https://placehold.co/200x250/0070F2/white?text=Ethan', qr: 'https://example.com/ethan' }
]" />

---

layout: title-content
title: "Component: Speaker"

---

<Speaker presenter="thomas-jung" />

---

layout: title-content
title: "Component: KeyTakeaway"

---

<KeyTakeaway>
  CAP lets you focus on domain logic — the framework handles persistence, protocols, and security boilerplate.
</KeyTakeaway>

---

layout: title-content
title: "Component: CodeBlock"

---

<CodeBlock lang="SQL" filename="db/schema.cds" caption="A managed entity with associations.">

```sql
entity Books : managed {
  key ID    : Integer;
  title     : localized String(111);
  author    : Association to Authors;
}
```

</CodeBlock>

---

layout: title-content
title: "Component: DemoCallout (live)"

---

<DemoCallout kind="live" fallback="walk through the code on screen" />

---

layout: title-content
title: "Component: DemoCallout (recorded)"

---

<DemoCallout kind="recorded" />

---

layout: title-content
title: "Component: DemoCallout (interactive)"

---

<DemoCallout kind="interactive" />

---

layout: title-content
title: "Component: Roadmap"

---

<Roadmap :phases="roadmapPhases" />

---

layout: title-content
title: "Component: Roadmap (no disclaimer)"

---

<Roadmap :phases="roadmapPhases" :suppress-disclaimer="true" />

---

layout: title-content
title: "Component: DeveloperAdvocates"

---

<DeveloperAdvocates />

---

layout: title-content
title: "Component: Agenda"

---

<Agenda :items="['Foundations', 'Data Modelling', 'Services', 'Deployment', 'Q&A']" :current="3" />

---

layout: title-content
title: "Component: EventBadge"

---

<EventBadge />

---

layout: title-content
title: "Component: QRCode"

---

<QRCode url="https://developers.sap.com" label="SAP Developer Portal" />

---

layout: title-content
title: "Component: Disclaimer (forward-looking)"

---

<Disclaimer kind="forward-looking" />

---

layout: title-content
title: "Component: Disclaimer (informational)"

---

<Disclaimer kind="informational" />

---

layout: title-content
title: "Component: Disclaimer (safe-harbor)"

---

<Disclaimer kind="safe-harbor" />

---

layout: content
title: "Content Layout — Text Variant"
variant: text

---

This is a content slide with text variant. Use for flowing prose or bullet points.

- Bullet one
- Bullet two
- Bullet three

---

layout: content
title: "Content Layout — 2-Column"
variant: 2col

---

::left::

Left column content.

::right::

Right column content.

---

layout: content
title: "Content Layout — 3-Column"
variant: 3col

---

::col1::

Column 1

::col2::

Column 2

::col3::

Column 3

---

layout: content
title: "Content Layout — Default"
variant: default

---

Default content layout with standard styling and spacing.

---

layout: content-image
title: "Content Image — 1-3 Layout"
variant: 1-3

---

::col1::

Text or content in left column.

::col2::

::col3::

![Placeholder](https://placehold.co/400x300/0070F2/white?text=Image)

---

layout: full-bleed-image
title: "Full Bleed Image Layout"

---

![Full bleed image](https://placehold.co/1920x1080/222222/white?text=Full+Bleed+Image)

---

layout: screenshot
title: "Screenshot Layout"

---

![Screenshot](https://placehold.co/960x600/F0F0F0/333333?text=Screenshot)

---

layout: quote
title: "Quote Layout"

---

"The future belongs to those who believe in the beauty of their dreams." — Eleanor Roosevelt

---

layout: blank
title: "Blank Layout"

---

A completely blank canvas for custom content.

---

layout: agenda
title: "Agenda Layout — Variant A"
variant: a

---

---

layout: agenda
title: "Agenda Layout — Variant B"
variant: b

---

---

layout: content-image
title: "Content + Image — 2-Column"
variant: 2col

---

::text::

Text or content alongside an image.

::image::

![Placeholder](https://placehold.co/600x400/0070F2/white?text=Image)

---

layout: content-image
title: "Content + Image — 3-Column"
variant: 3col

---

::col1::

Text pane one.

::col2::

![Placeholder](https://placehold.co/400x300/0070F2/white?text=Image)

::col3::

Text pane three.

---

layout: content-image
title: "Content + Image — 4-Column"
variant: 4col

---

::col1::

Pane 1

::col2::

Pane 2

::col3::

Pane 3

::col4::

Pane 4

---

layout: qa
presenter: thomas-jung

---
