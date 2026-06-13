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

layout: cover
title: "Cover B"
subtitle: "Subtitle text"
variant: b
presenter: thomas-jung

---

---

layout: cover
title: "Cover C"
subtitle: "Subtitle text"
variant: c
presenter: thomas-jung

---

---

layout: cover
title: "Cover D"
subtitle: "Subtitle text"
variant: d
presenter: thomas-jung

---

---

layout: cover
title: "Cover E"
subtitle: "Subtitle text"
variant: e
presenter: thomas-jung

---

---

layout: cover
title: "Cover F"
subtitle: "Subtitle text"
variant: f
presenter: thomas-jung

---

---

layout: cover
title: "Cover G"
subtitle: "Subtitle text"
variant: g
presenter: thomas-jung

---

---

layout: cover
title: "Cover H"
subtitle: "Subtitle text"
variant: h
presenter: thomas-jung

---

---

layout: cover
title: "Cover I"
subtitle: "Subtitle text"
variant: i
presenter: thomas-jung

---

---

layout: cover
title: "Cover J"
subtitle: "Subtitle text"
variant: j
presenter: thomas-jung

---

---

layout: cover
title: "Cover K"
subtitle: "Subtitle text"
variant: k
presenter: thomas-jung

---

---

layout: cover
title: "Cover L"
subtitle: "Subtitle text"
variant: l
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

- Introduction
- Architecture overview
- Live demo
- Q & A
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
