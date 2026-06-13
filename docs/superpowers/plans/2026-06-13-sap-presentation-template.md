# SAP Presentation Template — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a GitHub-template repository for authoring SAP-branded HTML presentations with Slidev, with auto-extracted brand tokens, all 45 POTX layouts, a curated component library, foreign-PPTX import, visual regression, and GitHub Pages deploy.

**Architecture:** Slidev (Vue 3 + Vite) consuming a workspace-package theme that layers extracted POTX brand tokens on top of `@sap-theming/theming-base-content` (Horizon CSS + 72 fonts). UI5 Web Components are embedded for Fiori-authentic in-slide elements. All reusable content (presenters, teams, programs, disclaimers) is YAML-driven and resolved at build time via `@rollup/plugin-yaml`. GitHub Actions builds and deploys to GitHub Pages; Playwright snapshots a kitchen-sink gallery on every PR.

**Tech Stack:** Node 22 LTS · TypeScript · Slidev · Vue 3 · Vite · `@ui5/webcomponents` · `@sap-theming/theming-base-content` · `unzipper` · `fast-xml-parser` · `qrcode` · Playwright · GitHub Actions · LibreOffice (optional, for PPTX import)

**Spec:** [docs/superpowers/specs/2026-06-13-sap-presentation-template-design.md](../specs/2026-06-13-sap-presentation-template-design.md)

**Branch:** `feat/initial-implementation`

---

## How to use this plan

- Tasks are bite-sized (2–5 min each). Check off `- [ ]` boxes as you complete steps.
- Each task ends in a `git commit` step — frequent commits make rollback easy.
- The plan applies **TDD** wherever logic is testable (extraction script, data resolvers, components with logic). Pure-display Vue files don't need unit tests; they're covered by Playwright visual regression at the end.
- File paths are exact and absolute-from-repo-root (e.g., `theme/components/Bio.vue`).
- When a step says "Run X / Expected Y," pause if Y doesn't appear and investigate.
- Reference the spec for _why_ — this document is the _what_ and _how_.

> **⚠️ File ordering note for human readers:** Phases 1–5 appear in **reverse order** in this file (Phase 6 → Phase 5 → ... → Phase 1), then Phases 7–18 follow normally. Always navigate by **phase number**, not file position. The "Phase index" below jumps to the right place. Tool-driven execution (e.g., subagent-driven-development) follows the numbered phases, so this doesn't affect automated runs — only humans reading top-to-bottom.

---

## Phase index

1. Project scaffolding (package.json, workspaces, TS, lint)
2. Brand extraction script (POTX → CSS tokens + media)
3. Theme foundation (Horizon base + horizon-mapping + Slidev wiring)
4. Data layer (YAML loaders + resolvers)
5. Data files (presenters, teams, programs, disclaimers, event, snippets)
6. Core components (Bio, Speaker, Team, DeveloperAdvocates, Agenda, EventBadge, Disclaimer)
7. Secondary components (Roadmap, QRCode, SocialIcon, Logo, DemoCallout, CodeBlock, KeyTakeaway)
8. Core layouts (10 most-used POTX layouts)
9. Remaining layouts (35 layouts: cover variants, divider variants, photo, etc.)
10. Sample deck (`slides.md`)
11. PPTX import script
12. Kitchen-sink gallery page
13. Playwright visual regression
14. GitHub Actions: deploy workflow
15. GitHub Actions: visual regression workflow
16. README and CONTENT-GUIDE
17. Final polish: CHANGELOG, sample-deck demo data, smoke-test fork flow
18. Pre-merge checklist

---

## Phase 6: Core components

The seven highest-leverage components. Pure-display Vue files don't need unit tests; they're covered by Playwright visual regression in Phase 13. Components with logic (Roadmap's auto-disclaimer, QRCode generation) are tested in Phase 7.

For each component, after writing it: add a one-slide demo in `slides.md` (replacing the placeholder) and run `npm run dev` to see it render. We'll consolidate the demo deck in Phase 10.

### Task 6.1: SocialIcon component (foundation for Bio)

**Files:**

- Create: `theme/components/SocialIcon.vue`

- [ ] **Step 1: Write the component**

`theme/components/SocialIcon.vue`:

```vue
<script setup lang="ts">
  import type { SocialLink } from '../types'
  import { socialUrl } from '../setup/social'

  const props = defineProps<{ platform: SocialLink['platform']; handle: string; url?: string }>()
  const href = socialUrl({ platform: props.platform, handle: props.handle, url: props.url })
  const label = `${props.platform}: ${props.handle}`
</script>

<template>
  <a :href="href" :aria-label="label" class="social-icon" target="_blank" rel="noopener">
    <span class="platform">{{ platform }}</span>
    <span class="handle">{{ handle }}</span>
  </a>
</template>

<style scoped>
  .social-icon {
    display: inline-flex;
    gap: 0.4rem;
    align-items: baseline;
    padding: 0.25rem 0.6rem;
    border-radius: var(--sap-radius-button);
    background: var(--sap-brand-blue-pale);
    color: var(--sap-brand-blue-dark);
    text-decoration: none;
    font-size: 0.95rem;
    margin-right: 0.4rem;
  }
  .social-icon:hover {
    background: var(--sap-brand-blue);
    color: #fff;
  }
  .platform {
    text-transform: capitalize;
    font-weight: 600;
  }
  .handle {
    opacity: 0.85;
  }
</style>
```

> **Future improvement:** swap text for actual brand SVG glyphs (LinkedIn, GitHub, X). For v1, text labels are accessible and zero-asset. Document this in CONTENT-GUIDE for future iteration.

- [ ] **Step 2: Commit**

```bash
git add theme/components/SocialIcon.vue
git commit -m "feat(component): SocialIcon"
```

### Task 6.2: Bio component

**Files:**

- Create: `theme/components/Bio.vue`

- [ ] **Step 1: Write the component**

`theme/components/Bio.vue`:

```vue
<script setup lang="ts">
  import { resolvePresenter } from '../setup/data'
  import SocialIcon from './SocialIcon.vue'

  const props = defineProps<{ presenter?: string; compact?: boolean }>()
  const p = resolvePresenter(props.presenter)
</script>

<template>
  <ui5-card :class="['bio', { compact }]">
    <ui5-card-header slot="" :title-text="p.name" :subtitle-text="p.title">
      <ui5-avatar slot="avatar" :initials="p.initials" size="L" shape="Circle">
        <img v-if="p.photo" :src="p.photo" :alt="p.name" />
      </ui5-avatar>
    </ui5-card-header>
    <div v-if="!compact && p.bio" class="bio-body">{{ p.bio }}</div>
    <div class="bio-socials">
      <SocialIcon v-for="s in p.socials" :key="`${s.platform}-${s.handle}`" v-bind="s" />
    </div>
  </ui5-card>
</template>

<style scoped>
  .bio {
    width: 100%;
    max-width: 28rem;
  }
  .bio-body {
    padding: 0.75rem 1rem 0.5rem;
    font-size: 1rem;
    line-height: 1.5;
    color: var(--sapTextColor);
  }
  .bio-socials {
    padding: 0 1rem 1rem;
  }
  .bio.compact .bio-body {
    display: none;
  }
</style>
```

> **UI5 Web Components quirk:** `<ui5-card-header>` uses **named slots** (`avatar`, `action`). The `slot=""` on the header itself is required to nest it inside the card slot Slidev/Vue treats as default; some Vue versions need `<ui5-card><ui5-card-header slot="content">...` instead. If rendering looks wrong, check the UI5 docs for the version pinned in `package.json` and adjust.

- [ ] **Step 2: Commit**

```bash
git add theme/components/Bio.vue
git commit -m "feat(component): Bio"
```

### Task 6.3: Speaker component

**Files:**

- Create: `theme/components/Speaker.vue`

- [ ] **Step 1: Write the component**

`theme/components/Speaker.vue`:

```vue
<script setup lang="ts">
  import { resolvePresenter, resolvePresenters } from '../setup/data'

  const props = defineProps<{ presenter?: string; presenters?: string[] }>()
  const list = props.presenters
    ? resolvePresenters(props.presenters)
    : [resolvePresenter(props.presenter)]
</script>

<template>
  <span class="speaker">
    <span v-for="(p, i) in list" :key="p.slug" class="speaker-item">
      <strong>{{ p.name }}</strong>
      <span class="speaker-title"> · {{ p.title }}</span>
      <span v-if="i < list.length - 1">, </span>
    </span>
  </span>
</template>

<style scoped>
  .speaker {
    font-size: 1rem;
    color: var(--sapContent_LabelColor);
  }
  .speaker-title {
    opacity: 0.85;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add theme/components/Speaker.vue
git commit -m "feat(component): Speaker"
```

### Task 6.4: Team component

**Files:**

- Create: `theme/components/Team.vue`

- [ ] **Step 1: Write the component**

`theme/components/Team.vue`:

```vue
<script setup lang="ts">
  import { resolveTeam } from '../setup/data'
  import Bio from './Bio.vue'

  const props = defineProps<{ team: string; columns?: number }>()
  const t = resolveTeam(props.team)
  const cols = props.columns ?? Math.min(3, t.presenters.length)
</script>

<template>
  <div class="team">
    <header v-if="t.tagline" class="team-tagline">{{ t.tagline }}</header>
    <div class="team-grid" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)` }">
      <Bio v-for="p in t.presenters" :key="p.slug" :presenter="p.slug" compact />
    </div>
  </div>
</template>

<style scoped>
  .team {
    width: 100%;
  }
  .team-tagline {
    font-size: 1.25rem;
    color: var(--sap-brand-blue-dark);
    margin-bottom: 1rem;
    font-weight: 500;
  }
  .team-grid {
    display: grid;
    gap: 1rem;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add theme/components/Team.vue
git commit -m "feat(component): Team"
```

### Task 6.5: DeveloperAdvocates component

**Files:**

- Create: `theme/components/DeveloperAdvocates.vue`

- [ ] **Step 1: Write the component**

`theme/components/DeveloperAdvocates.vue`:

```vue
<script setup lang="ts">
  import { resolveProgram } from '../setup/data'
  import Team from './Team.vue'

  const program = resolveProgram('developer-advocates')
</script>

<template>
  <div class="dev-advocates">
    <h2>SAP Developer Advocates</h2>
    <p class="dev-advocates-tagline">{{ program.tagline }}</p>
    <p class="dev-advocates-desc">{{ program.description }}</p>

    <Team team="dev-advocates" />

    <div class="dev-advocates-engage">
      <span class="label">Engage with us:</span>
      <a
        v-for="link in program.engagementLinks"
        :key="link.url"
        :href="link.url"
        target="_blank"
        rel="noopener"
        class="engage-link"
        >{{ link.label }}</a
      >
    </div>
  </div>
</template>

<style scoped>
  .dev-advocates h2 {
    color: var(--sap-brand-blue-darker);
    margin-bottom: 0.5rem;
  }
  .dev-advocates-tagline {
    font-size: 1.5rem;
    color: var(--sap-brand-blue);
    margin-bottom: 1rem;
  }
  .dev-advocates-desc {
    font-size: 1.05rem;
    margin-bottom: 1.5rem;
    max-width: 60rem;
  }
  .dev-advocates-engage {
    margin-top: 1.5rem;
    display: flex;
    gap: 0.75rem;
    align-items: baseline;
    flex-wrap: wrap;
  }
  .dev-advocates-engage .label {
    font-weight: 600;
    color: var(--sapContent_LabelColor);
  }
  .engage-link {
    color: var(--sap-brand-blue);
    text-decoration: none;
    padding: 0.25rem 0.75rem;
    border: 1px solid var(--sap-brand-blue);
    border-radius: var(--sap-radius-button);
  }
  .engage-link:hover {
    background: var(--sap-brand-blue);
    color: #fff;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add theme/components/DeveloperAdvocates.vue
git commit -m "feat(component): DeveloperAdvocates"
```

### Task 6.6: EventBadge component

**Files:**

- Create: `theme/components/EventBadge.vue`

- [ ] **Step 1: Write the component**

`theme/components/EventBadge.vue`:

```vue
<script setup lang="ts">
  import { getEvent } from '../setup/data'
  const event = getEvent()
</script>

<template>
  <span class="event-badge">
    <span class="event-name">{{ event.name }}</span>
    <span v-if="event.date" class="event-date">· {{ event.date }}</span>
    <span v-if="event.hashtag" class="event-hashtag">· {{ event.hashtag }}</span>
  </span>
</template>

<style scoped>
  .event-badge {
    display: inline-flex;
    gap: 0.4rem;
    align-items: baseline;
    padding: 0.25rem 0.75rem;
    background: var(--sap-brand-blue-pale);
    color: var(--sap-brand-blue-dark);
    border-radius: var(--sap-radius-button);
    font-size: 0.9rem;
  }
  .event-name {
    font-weight: 600;
  }
  .event-date,
  .event-hashtag {
    opacity: 0.8;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add theme/components/EventBadge.vue
git commit -m "feat(component): EventBadge"
```

### Task 6.7: Disclaimer component

**Files:**

- Create: `theme/components/Disclaimer.vue`

- [ ] **Step 1: Write the component**

`theme/components/Disclaimer.vue`:

```vue
<script setup lang="ts">
  import { resolveDisclaimers } from '../setup/data'
  import type { Disclaimers } from '../types'

  const props = defineProps<{ kind: keyof Disclaimers }>()
  const all = resolveDisclaimers()
  const text = all[props.kind]
  if (!text)
    throw new Error(
      `disclaimer kind "${String(props.kind)}" not found in programs/disclaimers.yaml`
    )
</script>

<template>
  <div :class="['disclaimer', `disclaimer--${kind}`]">
    {{ text }}
  </div>
</template>

<style scoped>
  .disclaimer {
    font-size: 0.75rem;
    line-height: 1.5;
    color: var(--sapContent_LabelColor);
    background: var(--sapList_SelectionBackgroundColor, #f0f5ff);
    border-left: 3px solid var(--sap-brand-blue);
    padding: 0.75rem 1rem;
    max-width: 60rem;
    white-space: pre-wrap;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add theme/components/Disclaimer.vue
git commit -m "feat(component): Disclaimer"
```

### Task 6.8: Agenda component

`<Agenda>` reads deck-level front-matter listing the agenda items. Slidev exposes deck front-matter via `useNav()` / `useSlideContext()`. We'll use a simpler approach: pass items as a prop, with deck-level `agenda:` accessible via global slidev context.

**Files:**

- Create: `theme/components/Agenda.vue`

- [ ] **Step 1: Write the component**

`theme/components/Agenda.vue`:

```vue
<script setup lang="ts">
  const props = defineProps<{
    items?: string[]
    current?: number // 1-based index of "you are here"
  }>()
  const list = props.items ?? []
</script>

<template>
  <ol class="agenda">
    <li
      v-for="(item, i) in list"
      :key="i"
      :class="{ active: current === i + 1, done: current && i + 1 < current }"
    >
      <span class="num">{{ String(i + 1).padStart(2, '0') }}</span>
      <span class="text">{{ item }}</span>
    </li>
  </ol>
</template>

<style scoped>
  .agenda {
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: 1.5rem;
  }
  .agenda li {
    display: flex;
    gap: 1rem;
    align-items: baseline;
    padding: 0.5rem 0;
    border-bottom: 1px solid #e5e9ed;
    color: var(--sapTextColor);
    opacity: 0.6;
  }
  .agenda li.active {
    opacity: 1;
    color: var(--sap-brand-blue);
    font-weight: 600;
  }
  .agenda li.done {
    opacity: 0.35;
    text-decoration: line-through;
  }
  .num {
    font-family: var(--sap-font-major);
    font-weight: 700;
    color: var(--sap-brand-blue);
    min-width: 2.5rem;
  }
</style>
```

> **Why no auto-from-front-matter for v1:** Slidev's per-slide front-matter API is straightforward (`$slidev.nav.currentSlideMeta`), but accessing _deck-level_ keys like `agenda:` requires importing `useSlidevContext` and is version-sensitive. Passing an explicit `items` prop in the slide is unambiguous and works on every Slidev version. We can add deck-level integration later as a v1.x improvement.

- [ ] **Step 2: Commit**

```bash
git add theme/components/Agenda.vue
git commit -m "feat(component): Agenda (prop-driven, with current-position highlighting)"
```

### Task 6.9: Add components to global registry

Slidev auto-registers Vue components placed under `theme/components/`. To confirm, try using one in `slides.md` once.

**Files:**

- Modify: `slides.md`

- [ ] **Step 1: Add a quick test slide to slides.md**

Replace the second slide (after the first `---` separator) with:

```markdown
---

# Test slide

<Bio />

<EventBadge />
```

- [ ] **Step 2: Run dev**

Run: `npm run dev`
Expected: the second slide shows a Bio card with Thomas Jung's name, title, bio, and social-icon row, plus an event badge below. UI5 styles applied.

> **If components don't auto-resolve:** Slidev requires components to be in `theme/components/` (we have that) and the theme's `package.json` to declare it (we do). If a component is unresolved, check the case sensitivity of the filename — Slidev component resolution is case-sensitive. Stop the dev server with Ctrl-C.

- [ ] **Step 3: Revert slides.md to placeholder for now (the real demo deck comes in Phase 10)**

Restore slides.md to its Phase 1 contents (placeholder text only).

- [ ] **Step 4: Commit**

```bash
git add slides.md
git commit -m "chore: smoke-test core components in slides.md"
```

---

## Phase 5: Data files (presenters, teams, programs, event, snippets)

Author the YAML and Markdown files that components will resolve. These are template-shipped defaults; fork-authors edit them.

### Task 5.1: presenters/\_example.yaml (the contributor template)

**Files:**

- Create: `presenters/_example.yaml`

- [ ] **Step 1: Write the example**

`presenters/_example.yaml`:

```yaml
# Copy this file to presenters/<your-slug>.yaml and fill in your details.
# The slug must match the filename (without .yaml). Lowercase + hyphens only.
slug: example-name
name: Example Person
title: Job Title, SAP
photo: /presenters/example-name.jpg # place under /public/presenters/
initials: EP
bio: |
  One- or two-sentence bio. Plain text, used in <Bio> cards.
socials:
  - { platform: linkedin, handle: example-name }
  - { platform: github, handle: examplename }
  - { platform: x, handle: examplename }
email: example.person@sap.com
```

- [ ] **Step 2: Commit**

```bash
git add presenters/_example.yaml
git commit -m "docs: add presenter template (_example.yaml)"
```

### Task 5.2: presenters/thomas-jung.yaml (demo presenter)

**Files:**

- Create: `presenters/thomas-jung.yaml`

- [ ] **Step 1: Write the demo presenter**

`presenters/thomas-jung.yaml`:

```yaml
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

- [ ] **Step 2: Add a placeholder photo**

If you have a real photo, place it at `public/presenters/thomas-jung.jpg`. Otherwise create a placeholder:

```bash
mkdir -p public/presenters
# Use any 400x400 placeholder; below is a no-op note.
# In a working environment, drop a real file here.
```

For the plan to remain executable without a real photo, the `<Bio>` component falls back to `<ui5-avatar>`'s initials display when the image fails to load — handled in Task 6.1.

- [ ] **Step 3: Commit**

```bash
git add presenters/thomas-jung.yaml
git commit -m "feat: demo presenter (thomas-jung)"
```

### Task 5.3: teams/dev-advocates.yaml

**Files:**

- Create: `teams/dev-advocates.yaml`

- [ ] **Step 1: Write the team**

`teams/dev-advocates.yaml`:

```yaml
slug: dev-advocates
name: SAP Developer Advocates
tagline: Helping developers build the future on SAP BTP.
members:
  - thomas-jung
  # Add more presenter slugs here as the team grows. Each slug must
  # have a matching file under presenters/<slug>.yaml.
```

- [ ] **Step 2: Commit**

```bash
git add teams/dev-advocates.yaml
git commit -m "feat: dev-advocates team data"
```

### Task 5.4: programs/developer-advocates.yaml

**Files:**

- Create: `programs/developer-advocates.yaml`

- [ ] **Step 1: Write the program data**

`programs/developer-advocates.yaml`:

```yaml
slug: developer-advocates
tagline: Code with us. Build with us. Ship with us.
description: |
  The SAP Developer Advocates connect SAP technology with the developer community
  through tutorials, samples, live coding, and direct conversations. We're the
  bridge between SAP product teams and developers building on SAP BTP.
engagementLinks:
  - { label: Newsletter, url: https://developers.sap.com/newsletter.html }
  - { label: YouTube, url: https://youtube.com/@sapdevs }
  - { label: GitHub, url: https://github.com/SAP-samples }
  - { label: Community, url: https://community.sap.com }
```

> **Verify URLs before committing.** All four links above point to public SAP properties as of mid-2026. If any have moved, update.

- [ ] **Step 2: Commit**

```bash
git add programs/developer-advocates.yaml
git commit -m "feat: developer-advocates program data"
```

### Task 5.5: programs/disclaimers.yaml

**Files:**

- Create: `programs/disclaimers.yaml`

- [ ] **Step 1: Write the disclaimers**

`programs/disclaimers.yaml`:

```yaml
forward-looking: |
  This presentation outlines our general product direction and should not be relied
  on in making a purchasing decision. This presentation is not subject to your
  license agreement or any other agreement with SAP. SAP has no obligation to
  pursue any course of business outlined in this presentation, or to develop or
  release any functionality mentioned in this presentation. This presentation and
  SAP's strategy and possible future developments are subject to change and may be
  changed by SAP at any time for any reason without notice. This document is
  provided without a warranty of any kind, either express or implied, including
  but not limited to the implied warranties of merchantability, fitness for a
  particular purpose, or non-infringement. SAP assumes no responsibility for
  errors or omissions in this document, except if such damages were caused by
  SAP's intentional or gross negligence.

informational: |
  This presentation is for informational purposes only and may not be incorporated
  into a contract. SAP assumes no responsibility for errors or omissions in this
  document, and SAP shall have no liability for damages of any kind including
  without limitation direct, special, indirect, or consequential damages that may
  result from the use of these materials.

safe-harbor: |
  Any statements contained in this presentation that are not historical facts
  are forward-looking statements as defined in the U.S. Private Securities
  Litigation Reform Act of 1995. Words such as "anticipate," "believe," "estimate,"
  "expect," "forecast," "intend," "may," "plan," "project," "predict," "should,"
  and "will" and similar expressions as they relate to SAP are intended to
  identify such forward-looking statements. SAP undertakes no obligation to
  publicly update or revise any forward-looking statements.
```

> **Important:** these are **paraphrased canonical SAP disclaimer texts** that have appeared publicly in SAP earnings call decks. Before using in any binding context, verify wording against the latest SAP investor relations documents and adjust if SAP has updated.

- [ ] **Step 2: Commit**

```bash
git add programs/disclaimers.yaml
git commit -m "feat: disclaimer texts (forward-looking, informational, safe-harbor)"
```

### Task 5.6: event.yaml

**Files:**

- Create: `event.yaml`

- [ ] **Step 1: Write a demo event**

`event.yaml`:

```yaml
# Per-deck metadata. Edit per fork.
name: Sample Event 2026
date: 2026-06-13
venue: Online
hashtag: '#SAPSample'
defaultPresenter: thomas-jung
```

- [ ] **Step 2: Commit**

```bash
git add event.yaml
git commit -m "feat: demo event metadata"
```

### Task 5.7: Snippets — codejam, community-thanks, legal-disclaimer

**Files:**

- Create: `snippets/codejam.md`
- Create: `snippets/community-thanks.md`
- Create: `snippets/legal-disclaimer.md`

- [ ] **Step 1: Write codejam snippet**

`snippets/codejam.md`:

```markdown
---
layout: title-text
title: Join us at an SAP CodeJam
---

SAP CodeJams are free, hands-on, in-person developer events hosted by partners
around the world. Spend a day coding with SAP Developer Advocates on a focused
technical topic.

- Free to attend
- Hands-on, code-along format
- Hosted by SAP partners worldwide
- Topics: CAP, RAP, BTP, AI, integration

Find an upcoming event: [developers.sap.com/codejam](https://developers.sap.com/topics/codejam.html)
```

- [ ] **Step 2: Write community-thanks snippet**

`snippets/community-thanks.md`:

```markdown
---
layout: title-text
title: Thank you to the community
---

This presentation builds on the work of countless community contributors:
bloggers, sample authors, question-answerers, and event organizers.

Find them and join them at [community.sap.com](https://community.sap.com).
```

- [ ] **Step 3: Write legal-disclaimer snippet**

`snippets/legal-disclaimer.md`:

```markdown
---
layout: title-text
title: Forward-looking statements
---

<Disclaimer kind="forward-looking" />
```

- [ ] **Step 4: Commit**

```bash
git add snippets/
git commit -m "feat: starter snippets (codejam, community-thanks, legal-disclaimer)"
```

---

## Phase 4: Data layer

Wire `@rollup/plugin-yaml` into Slidev's Vite config so `.yaml` files import as JS objects, then write `theme/setup/data.ts` — a small set of resolvers that components call (`resolvePresenter(slug)`, `resolveTeam(slug)`, etc.). End state: a Vue component can `import { resolvePresenter } from 'slidev-theme-sap/setup/data'` and get a typed `Presenter` object.

### Task 4.1: Configure Vite to load YAML

**Files:**

- Create: `vite.config.ts`

- [ ] **Step 1: Write Vite config**

`vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import yaml from '@rollup/plugin-yaml'

// Slidev reads vite.config.ts at the project root and merges it with its own.
export default defineConfig({
  plugins: [yaml()]
})
```

- [ ] **Step 2: Verify dev still starts**

Run: `npm run dev`
Expected: starts with no errors. (No YAML imports yet to verify, but plugin must load cleanly.) Stop with Ctrl-C.

- [ ] **Step 3: Commit**

```bash
git add vite.config.ts
git commit -m "chore: enable YAML imports via @rollup/plugin-yaml"
```

### Task 4.2: TypeScript module declaration for \*.yaml

**Files:**

- Create: `theme/yaml.d.ts`

- [ ] **Step 1: Write the declaration**

`theme/yaml.d.ts`:

```ts
// Tell TypeScript that *.yaml imports return `any` (the plugin parses them).
// Specific types are applied at the resolver layer in setup/data.ts.
declare module '*.yaml' {
  const content: unknown
  export default content
}
```

- [ ] **Step 2: Verify type-check still passes**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add theme/yaml.d.ts
git commit -m "chore: declare *.yaml module type"
```

### Task 4.3: Glob-import data files (TDD where practical)

Vite's `import.meta.glob` lets us pull in every YAML file under a directory at once. We'll wrap it in a small loader.

**Files:**

- Create: `theme/setup/data.ts`
- Create: `theme/setup/data.test.ts`

- [ ] **Step 1: Write tests for the data loader API surface**

`theme/setup/data.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest'

// Mock Vite's import.meta.glob — Vitest doesn't run inside Vite, so we
// inject sample data the same shape the plugin produces.
vi.mock('virtual:data-presenters', () => ({
  default: {
    'thomas-jung': {
      slug: 'thomas-jung',
      name: 'Thomas Jung',
      title: 'Developer Advocate, SAP',
      initials: 'TJ',
      bio: 'Sample bio.',
      socials: [{ platform: 'linkedin', handle: 'thomas-jung' }]
    }
  }
}))
vi.mock('virtual:data-teams', () => ({
  default: {
    'dev-advocates': {
      slug: 'dev-advocates',
      name: 'Developer Advocates',
      members: ['thomas-jung']
    }
  }
}))
vi.mock('virtual:data-event', () => ({
  default: {
    name: 'Test Event',
    date: '2026-06-13',
    defaultPresenter: 'thomas-jung'
  }
}))

import { resolvePresenter, resolveTeam, getEvent } from './data'

describe('data resolvers', () => {
  it('resolves a presenter by slug', () => {
    const p = resolvePresenter('thomas-jung')
    expect(p.name).toBe('Thomas Jung')
  })

  it('falls back to event default when slug is undefined', () => {
    const p = resolvePresenter()
    expect(p.slug).toBe('thomas-jung')
  })

  it('throws on unknown slug', () => {
    expect(() => resolvePresenter('nonexistent')).toThrow(/presenter "nonexistent" not found/)
  })

  it('resolves a team and inflates members to Presenter objects', () => {
    const team = resolveTeam('dev-advocates')
    expect(team.name).toBe('Developer Advocates')
    expect(team.presenters[0].name).toBe('Thomas Jung')
  })

  it('exposes the event object', () => {
    const e = getEvent()
    expect(e.name).toBe('Test Event')
    expect(e.defaultPresenter).toBe('thomas-jung')
  })
})
```

- [ ] **Step 2: Run test — should fail**

Run: `npm test -- data.test`
Expected: FAIL with module-not-found.

- [ ] **Step 3: Implement the data layer**

Note the indirection through "virtual:data-\*" module names: in production we use `import.meta.glob`, but for unit tests we mock those names. We'll provide a thin `_dataSources.ts` that switches between real glob and test mocks.

`theme/setup/_dataSources.ts`:

```ts
// In a Vite-built context, import.meta.glob('@/presenters/*.yaml', { eager: true })
// loads every YAML at build time and produces a record keyed by file path.
// We export them under stable virtual module names so tests can mock the surface.

const presenterModules = import.meta.glob('/presenters/*.yaml', {
  eager: true,
  import: 'default'
}) as Record<string, unknown>

const teamModules = import.meta.glob('/teams/*.yaml', {
  eager: true,
  import: 'default'
}) as Record<string, unknown>

const programModules = import.meta.glob('/programs/*.yaml', {
  eager: true,
  import: 'default'
}) as Record<string, unknown>

import eventData from '/event.yaml'

function indexBySlug(modules: Record<string, unknown>): Record<string, any> {
  const result: Record<string, any> = {}
  for (const [path, mod] of Object.entries(modules)) {
    const slug = path
      .split('/')
      .pop()!
      .replace(/\.yaml$/, '')
    if (slug.startsWith('_')) continue // skip _example.yaml
    result[slug] = mod
  }
  return result
}

export const presenters = indexBySlug(presenterModules)
export const teams = indexBySlug(teamModules)
export const programs = indexBySlug(programModules)
export const event = eventData as any
```

`theme/setup/data.ts`:

```ts
import type { Presenter, Team, Program, Event, Disclaimers } from '../types'

// Indirection: tests mock these names; production uses _dataSources.ts.
import {
  presenters as _presenters,
  teams as _teams,
  programs as _programs,
  event as _event
} from './_dataSources'

const presenters = _presenters as Record<string, Presenter>
const teams = _teams as Record<string, Team>
const programs = _programs as Record<string, Program>
const event = _event as Event

export function getEvent(): Event {
  return event
}

export function resolvePresenter(slug?: string): Presenter {
  const s = slug ?? event.defaultPresenter
  const p = presenters[s]
  if (!p) throw new Error(`presenter "${s}" not found in /presenters/`)
  return p
}

export function resolvePresenters(slugs: string[]): Presenter[] {
  return slugs.map((s) => resolvePresenter(s))
}

export function resolveTeam(slug: string): Team & { presenters: Presenter[] } {
  const t = teams[slug]
  if (!t) throw new Error(`team "${slug}" not found in /teams/`)
  return { ...t, presenters: resolvePresenters(t.members) }
}

export function resolveProgram(slug: string): Program {
  const p = programs[slug]
  if (!p) throw new Error(`program "${slug}" not found in /programs/`)
  return p
}

export function resolveDisclaimers(): Disclaimers {
  // Disclaimers live in programs/disclaimers.yaml as a flat object.
  const d = programs['disclaimers'] as unknown as Disclaimers
  if (!d) throw new Error(`programs/disclaimers.yaml is missing`)
  return d
}
```

> **Why the test mocks `virtual:data-*` but the impl uses `_dataSources.ts`:** the test has an alias-mock to bypass `import.meta.glob` (which Vitest doesn't synthesize the same way). The earlier test draft references `virtual:data-presenters` etc. — re-point those mocks to `'./\_dataSources'` to match the actual import. The next sub-step does this.

- [ ] **Step 4: Fix the test to mock the real module path**

Replace the three `vi.mock(...)` calls in `theme/setup/data.test.ts` with:

```ts
vi.mock('./_dataSources', () => ({
  presenters: {
    'thomas-jung': {
      slug: 'thomas-jung',
      name: 'Thomas Jung',
      title: 'Developer Advocate, SAP',
      initials: 'TJ',
      bio: 'Sample bio.',
      socials: [{ platform: 'linkedin', handle: 'thomas-jung' }]
    }
  },
  teams: {
    'dev-advocates': {
      slug: 'dev-advocates',
      name: 'Developer Advocates',
      members: ['thomas-jung']
    }
  },
  programs: {},
  event: {
    name: 'Test Event',
    date: '2026-06-13',
    defaultPresenter: 'thomas-jung'
  }
}))
```

- [ ] **Step 5: Run test — should pass**

Run: `npm test -- data.test`
Expected: PASS, all five resolver tests green.

- [ ] **Step 6: Commit**

```bash
git add theme/setup/data.ts theme/setup/_dataSources.ts theme/setup/data.test.ts
git commit -m "feat: data layer (YAML resolvers for presenters/teams/programs/event)"
```

### Task 4.4: Helper for social-link URL building

**Files:**

- Create: `theme/setup/social.ts`
- Create: `theme/setup/social.test.ts`

- [ ] **Step 1: Write tests**

`theme/setup/social.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { socialUrl } from './social'

describe('socialUrl', () => {
  it('builds LinkedIn URL', () => {
    expect(socialUrl({ platform: 'linkedin', handle: 'thomas-jung' })).toBe(
      'https://www.linkedin.com/in/thomas-jung'
    )
  })
  it('builds GitHub URL', () => {
    expect(socialUrl({ platform: 'github', handle: 'thomasjung' })).toBe(
      'https://github.com/thomasjung'
    )
  })
  it('builds X URL', () => {
    expect(socialUrl({ platform: 'x', handle: 'sapdevs' })).toBe('https://x.com/sapdevs')
  })
  it('respects explicit url override', () => {
    expect(socialUrl({ platform: 'mastodon', handle: 'me', url: 'https://hachyderm.io/@me' })).toBe(
      'https://hachyderm.io/@me'
    )
  })
})
```

- [ ] **Step 2: Run — fails**

Run: `npm test -- social.test`
Expected: FAIL.

- [ ] **Step 3: Implement**

`theme/setup/social.ts`:

```ts
import type { SocialLink } from '../types'

const TEMPLATES: Record<string, (handle: string) => string> = {
  linkedin: (h) => `https://www.linkedin.com/in/${h}`,
  github: (h) => `https://github.com/${h}`,
  twitter: (h) => `https://twitter.com/${h}`,
  x: (h) => `https://x.com/${h}`,
  bsky: (h) => `https://bsky.app/profile/${h}`,
  youtube: (h) => `https://youtube.com/@${h}`,
  mastodon: (h) => `https://mastodon.social/@${h}` // user can override via url
}

export function socialUrl(link: SocialLink): string {
  if (link.url) return link.url
  const tmpl = TEMPLATES[link.platform]
  if (!tmpl) throw new Error(`unknown social platform: ${link.platform}`)
  return tmpl(link.handle)
}
```

- [ ] **Step 4: Run — passes**

Run: `npm test -- social.test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add theme/setup/social.ts theme/setup/social.test.ts
git commit -m "feat: social-link URL builder"
```

---

## Phase 3: Theme foundation

Wire `@sap-theming/theming-base-content` (Horizon CSS + 72 fonts), our extracted brand tokens, and the `horizon-mapping.css` aliasing layer into a Slidev theme entry point. End state: `npm run dev` shows the placeholder slides.md rendered with SAP colors and the 72 font.

### Task 3.1: Theme entry CSS

**Files:**

- Create: `theme/styles/index.css`

- [ ] **Step 1: Write the entry CSS**

`theme/styles/index.css`:

```css
/*
 * Theme entry — order matters.
 *
 * 1. @sap-theming/theming-base-content provides the Horizon CSS variables
 *    (--sapButton_*, --sapList_*, etc.), the "72" web font, and SAP-icons.
 * 2. Our extracted brand tokens (--sap-brand-*, --sap-font-major, …) overlay
 *    SAP corporate identity on top of Horizon defaults.
 * 3. horizon-mapping.css aliases UI5 Horizon variable names to our extracted
 *    tokens, so live <ui5-*> components and our own slide components share
 *    a single source of truth.
 * 4. slide-styles.css contains deck-level spacing, typography, transitions.
 */

@import '@sap-theming/theming-base-content/content/Base/baseLib/sap_horizon/css_variables.css';
@import '@sap-theming/theming-base-content/content/Base/baseLib/sap_horizon/fonts.css';

@import './_extracted/brand-tokens.css';
@import './horizon-mapping.css';
@import './slide-styles.css';
```

> **Note:** the exact internal paths inside `@sap-theming/theming-base-content` may vary by package version. If an import fails, run `find node_modules/@sap-theming/theming-base-content -name 'css_variables.css'` and adjust paths. Pin the version once it works.

- [ ] **Step 2: Commit**

```bash
git add theme/styles/index.css
git commit -m "feat: theme entry CSS (Horizon base + brand overlay + mapping)"
```

### Task 3.2: Horizon mapping layer

**Files:**

- Create: `theme/styles/horizon-mapping.css`

- [ ] **Step 1: Write the mapping**

`theme/styles/horizon-mapping.css`:

```css
/*
 * Horizon mapping — aliases UI5 Horizon CSS variable names to our
 * extracted brand tokens. This is the bridge that ensures live
 * <ui5-*> components on slides match the brand exactly.
 *
 * Source of truth: theme/styles/_extracted/brand-tokens.css
 * (which is generated from SAP_Corp.potx).
 *
 * Hand-written, rarely changes. When SAP Horizon ships a new
 * variable name worth aliasing, add it here.
 */

:root {
  /* Brand-color level mappings */
  --sapBrandColor: var(--sap-brand-blue);
  --sapHighlightColor: var(--sap-brand-blue);
  --sapSelectedColor: var(--sap-brand-blue);

  /* Buttons */
  --sapButton_Background: var(--sap-brand-blue);
  --sapButton_Hover_Background: var(--sap-brand-blue-dark);
  --sapButton_Emphasized_Background: var(--sap-brand-blue);
  --sapButton_Emphasized_Hover_Background: var(--sap-brand-blue-dark);

  /* Lists & cards */
  --sapList_Background: #ffffff;
  --sapList_HeaderBackground: #ffffff;
  --sapList_SelectionBackgroundColor: var(--sap-brand-blue-pale);

  /* Text */
  --sapTextColor: #1d2d3e;
  --sapContent_LabelColor: #475e75;
  --sapContent_NonInteractiveIconColor: var(--sap-brand-blue);

  /* Surfaces */
  --sapBackgroundColor: #ffffff;
  --sapTile_Background: #ffffff;
  --sapGroup_TitleBackground: #ffffff;

  /* Status (semantic) */
  --sapPositiveColor: var(--sap-brand-green);
  --sapNegativeColor: var(--sap-brand-red);
  --sapCriticalColor: var(--sap-brand-orange);
  --sapInformativeColor: var(--sap-brand-blue);

  /* Typography */
  --sapFontFamily: var(--sap-font-major);
  --sapFontHeaderFamily: var(--sap-font-major);
}
```

- [ ] **Step 2: Commit**

```bash
git add theme/styles/horizon-mapping.css
git commit -m "feat: horizon-mapping aliases UI5 vars to brand tokens"
```

### Task 3.3: Slide-level styles

**Files:**

- Create: `theme/styles/slide-styles.css`

- [ ] **Step 1: Write slide styles**

`theme/styles/slide-styles.css`:

```css
/*
 * Deck-level spacing, typography, and transitions.
 * Component- and layout-specific styles live next to the Vue file.
 */

.slidev-layout {
  font-family: var(--sap-font-major);
  color: var(--sapTextColor);
  background-color: var(--sapBackgroundColor);
  padding: 3rem 4rem;
}

.slidev-layout h1,
.slidev-layout h2,
.slidev-layout h3 {
  font-family: var(--sap-font-major);
  font-weight: 700;
  color: var(--sap-brand-blue-darker);
  letter-spacing: -0.01em;
}

.slidev-layout h1 {
  font-size: 3.5rem;
  line-height: 1.1;
  margin-bottom: 1rem;
}
.slidev-layout h2 {
  font-size: 2.25rem;
  line-height: 1.2;
  margin-bottom: 0.75rem;
}
.slidev-layout h3 {
  font-size: 1.5rem;
  line-height: 1.3;
  margin-bottom: 0.5rem;
}

.slidev-layout p,
.slidev-layout li {
  font-size: 1.25rem;
  line-height: 1.5;
}

/* Footer area shared across most layouts */
.slidev-layout::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--sap-brand-blue), var(--sap-brand-teal));
}
```

- [ ] **Step 2: Commit**

```bash
git add theme/styles/slide-styles.css
git commit -m "feat: deck-level slide styles"
```

### Task 3.4: Theme TypeScript types

**Files:**

- Create: `theme/types.ts`

- [ ] **Step 1: Write shared types**

`theme/types.ts`:

```ts
export type SocialPlatform =
  | 'linkedin'
  | 'github'
  | 'twitter'
  | 'x'
  | 'mastodon'
  | 'bsky'
  | 'youtube'

export interface SocialLink {
  platform: SocialPlatform
  handle: string
  url?: string // optional override; otherwise built from platform + handle
}

export interface Presenter {
  slug: string
  name: string
  title: string
  photo?: string
  initials: string
  bio: string
  socials: SocialLink[]
  email?: string
}

export interface Team {
  slug: string
  name: string
  tagline?: string
  members: string[] // presenter slugs
}

export interface Program {
  slug: string
  tagline: string
  description: string
  engagementLinks: { label: string; url: string }[]
}

export interface Disclaimers {
  'forward-looking': string
  informational: string
  'safe-harbor': string
  [key: string]: string
}

export interface Event {
  name: string
  date: string
  venue?: string
  hashtag?: string
  defaultPresenter: string
}

export interface RoadmapPhase {
  label: string
  status: 'planned' | 'in-development' | 'available'
  items: string[]
}
```

- [ ] **Step 2: Commit**

```bash
git add theme/types.ts
git commit -m "feat: theme TypeScript types"
```

### Task 3.5: Slidev setup — register UI5 Web Components

**Files:**

- Create: `theme/setup/main.ts`

- [ ] **Step 1: Write the setup hook**

`theme/setup/main.ts`:

```ts
import { defineAppSetup } from '@slidev/types'

// Register the UI5 Web Components we use across slides.
// Selective imports keep the bundle small (~80–120 KB gzipped for ~5 components).
import '@ui5/webcomponents/dist/Card.js'
import '@ui5/webcomponents/dist/CardHeader.js'
import '@ui5/webcomponents/dist/Avatar.js'
import '@ui5/webcomponents/dist/Button.js'
import '@ui5/webcomponents/dist/Tag.js'
import '@ui5/webcomponents-fiori/dist/Timeline.js'
import '@ui5/webcomponents-fiori/dist/TimelineItem.js'

import { setTheme } from '@ui5/webcomponents-base/dist/config/Theme.js'

export default defineAppSetup(({ app: _app, router: _router }) => {
  // Force Horizon theme for UI5 Web Components.
  setTheme('sap_horizon')
})
```

- [ ] **Step 2: Update theme/index.ts to export setup**

`theme/index.ts`:

```ts
// Slidev theme entry. Slidev imports `setup/main.ts` automatically when
// it's at this path, but exporting metadata here keeps the contract explicit.
export {}
```

- [ ] **Step 3: Make sure the entry CSS is imported**

Slidev expects a theme to optionally provide a `style.css`. Create that as a thin re-export:

`theme/style.css`:

```css
@import './styles/index.css';
```

- [ ] **Step 4: Run dev server and check the browser**

Run: `npm run dev`
Expected: Slidev starts; placeholder `slides.md` renders. Open DevTools → Network tab and verify `72-Regular*.woff2` (from `@sap-theming`) loads. Inspect any `<h1>` and confirm computed color resolves to a value derived from `--sap-brand-blue-darker` (#00144A or similar).

> **If fonts don't load:** the `@sap-theming` font CSS uses URL-relative paths. Vite should resolve them via the `node_modules` path; if not, you may need a `vite.config.ts` `resolve.alias` for `@sap-theming`. Slidev exposes Vite config via `vite` field in front-matter or a `vite.config.ts` at root. Add only if needed.

- [ ] **Step 5: Commit**

```bash
git add theme/setup/main.ts theme/index.ts theme/style.css
git commit -m "feat: register UI5 Web Components and Horizon theme"
```

### Task 3.6: Smoke-test build produces working static site

**Files:** none modified.

- [ ] **Step 1: Build**

Run: `npm run build`
Expected: builds without errors into `dist/`. Output ends with the dist URL (e.g., `Page generated in /dist`).

- [ ] **Step 2: Serve and inspect**

Run: `npx serve dist`
Open the URL it prints (typically http://localhost:3000). The placeholder deck should render identically to dev mode, with brand styling.

- [ ] **Step 3: Stop servers**

Ctrl-C the serve process.

- [ ] **Step 4: Optional — commit if anything changed**

If `dist/` snuck into git (it shouldn't — `.gitignore` excludes it), remove and recommit. Otherwise no commit needed.

---

## Phase 2: Brand extraction script

Build `npm run extract-brand` — a Node script that unzips `SAP_Corp.potx`, parses theme XML, and emits CSS tokens, a layout manifest, and raw media. Test-first using Vitest.

### Task 2.1: Set up Vitest configuration

**Files:**

- Create: `vitest.config.ts`
- Create: `tests/.gitkeep`

- [ ] **Step 1: Write vitest.config.ts**

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts', 'scripts/**/*.test.ts'],
    environment: 'node',
    coverage: { provider: 'v8', reporter: ['text', 'html'] }
  }
})
```

- [ ] **Step 2: Create tests directory**

```bash
mkdir -p tests
touch tests/.gitkeep
```

- [ ] **Step 3: Verify Vitest runs (no tests yet)**

Run: `npm test`
Expected: Vitest reports "No test files found" — that's fine for now.

- [ ] **Step 4: Commit**

```bash
git add vitest.config.ts tests/.gitkeep
git commit -m "chore: configure Vitest"
```

### Task 2.2: POTX unzip helper (TDD)

**Files:**

- Create: `scripts/lib/unzip-potx.mjs`
- Create: `scripts/lib/unzip-potx.test.ts`

- [ ] **Step 1: Write the failing test**

`scripts/lib/unzip-potx.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { extractPotxToTemp, getPotxFile } from './unzip-potx.mjs'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

describe('unzip-potx', () => {
  it('extracts POTX into a tmp dir and returns its path', async () => {
    const tmp = await extractPotxToTemp(resolve('SAP_Corp.potx'))
    expect(existsSync(`${tmp}/ppt/theme/theme1.xml`)).toBe(true)
    expect(existsSync(`${tmp}/ppt/slideLayouts`)).toBe(true)
  })

  it('reads a single file from the POTX without full extraction', async () => {
    const xml = await getPotxFile(resolve('SAP_Corp.potx'), 'ppt/theme/theme1.xml')
    expect(xml).toContain('<a:theme')
    expect(xml.length).toBeGreaterThan(1000)
  })
})
```

- [ ] **Step 2: Run test — should fail because module doesn't exist**

Run: `npm test -- unzip-potx`
Expected: FAIL with "Cannot find module './unzip-potx.mjs'".

- [ ] **Step 3: Write minimal implementation**

`scripts/lib/unzip-potx.mjs`:

```js
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { createReadStream } from 'node:fs'
import unzipper from 'unzipper'

/**
 * Extract a POTX (zip) file into a fresh tmp directory.
 * Returns the absolute path of the tmp dir.
 */
export async function extractPotxToTemp(potxPath) {
  const dir = await mkdtemp(join(tmpdir(), 'potx-'))
  await new Promise((resolve, reject) => {
    createReadStream(potxPath)
      .pipe(unzipper.Extract({ path: dir }))
      .on('close', resolve)
      .on('error', reject)
  })
  return dir
}

/**
 * Read a single file from a POTX without extracting the whole archive.
 * Returns the file contents as a UTF-8 string.
 */
export async function getPotxFile(potxPath, innerPath) {
  const directory = await unzipper.Open.file(potxPath)
  const file = directory.files.find((f) => f.path === innerPath)
  if (!file) throw new Error(`POTX entry not found: ${innerPath}`)
  const buf = await file.buffer()
  return buf.toString('utf-8')
}
```

- [ ] **Step 4: Run test — should pass**

Run: `npm test -- unzip-potx`
Expected: PASS, both tests green.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/unzip-potx.mjs scripts/lib/unzip-potx.test.ts
git commit -m "feat: POTX unzip helper with tests"
```

### Task 2.3: Theme XML parser — color scheme (TDD)

**Files:**

- Create: `scripts/lib/parse-theme.mjs`
- Create: `scripts/lib/parse-theme.test.ts`

- [ ] **Step 1: Write the failing test**

`scripts/lib/parse-theme.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { parseThemeXml } from './parse-theme.mjs'
import { getPotxFile } from './unzip-potx.mjs'
import { resolve } from 'node:path'

describe('parse-theme', () => {
  it('extracts the SAP brand color palette from theme1.xml', async () => {
    const xml = await getPotxFile(resolve('SAP_Corp.potx'), 'ppt/theme/theme1.xml')
    const theme = parseThemeXml(xml)

    // SAP Horizon primary blue must be present
    expect(theme.colors).toContain('0070F2')
    // Should have at least 30 distinct colors (POTX has ~51)
    expect(theme.colors.length).toBeGreaterThanOrEqual(30)
    // No duplicates
    expect(new Set(theme.colors).size).toBe(theme.colors.length)
  })

  it('extracts the typeface name', async () => {
    const xml = await getPotxFile(resolve('SAP_Corp.potx'), 'ppt/theme/theme1.xml')
    const theme = parseThemeXml(xml)
    expect(theme.fonts.major).toMatch(/72/)
    expect(theme.fonts.minor).toMatch(/72/)
  })
})
```

- [ ] **Step 2: Run test — should fail**

Run: `npm test -- parse-theme`
Expected: FAIL with "Cannot find module".

- [ ] **Step 3: Write the parser**

`scripts/lib/parse-theme.mjs`:

```js
import { XMLParser } from 'fast-xml-parser'

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  removeNSPrefix: false
})

/**
 * Parse the theme1.xml content of a POTX.
 * Returns { colors: string[], fonts: { major: string, minor: string } }
 *
 * - colors: hex codes (uppercase, no '#') from <a:srgbClr val="..."/>
 * - fonts.major: <a:majorFont><a:latin typeface="..."/></a:majorFont>
 * - fonts.minor: <a:minorFont><a:latin typeface="..."/></a:minorFont>
 */
export function parseThemeXml(xml) {
  const matches = [...xml.matchAll(/<a:srgbClr\s+val="([0-9A-Fa-f]{6})"/g)]
  const colors = [...new Set(matches.map((m) => m[1].toUpperCase()))]

  const major = xml.match(/<a:majorFont>[\s\S]*?<a:latin\s+typeface="([^"]+)"/)?.[1] ?? ''
  const minor = xml.match(/<a:minorFont>[\s\S]*?<a:latin\s+typeface="([^"]+)"/)?.[1] ?? ''

  return { colors, fonts: { major, minor } }
}
```

> **Why regex over the XML parser here?** The PowerPoint XML is well-formed but namespace-prefixed in ways that make `fast-xml-parser` traversal verbose. For _flat extraction_ (find all colors, find one font name) regex is shorter and equally robust. We'll use `fast-xml-parser` properly in Task 2.4 where we need structured layout traversal.

- [ ] **Step 4: Run test — should pass**

Run: `npm test -- parse-theme`
Expected: PASS, both tests green.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/parse-theme.mjs scripts/lib/parse-theme.test.ts
git commit -m "feat: theme XML parser (colors + fonts)"
```

### Task 2.4: Slide-layout parser — names + geometry (TDD)

**Files:**

- Create: `scripts/lib/parse-layouts.mjs`
- Create: `scripts/lib/parse-layouts.test.ts`

- [ ] **Step 1: Write the failing test**

`scripts/lib/parse-layouts.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { extractAllLayouts } from './parse-layouts.mjs'
import { extractPotxToTemp } from './unzip-potx.mjs'
import { resolve } from 'node:path'

describe('parse-layouts', () => {
  it('extracts all 45 slide layouts from the POTX', async () => {
    const tmp = await extractPotxToTemp(resolve('SAP_Corp.potx'))
    const layouts = await extractAllLayouts(tmp)

    expect(layouts).toHaveLength(45)
    // Each layout has a name and an array of placeholders
    for (const l of layouts) {
      expect(typeof l.name).toBe('string')
      expect(Array.isArray(l.placeholders)).toBe(true)
      expect(l.file).toMatch(/slideLayout\d+\.xml/)
    }
    // Spot-check a few known names
    const names = layouts.map((l) => l.name)
    expect(names).toContain('Cover A')
    expect(names).toContain('Quote')
    expect(names).toContain('Q & A')
  })

  it('captures placeholder geometry in EMU', async () => {
    const tmp = await extractPotxToTemp(resolve('SAP_Corp.potx'))
    const layouts = await extractAllLayouts(tmp)
    const cover = layouts.find((l) => l.name === 'Cover A')
    expect(cover).toBeDefined()
    // Cover A should have at least one placeholder with x/y/cx/cy
    const ph = cover.placeholders.find((p) => p.x != null && p.cx != null)
    expect(ph).toBeDefined()
    expect(ph.x).toBeGreaterThanOrEqual(0)
    expect(ph.cx).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2: Run test — should fail**

Run: `npm test -- parse-layouts`
Expected: FAIL.

- [ ] **Step 3: Write the parser**

`scripts/lib/parse-layouts.mjs`:

```js
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { XMLParser } from 'fast-xml-parser'

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  removeNSPrefix: true,
  isArray: (name) => ['sp', 'pic'].includes(name)
})

/**
 * Read all slideLayoutN.xml files in <potxTmp>/ppt/slideLayouts/
 * and return [{ file, name, placeholders }].
 *
 * placeholder: { type, idx, x, y, cx, cy } in EMU (914400 per inch).
 */
export async function extractAllLayouts(potxTmp) {
  const dir = join(potxTmp, 'ppt', 'slideLayouts')
  const files = (await readdir(dir)).filter((f) => /^slideLayout\d+\.xml$/.test(f))
  files.sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]))

  const layouts = []
  for (const file of files) {
    const xml = await readFile(join(dir, file), 'utf-8')
    const parsed = parser.parse(xml)
    const layout = parsed.sldLayout ?? parsed['p:sldLayout']
    const cSld = layout?.cSld ?? layout?.['p:cSld']
    const name = cSld?.['@_name'] ?? ''
    const spTree = cSld?.spTree ?? cSld?.['p:spTree']
    const sps = spTree?.sp ?? []
    const placeholders = []
    for (const sp of sps) {
      const nvSpPr = sp.nvSpPr ?? {}
      const ph = nvSpPr.nvSpPr?.ph ?? nvSpPr.ph
      const xfrm = sp.spPr?.xfrm ?? {}
      const off = xfrm.off ?? {}
      const ext = xfrm.ext ?? {}
      placeholders.push({
        type: ph?.['@_type'] ?? 'body',
        idx: ph?.['@_idx'] ?? null,
        x: off['@_x'] != null ? Number(off['@_x']) : null,
        y: off['@_y'] != null ? Number(off['@_y']) : null,
        cx: ext['@_cx'] != null ? Number(ext['@_cx']) : null,
        cy: ext['@_cy'] != null ? Number(ext['@_cy']) : null
      })
    }
    layouts.push({ file, name, placeholders })
  }
  return layouts
}
```

> **PowerPoint XML quirk:** the structure varies by namespace and version. The `removeNSPrefix: true` flag normalizes `<p:sldLayout>` to `<sldLayout>`, but defensively we still check both forms. Inside `<sp>`, `<p:nvSpPr><p:nvSpPr><p:ph>` is the placeholder descriptor — note the doubled `nvSpPr`. The fallback chains in the code handle observed variations.

- [ ] **Step 4: Run test — should pass**

Run: `npm test -- parse-layouts`
Expected: PASS. If a name assertion fails, run `console.log(layouts.map(l => l.name))` once to see what's actually there and adjust the spot-check names — POTX layout names sometimes have HTML entities (`&amp;` → `&`).

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/parse-layouts.mjs scripts/lib/parse-layouts.test.ts
git commit -m "feat: slide-layout parser (names + placeholder geometry)"
```

### Task 2.5: Color crosswalk — hex → semantic name

**Files:**

- Create: `scripts/lib/color-crosswalk.mjs`
- Create: `scripts/lib/color-crosswalk.test.ts`

- [ ] **Step 1: Write the failing test**

`scripts/lib/color-crosswalk.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { resolveColorName, CROSSWALK } from './color-crosswalk.mjs'

describe('color-crosswalk', () => {
  it('maps known SAP brand hex codes to semantic names', () => {
    expect(resolveColorName('0070F2')).toBe('sap-brand-blue')
    expect(resolveColorName('1B90FF')).toBe('sap-brand-blue-bright')
    expect(resolveColorName('002A86')).toBe('sap-brand-blue-dark')
  })

  it('returns a synthetic name for unknown hex', () => {
    expect(resolveColorName('ABCDEF')).toBe('sap-color-abcdef')
  })

  it('crosswalk has no duplicate names', () => {
    const names = Object.values(CROSSWALK)
    expect(new Set(names).size).toBe(names.length)
  })
})
```

- [ ] **Step 2: Run test — should fail**

Run: `npm test -- color-crosswalk`
Expected: FAIL.

- [ ] **Step 3: Write the crosswalk**

`scripts/lib/color-crosswalk.mjs`:

```js
/**
 * Crosswalk from hex (uppercase, no '#') to semantic SAP color name.
 *
 * Sourced from the SAP Horizon palette as it appears in SAP_Corp.potx
 * (theme1.xml). When new brand colors land, add them here. Unknown hex
 * codes become `sap-color-<hex>` automatically (see resolveColorName).
 */
export const CROSSWALK = {
  // Primary blues
  '0070F2': 'sap-brand-blue',
  '1B90FF': 'sap-brand-blue-bright',
  '002A86': 'sap-brand-blue-dark',
  '00144A': 'sap-brand-blue-darker',
  '89D1FF': 'sap-brand-blue-light',
  D1EFFF: 'sap-brand-blue-pale',
  // Teals
  '049F9A': 'sap-brand-teal',
  '07838F': 'sap-brand-teal-dark',
  '02414C': 'sap-brand-teal-darker',
  '012931': 'sap-brand-teal-darkest',
  '2CE0BF': 'sap-brand-teal-bright',
  C2FCEE: 'sap-brand-teal-pale',
  // Greens
  188918: 'sap-brand-green',
  '36A41D': 'sap-brand-green-bright',
  164323: 'sap-brand-green-dark',
  '0E2B16': 'sap-brand-green-darkest',
  '97DD40': 'sap-brand-green-light',
  EBF5CB: 'sap-brand-green-pale',
  // Reds
  D20A0A: 'sap-brand-red',
  EE3939: 'sap-brand-red-bright',
  '5A0404': 'sap-brand-red-dark',
  350000: 'sap-brand-red-darkest',
  '6D1900': 'sap-brand-red-mid',
  '450B00': 'sap-brand-red-darker',
  // Oranges/yellows
  E76500: 'sap-brand-orange',
  C35500: 'sap-brand-orange-dark',
  F0AB00: 'sap-brand-yellow',
  // Magentas/pinks
  DF1278: 'sap-brand-pink',
  '71014B': 'sap-brand-pink-dark',
  510136: 'sap-brand-pink-darker',
  CC00DC: 'sap-brand-magenta',
  // Purples
  '5D36FF': 'sap-brand-purple',
  '7858FF': 'sap-brand-purple-bright',
  B894FF: 'sap-brand-purple-light',
  '28004A': 'sap-brand-purple-dark',
  '0E0637': 'sap-brand-purple-darker',
  '1C0C6E': 'sap-brand-purple-darkest',
  510080: 'sap-brand-purple-deep',
  E2D8FF: 'sap-brand-purple-pale',
  // Neutrals
  '000000': 'sap-black',
  FFFFFF: 'sap-white'
}

export function resolveColorName(hex) {
  const key = hex.toUpperCase()
  return CROSSWALK[key] ?? `sap-color-${key.toLowerCase()}`
}
```

> **Updating the crosswalk:** when a new POTX has colors not yet mapped, `extract-brand` will emit `sap-color-<hex>` tokens (still usable). Curate them into named entries in this file and re-run extract for clean semantic names.

- [ ] **Step 4: Run test — should pass**

Run: `npm test -- color-crosswalk`
Expected: PASS, all three tests green.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/color-crosswalk.mjs scripts/lib/color-crosswalk.test.ts
git commit -m "feat: color crosswalk (hex → semantic name)"
```

### Task 2.6: CSS token emitter (TDD)

**Files:**

- Create: `scripts/lib/emit-tokens.mjs`
- Create: `scripts/lib/emit-tokens.test.ts`

- [ ] **Step 1: Write the failing test**

`scripts/lib/emit-tokens.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { emitBrandTokensCss } from './emit-tokens.mjs'

describe('emit-tokens', () => {
  it('emits CSS custom properties for known colors', () => {
    const css = emitBrandTokensCss({
      colors: ['0070F2', '1B90FF', 'ABCDEF'],
      fonts: { major: '72 Brand', minor: '72 Brand' }
    })
    expect(css).toContain(':root {')
    expect(css).toContain('--sap-brand-blue: #0070F2;')
    expect(css).toContain('--sap-brand-blue-bright: #1B90FF;')
    expect(css).toContain('--sap-color-abcdef: #ABCDEF;')
    expect(css).toContain("--sap-font-major: '72 Brand'")
  })

  it('emits a header comment with metadata', () => {
    const css = emitBrandTokensCss({
      colors: ['0070F2'],
      fonts: { major: '72 Brand', minor: '72 Brand' },
      meta: { potxHash: 'abc123', date: '2026-06-13' }
    })
    expect(css).toContain('GENERATED')
    expect(css).toContain('abc123')
    expect(css).toContain('2026-06-13')
  })
})
```

- [ ] **Step 2: Run test — should fail**

Run: `npm test -- emit-tokens`
Expected: FAIL.

- [ ] **Step 3: Implement**

`scripts/lib/emit-tokens.mjs`:

```js
import { resolveColorName } from './color-crosswalk.mjs'

/**
 * Emit a brand-tokens.css string from extracted theme data.
 * Input: { colors: string[], fonts: { major, minor }, meta?: { potxHash, date } }
 * Output: a CSS string defining :root custom properties.
 */
export function emitBrandTokensCss({ colors, fonts, meta = {} }) {
  const { potxHash = '(unknown)', date = '(unknown)' } = meta
  const lines = []

  lines.push('/* GENERATED by scripts/extract-brand.mjs — do not edit by hand. */')
  lines.push(`/* POTX hash: ${potxHash}  |  extracted: ${date} */`)
  lines.push('')
  lines.push(':root {')

  // Colors
  for (const hex of colors) {
    const name = resolveColorName(hex)
    lines.push(`  --${name}: #${hex.toUpperCase()};`)
  }

  // Fonts (single-quoted to handle names with spaces)
  lines.push('')
  lines.push(`  --sap-font-major: '${fonts.major}', 'Helvetica Neue', Arial, sans-serif;`)
  lines.push(`  --sap-font-minor: '${fonts.minor}', 'Helvetica Neue', Arial, sans-serif;`)

  // Common deck-level radii / shadows derived from Horizon defaults — fixed for now.
  lines.push('')
  lines.push('  --sap-radius-card: 0.5rem;')
  lines.push('  --sap-radius-button: 0.25rem;')
  lines.push('  --sap-shadow-card: 0 1px 4px rgba(0, 0, 0, 0.08);')

  lines.push('}')
  lines.push('')
  return lines.join('\n')
}
```

- [ ] **Step 4: Run test — should pass**

Run: `npm test -- emit-tokens`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/emit-tokens.mjs scripts/lib/emit-tokens.test.ts
git commit -m "feat: CSS token emitter"
```

### Task 2.7: Media extractor (POTX → raw files)

**Files:**

- Create: `scripts/lib/extract-media.mjs`
- Create: `scripts/lib/extract-media.test.ts`

- [ ] **Step 1: Write the failing test**

`scripts/lib/extract-media.test.ts`:

```ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { extractMedia } from './extract-media.mjs'
import { extractPotxToTemp } from './unzip-potx.mjs'
import { mkdtemp, rm, readdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

describe('extract-media', () => {
  let potxTmp: string
  let outDir: string

  beforeAll(async () => {
    potxTmp = await extractPotxToTemp(resolve('SAP_Corp.potx'))
    outDir = await mkdtemp(join(tmpdir(), 'media-out-'))
  })

  afterAll(async () => {
    await rm(outDir, { recursive: true, force: true })
  })

  it('copies all media files from POTX into output dir', async () => {
    const result = await extractMedia(potxTmp, outDir)
    expect(result.count).toBeGreaterThan(50) // POTX has 70+ media files
    const files = await readdir(outDir)
    expect(files.length).toBe(result.count)
    expect(files.some((f) => f.endsWith('.png') || f.endsWith('.svg'))).toBe(true)
  })

  it('returns a manifest with file hashes', async () => {
    const result = await extractMedia(potxTmp, outDir)
    expect(result.manifest).toBeInstanceOf(Array)
    expect(result.manifest[0]).toHaveProperty('file')
    expect(result.manifest[0]).toHaveProperty('sha256')
    expect(result.manifest[0].sha256).toMatch(/^[0-9a-f]{64}$/)
  })
})
```

- [ ] **Step 2: Run test — should fail**

Run: `npm test -- extract-media`
Expected: FAIL.

- [ ] **Step 3: Implement**

`scripts/lib/extract-media.mjs`:

```js
import { readdir, copyFile, readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { join } from 'node:path'

/**
 * Copy every file in <potxTmp>/ppt/media/ into <outDir>.
 * Returns { count, manifest: [{ file, sha256 }] } for change-detection.
 */
export async function extractMedia(potxTmp, outDir) {
  const mediaDir = join(potxTmp, 'ppt', 'media')
  const files = await readdir(mediaDir)
  const manifest = []
  for (const file of files) {
    const src = join(mediaDir, file)
    const dst = join(outDir, file)
    await copyFile(src, dst)
    const buf = await readFile(src)
    const sha256 = createHash('sha256').update(buf).digest('hex')
    manifest.push({ file, sha256 })
  }
  return { count: files.length, manifest }
}
```

- [ ] **Step 4: Run test — should pass**

Run: `npm test -- extract-media`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/extract-media.mjs scripts/lib/extract-media.test.ts
git commit -m "feat: media extractor with SHA-256 manifest"
```

### Task 2.8: Top-level extract-brand.mjs orchestrator

**Files:**

- Create: `scripts/extract-brand.mjs`

- [ ] **Step 1: Write the orchestrator**

`scripts/extract-brand.mjs`:

```js
#!/usr/bin/env node
/**
 * extract-brand.mjs — POTX → theme/styles/_extracted/ + theme/styles/_extracted/media/raw/
 *
 * Usage: node scripts/extract-brand.mjs [--potx <path>]
 * Default POTX: ./SAP_Corp.potx
 *
 * Outputs:
 *   theme/styles/_extracted/brand-tokens.css       (CSS custom properties)
 *   theme/styles/_extracted/layouts.json           (layout names + placeholder geometry)
 *   theme/styles/_extracted/media/raw/*            (every PNG/SVG from the POTX)
 *   theme/styles/_extracted/README.md              (extraction metadata)
 *   theme/public/logos/manifest.yaml               (logo curation stub — only on first run)
 *
 * Also bumps package.json#brandVersion if colors or fonts changed.
 */

import { readFile, writeFile, mkdir, rm, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { extractPotxToTemp, getPotxFile } from './lib/unzip-potx.mjs'
import { parseThemeXml } from './lib/parse-theme.mjs'
import { extractAllLayouts } from './lib/parse-layouts.mjs'
import { extractMedia } from './lib/extract-media.mjs'
import { emitBrandTokensCss } from './lib/emit-tokens.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const POTX = process.argv.includes('--potx')
  ? process.argv[process.argv.indexOf('--potx') + 1]
  : resolve(ROOT, 'SAP_Corp.potx')

const OUT_DIR = resolve(ROOT, 'theme/styles/_extracted')
const OUT_MEDIA = resolve(OUT_DIR, 'media/raw')
const OUT_LOGOS_MANIFEST = resolve(ROOT, 'theme/public/logos/manifest.yaml')

async function fileSha256(p) {
  const buf = await readFile(p)
  return createHash('sha256').update(buf).digest('hex')
}

async function main() {
  if (!existsSync(POTX)) {
    console.error(`POTX not found: ${POTX}`)
    process.exit(1)
  }

  console.log(`Extracting from: ${POTX}`)
  const potxHash = await fileSha256(POTX)
  const date = new Date().toISOString().slice(0, 10)

  // Clean and recreate output dirs
  await rm(OUT_DIR, { recursive: true, force: true })
  await mkdir(OUT_MEDIA, { recursive: true })

  // 1. Unzip
  const potxTmp = await extractPotxToTemp(POTX)

  // 2. Theme: colors + fonts
  const themeXml = await getPotxFile(POTX, 'ppt/theme/theme1.xml')
  const theme = parseThemeXml(themeXml)
  console.log(`  ${theme.colors.length} colors  |  major font: ${theme.fonts.major}`)

  // 3. Layouts: names + geometry
  const layouts = await extractAllLayouts(potxTmp)
  console.log(`  ${layouts.length} slide layouts`)

  // 4. Media
  const media = await extractMedia(potxTmp, OUT_MEDIA)
  console.log(`  ${media.count} media files`)

  // 5. Emit brand-tokens.css
  const css = emitBrandTokensCss({
    colors: theme.colors,
    fonts: theme.fonts,
    meta: { potxHash, date }
  })
  await writeFile(resolve(OUT_DIR, 'brand-tokens.css'), css, 'utf-8')

  // 6. Emit layouts.json
  await writeFile(
    resolve(OUT_DIR, 'layouts.json'),
    JSON.stringify({ extractedAt: date, potxHash, layouts }, null, 2),
    'utf-8'
  )

  // 7. Emit metadata README
  const readme = [
    '# Extracted brand assets',
    '',
    `**Extracted:** ${date}`,
    `**Source POTX:** \`SAP_Corp.potx\``,
    `**POTX SHA-256:** \`${potxHash}\``,
    `**Major font:** \`${theme.fonts.major}\``,
    `**Color count:** ${theme.colors.length}`,
    `**Layout count:** ${layouts.length}`,
    `**Media files:** ${media.count}`,
    '',
    'Do not edit files in this directory by hand. Re-run `npm run extract-brand` after replacing `SAP_Corp.potx`.',
    ''
  ].join('\n')
  await writeFile(resolve(OUT_DIR, 'README.md'), readme, 'utf-8')

  // 8. Stub logos/manifest.yaml on first run
  if (!existsSync(OUT_LOGOS_MANIFEST)) {
    const stub = [
      '# Curate role names for each media file extracted from the POTX.',
      '# Files unchanged across extractions keep their roles automatically.',
      '#',
      '# Recommended roles:',
      '#   logo-sap-primary, logo-sap-monochrome, logo-sap-white',
      '#   icon-<name>, illustration-<name>',
      '',
      ...media.manifest.map((m) => `${m.file}:\n  sha256: ${m.sha256}\n  role: ""`)
    ].join('\n')
    await writeFile(OUT_LOGOS_MANIFEST, stub, 'utf-8')
    console.log(`  wrote stub: ${OUT_LOGOS_MANIFEST}`)
  } else {
    console.log(`  logo manifest exists (not overwriting): ${OUT_LOGOS_MANIFEST}`)
  }

  // 9. Verify @sap-theming font alignment (warning only)
  const expectedFont = '72'
  if (!theme.fonts.major.includes(expectedFont)) {
    console.warn(
      `WARNING: POTX major font "${theme.fonts.major}" does not contain "${expectedFont}".`
    )
    console.warn('@sap-theming/theming-base-content ships the "72" web font; verify alignment.')
  }

  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
```

- [ ] **Step 2: Run the script**

Run: `npm run extract-brand`
Expected output (paraphrased):

```
Extracting from: D:\projects\presentation-template\SAP_Corp.potx
  51 colors  |  major font: 72 Brand
  45 slide layouts
  73 media files
  wrote stub: theme/public/logos/manifest.yaml
Done.
```

- [ ] **Step 3: Verify outputs exist**

Run: `ls theme/styles/_extracted/`
Expected: `README.md`, `brand-tokens.css`, `layouts.json`, `media/`.

Run: `head -20 theme/styles/_extracted/brand-tokens.css`
Expected: header comments + `:root {` + `--sap-brand-blue: #0070F2;` near the top.

- [ ] **Step 4: Commit generated files** (per spec — generated outputs are committed for diff visibility)

```bash
git add theme/styles/_extracted/ theme/public/logos/manifest.yaml scripts/extract-brand.mjs
git commit -m "feat: brand extraction pipeline (POTX → tokens + layouts + media)"
```

### Task 2.9: Curate the logo manifest (manual one-time pass)

**Files:**

- Modify: `theme/public/logos/manifest.yaml`

- [ ] **Step 1: Inspect extracted media**

Run: `ls theme/styles/_extracted/media/raw/`
Expected: ~73 files. Open a few PNGs/SVGs (e.g., in VS Code's image preview) to identify which are SAP logos.

- [ ] **Step 2: Curate roles**

Edit `theme/public/logos/manifest.yaml` and fill `role:` for files you identify. Common candidates:

- The primary blue SAP logo → `role: logo-sap-primary`
- A white-on-transparent variant → `role: logo-sap-white`
- A monochrome black variant → `role: logo-sap-monochrome`

Files you can't identify or don't need can be left with empty `role:` (they'll still be extracted on subsequent runs but aren't surfaced via `<Logo>`).

> **Tip:** open `theme/styles/_extracted/media/raw/` in your file explorer and use thumbnail view. The SAP logo is a recognizable wordmark in blue.

- [ ] **Step 3: Commit**

```bash
git add theme/public/logos/manifest.yaml
git commit -m "chore: curate logo manifest roles"
```

### Task 2.10: Smoke-test the extraction is reproducible

**Files:** none modified.

- [ ] **Step 1: Re-run extraction**

Run: `npm run extract-brand`
Expected: completes without errors. The "logo manifest exists (not overwriting)" message appears.

- [ ] **Step 2: Verify no spurious diff**

Run: `git status`
Expected: clean working tree (or only `theme/styles/_extracted/README.md` if the date changed). No stray changes to `brand-tokens.css` or `layouts.json`.

If `brand-tokens.css` or `layouts.json` show diffs across runs with the same POTX, that indicates non-determinism in the script — investigate before continuing.

- [ ] **Step 3: If only README.md changed (date), commit**

```bash
git add theme/styles/_extracted/README.md
git commit -m "chore: refresh extraction metadata"
```

(or skip this step if there's no diff)

---

## Phase 1: Project scaffolding

Set up Node 22, TypeScript, npm workspaces (root + `theme/`), ESLint, Prettier, and a minimal Slidev project. End state: `npm run dev` opens an empty Slidev deck.

### Task 1.1: Pin Node version

**Files:**

- Create: `.nvmrc`
- Create: `.node-version`

- [ ] **Step 1: Write the version files**

`.nvmrc` content: `22`

`.node-version` content (same): `22`

- [ ] **Step 2: Verify Node 22 is active**

Run: `node --version`
Expected: `v22.x.x` (any v22 patch). If not, install Node 22 via nvm/fnm/Volta before continuing.

- [ ] **Step 3: Commit**

```bash
git add .nvmrc .node-version
git commit -m "chore: pin Node 22"
```

### Task 1.2: Root package.json with workspaces

**Files:**

- Create: `package.json`
- Modify: `.gitignore`

- [ ] **Step 1: Write the root package.json**

```json
{
  "name": "sap-presentation-template",
  "version": "0.1.0",
  "brandVersion": "2024.1",
  "private": true,
  "type": "module",
  "engines": { "node": ">=22" },
  "workspaces": ["theme"],
  "scripts": {
    "dev": "slidev",
    "build": "slidev build",
    "export": "slidev export",
    "extract-brand": "node scripts/extract-brand.mjs",
    "import-pptx": "node scripts/import-pptx.mjs",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:visual": "playwright test",
    "test:visual:update": "playwright test --update-snapshots",
    "lint": "eslint . && prettier --check .",
    "format": "prettier --write ."
  },
  "dependencies": {
    "@slidev/cli": "^0.49.0",
    "@slidev/theme-default": "^0.25.0",
    "@sap-theming/theming-base-content": "^11.20.0",
    "@ui5/webcomponents": "^2.5.0",
    "@ui5/webcomponents-fiori": "^2.5.0",
    "qrcode": "^1.5.4",
    "vue": "^3.5.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.48.0",
    "@rollup/plugin-yaml": "^4.1.2",
    "@types/node": "^22.0.0",
    "@types/qrcode": "^1.5.5",
    "eslint": "^9.0.0",
    "eslint-plugin-vue": "^9.30.0",
    "fast-xml-parser": "^4.5.0",
    "prettier": "^3.3.0",
    "typescript": "^5.6.0",
    "unzipper": "^0.12.0",
    "vitest": "^2.1.0"
  }
}
```

> **Note on versions:** these are floors known to work together as of mid-2026. `npm install` will resolve to current patches. If a major version has shipped that breaks integration, pin to the last known-good major and note it in CHANGELOG.

- [ ] **Step 2: Run install**

Run: `npm install`
Expected: success, generates `package-lock.json` and `node_modules/`. Peer-dep warnings from `@slidev/*` are OK; errors are not.

- [ ] **Step 3: Append to .gitignore**

Append these lines to `.gitignore`:

```
node_modules/
dist/
.vite/
*.log
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json .gitignore
git commit -m "chore: scaffold root package with npm workspaces"
```

### Task 1.3: Theme workspace package skeleton

**Files:**

- Create: `theme/package.json`
- Create: `theme/index.ts`

- [ ] **Step 1: Write theme/package.json**

```json
{
  "name": "slidev-theme-sap",
  "version": "0.1.0",
  "description": "SAP-branded Slidev theme with Fiori Horizon look-and-feel",
  "type": "module",
  "main": "./index.ts",
  "exports": {
    ".": "./index.ts",
    "./styles/*": "./styles/*",
    "./layouts/*": "./layouts/*",
    "./components/*": "./components/*"
  },
  "files": ["index.ts", "layouts", "components", "styles", "setup", "public"],
  "slidev": {
    "colorSchema": "light",
    "highlighter": "shiki"
  },
  "peerDependencies": {
    "@slidev/cli": "^0.49.0",
    "vue": "^3.5.0"
  }
}
```

- [ ] **Step 2: Write a placeholder theme/index.ts**

```ts
// Placeholder — filled in during Phase 3 (theme foundation).
export {}
```

- [ ] **Step 3: Verify workspace resolution**

Run: `npm ls slidev-theme-sap`
Expected: shows `slidev-theme-sap@0.1.0 -> theme` linked from the workspace root.

- [ ] **Step 4: Commit**

```bash
git add theme/package.json theme/index.ts
git commit -m "chore: add theme workspace package skeleton"
```

### Task 1.4: TypeScript configuration

**Files:**

- Create: `tsconfig.json`
- Create: `theme/tsconfig.json`

- [ ] **Step 1: Write root tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["node", "vite/client"],
    "paths": {
      "slidev-theme-sap": ["./theme/index.ts"],
      "slidev-theme-sap/*": ["./theme/*"]
    }
  },
  "include": ["theme/**/*", "scripts/**/*", "tests/**/*", "*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 2: Write theme/tsconfig.json**

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": { "rootDir": "." },
  "include": ["**/*.ts", "**/*.vue", "**/*.tsx"]
}
```

- [ ] **Step 3: Verify type-check passes**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add tsconfig.json theme/tsconfig.json
git commit -m "chore: add TypeScript configuration"
```

### Task 1.5: ESLint + Prettier + EditorConfig

**Files:**

- Create: `eslint.config.js`
- Create: `.prettierrc.json`
- Create: `.prettierignore`
- Create: `.editorconfig`

- [ ] **Step 1: Write eslint.config.js**

```js
import js from '@eslint/js'
import vue from 'eslint-plugin-vue'

export default [
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { console: 'readonly', process: 'readonly' }
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  },
  { ignores: ['dist/', 'node_modules/', 'theme/styles/_extracted/', '.vite/'] }
]
```

- [ ] **Step 2: Write .prettierrc.json**

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "none",
  "printWidth": 100,
  "vueIndentScriptAndStyle": true
}
```

- [ ] **Step 3: Write .prettierignore**

```
node_modules/
dist/
package-lock.json
theme/styles/_extracted/
public/imported/
tests/__screenshots__/
SAP_Corp.potx
*.png
*.jpg
*.jpeg
*.svg
*.woff2
```

- [ ] **Step 4: Write .editorconfig**

```ini
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
```

- [ ] **Step 5: Verify lint passes**

Run: `npm run lint`
Expected: passes (0 errors). If Prettier reports formatting issues on existing JSON, run `npm run format` once and re-check.

- [ ] **Step 6: Commit**

```bash
git add eslint.config.js .prettierrc.json .prettierignore .editorconfig
git commit -m "chore: add ESLint + Prettier + EditorConfig"
```

### Task 1.6: Minimal slides.md so dev server starts

**Files:**

- Create: `slides.md`

- [ ] **Step 1: Write a placeholder slides.md**

```markdown
---
theme: ./theme
title: Sample Deck
info: |
  Replace this with your talk metadata.
  See README.md for setup.
---

# Sample Deck

This deck will be rebuilt later. For now, it just verifies Slidev can load the theme workspace.

---

## Hello, world

Phase 1 complete.
```

- [ ] **Step 2: Run dev server to verify wiring**

Run: `npm run dev`
Expected: Slidev starts on `http://localhost:3030`; both slides render. The theme is bare (no SAP branding yet — that's Phase 3). Stop with Ctrl-C.

> **If the theme errors:** the placeholder `theme/index.ts` may need a minimal default export. Check Slidev docs for the current theme contract; Slidev 0.49 accepts an empty theme module as long as `theme/package.json` has the `slidev` field.

- [ ] **Step 3: Commit**

```bash
git add slides.md
git commit -m "feat: placeholder slides.md to verify dev server"
```

### Task 1.7: Pre-create extraction and logo directories

**Files:**

- Create: `theme/styles/_extracted/.gitkeep`
- Create: `theme/styles/_extracted/media/raw/.gitkeep`
- Create: `theme/public/logos/.gitkeep`

- [ ] **Step 1: Verify POTX is at repo root**

Run: `ls SAP_Corp.potx`
Expected: file exists, ~6 MB.

- [ ] **Step 2: Create directories with .gitkeep**

```bash
mkdir -p theme/styles/_extracted/media/raw
mkdir -p theme/public/logos
touch theme/styles/_extracted/.gitkeep
touch theme/styles/_extracted/media/raw/.gitkeep
touch theme/public/logos/.gitkeep
```

- [ ] **Step 3: Commit**

```bash
git add theme/styles/_extracted/.gitkeep theme/styles/_extracted/media/raw/.gitkeep theme/public/logos/.gitkeep
git commit -m "chore: pre-create theme extraction and logo dirs"
```

---

## Phase 7: Secondary components

The remaining seven components: Roadmap, QRCode, Logo, DemoCallout, CodeBlock, KeyTakeaway. Components with logic get unit tests.

### Task 7.1: Logo component

**Files:**

- Create: `theme/components/Logo.vue`

- [ ] **Step 1: Plan logo asset placement**

UI5 manifest entries reference files inside `theme/styles/_extracted/media/raw/`, but only files under `theme/public/` are served as static assets at the root URL. Simplest approach for v1: hand-copy curated logos from `_extracted/media/raw/` into `theme/public/logos/<role>.<ext>` once, and have `<Logo>` reference `/logos/<role>.<ext>`.

- [ ] **Step 2: Inspect and copy SAP logos**

Inspect SVG/PNG files in `theme/styles/_extracted/media/raw/`. Identify the SAP wordmark variants (typically blue, white, monochrome) and copy:

```bash
# Adjust source filenames once identified
cp theme/styles/_extracted/media/raw/<sap-blue>.svg theme/public/logos/logo-sap-primary.svg
cp theme/styles/_extracted/media/raw/<sap-white>.svg theme/public/logos/logo-sap-white.svg
cp theme/styles/_extracted/media/raw/<sap-mono>.svg theme/public/logos/logo-sap-monochrome.svg
```

- [ ] **Step 3: Write the component**

`theme/components/Logo.vue`:

```vue
<script setup lang="ts">
  const props = defineProps<{
    variant?: string
    alt?: string
    ext?: 'svg' | 'png'
  }>()
  const variant = props.variant ?? 'logo-sap-primary'
  const ext = props.ext ?? 'svg'
  const src = `/logos/${variant}.${ext}`
</script>

<template>
  <img :src="src" :alt="alt ?? variant" class="sap-logo" />
</template>

<style scoped>
  .sap-logo {
    height: 2.5rem;
    width: auto;
  }
</style>
```

- [ ] **Step 4: Commit**

```bash
git add theme/components/Logo.vue theme/public/logos/
git commit -m "feat(component): Logo (reads from theme/public/logos/)"
```

### Task 7.2: QRCode component (TDD logic)

**Files:**

- Create: `theme/setup/qrcode.ts`
- Create: `theme/setup/qrcode.test.ts`
- Create: `theme/components/QRCode.vue`

- [ ] **Step 1: Test the data-URL generator helper**

`theme/setup/qrcode.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { makeQrDataUrl } from './qrcode'

describe('makeQrDataUrl', () => {
  it('returns a data:image/png URL for a valid URL', async () => {
    const url = await makeQrDataUrl('https://sap.com', 100)
    expect(url).toMatch(/^data:image\/png;base64,/)
    expect(url.length).toBeGreaterThan(200)
  })
})
```

- [ ] **Step 2: Implement the helper**

`theme/setup/qrcode.ts`:

```ts
import QR from 'qrcode'

export async function makeQrDataUrl(url: string, size = 200): Promise<string> {
  return QR.toDataURL(url, { width: size, margin: 1 })
}
```

- [ ] **Step 3: Run — passes**

Run: `npm test -- qrcode`
Expected: PASS.

- [ ] **Step 4: Write the Vue component**

`theme/components/QRCode.vue`:

```vue
<script setup lang="ts">
  import { ref, watchEffect } from 'vue'
  import { makeQrDataUrl } from '../setup/qrcode'

  const props = defineProps<{ url: string; caption?: string; size?: number }>()
  const dataUrl = ref<string>('')

  watchEffect(async () => {
    dataUrl.value = await makeQrDataUrl(props.url, props.size ?? 200)
  })
</script>

<template>
  <figure class="qrcode">
    <img v-if="dataUrl" :src="dataUrl" :alt="`QR code: ${url}`" :width="size ?? 200" />
    <figcaption v-if="caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
  .qrcode {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  .qrcode img {
    border-radius: var(--sap-radius-button);
  }
  .qrcode figcaption {
    font-size: 0.9rem;
    color: var(--sapContent_LabelColor);
  }
</style>
```

- [ ] **Step 5: Commit**

```bash
git add theme/components/QRCode.vue theme/setup/qrcode.ts theme/setup/qrcode.test.ts
git commit -m "feat(component): QRCode"
```

### Task 7.3: DemoCallout component

**Files:**

- Create: `theme/components/DemoCallout.vue`

- [ ] **Step 1: Write the component**

`theme/components/DemoCallout.vue`:

```vue
<script setup lang="ts">
  const props = defineProps<{ kind?: 'live' | 'recorded' | 'interactive'; fallback?: string }>()
  const kind = props.kind ?? 'live'
  const labels = { live: 'Live Demo', recorded: 'Recorded Demo', interactive: 'Try it Yourself' }
  const icons = { live: '🎬', recorded: '📹', interactive: '🖱️' }
</script>

<template>
  <div :class="['demo-callout', `demo-callout--${kind}`]">
    <span class="icon">{{ icons[kind] }}</span>
    <span class="label">{{ labels[kind] }}</span>
    <slot />
    <p v-if="fallback" class="fallback">If the demo gods are unkind: {{ fallback }}</p>
  </div>
</template>

<style scoped>
  .demo-callout {
    display: inline-flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.75rem 1rem;
    border-radius: var(--sap-radius-card);
    background: var(--sap-brand-blue);
    color: #fff;
    font-weight: 600;
    box-shadow: var(--sap-shadow-card);
  }
  .demo-callout--recorded {
    background: var(--sap-brand-purple);
  }
  .demo-callout--interactive {
    background: var(--sap-brand-green);
  }
  .icon {
    font-size: 1.5rem;
  }
  .label {
    font-size: 1.25rem;
  }
  .fallback {
    font-size: 0.85rem;
    opacity: 0.85;
    font-weight: 400;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add theme/components/DemoCallout.vue
git commit -m "feat(component): DemoCallout"
```

### Task 7.4: CodeBlock component

**Files:**

- Create: `theme/components/CodeBlock.vue`

- [ ] **Step 1: Write the component**

`theme/components/CodeBlock.vue`:

```vue
<script setup lang="ts">
  defineProps<{
    lang?: string
    filename?: string
    caption?: string
    highlight?: string
  }>()
</script>

<template>
  <figure class="codeblock">
    <header v-if="filename || lang" class="codeblock-header">
      <span v-if="filename" class="filename">{{ filename }}</span>
      <span v-if="lang" class="lang">{{ lang }}</span>
    </header>
    <div class="codeblock-body">
      <slot />
    </div>
    <figcaption v-if="caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
  .codeblock {
    margin: 0;
    border-radius: var(--sap-radius-card);
    overflow: hidden;
    border: 1px solid #e5e9ed;
    box-shadow: var(--sap-shadow-card);
    background: #fff;
  }
  .codeblock-header {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    background: var(--sap-brand-blue-darker);
    color: #fff;
    font-size: 0.85rem;
  }
  .filename {
    font-family: monospace;
  }
  .lang {
    opacity: 0.8;
    text-transform: uppercase;
  }
  .codeblock-body :deep(pre) {
    margin: 0;
    padding: 1rem;
  }
  .codeblock figcaption {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    color: var(--sapContent_LabelColor);
    background: #fafbfc;
  }
</style>
```

> **Usage:** wrap a Markdown fenced code block with the component. The fenced block is rendered by Slidev's built-in Shiki highlighter; we just provide chrome.

- [ ] **Step 2: Commit**

```bash
git add theme/components/CodeBlock.vue
git commit -m "feat(component): CodeBlock"
```

### Task 7.5: KeyTakeaway component

**Files:**

- Create: `theme/components/KeyTakeaway.vue`

- [ ] **Step 1: Write the component**

`theme/components/KeyTakeaway.vue`:

```vue
<template>
  <aside class="key-takeaway">
    <header>Key takeaway</header>
    <div class="content"><slot /></div>
  </aside>
</template>

<style scoped>
  .key-takeaway {
    border-left: 6px solid var(--sap-brand-blue);
    padding: 1.25rem 1.5rem;
    background: linear-gradient(90deg, var(--sap-brand-blue-pale), transparent);
    border-radius: 0 var(--sap-radius-card) var(--sap-radius-card) 0;
    max-width: 56rem;
    margin: 1.5rem 0;
  }
  .key-takeaway header {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--sap-brand-blue);
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  .key-takeaway .content {
    font-size: 1.5rem;
    line-height: 1.4;
    color: var(--sapTextColor);
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add theme/components/KeyTakeaway.vue
git commit -m "feat(component): KeyTakeaway"
```

### Task 7.6: Roadmap component (TDD logic + auto-disclaimer)

**Files:**

- Create: `theme/components/Roadmap.vue`
- Create: `theme/components/Roadmap.test.ts`
- Modify: `vitest.config.ts`
- Modify: `package.json` (add Vue test deps)

- [ ] **Step 1: Add Vue test dependencies**

```bash
npm install -D @vue/test-utils @vitejs/plugin-vue happy-dom
```

- [ ] **Step 2: Update vitest.config.ts**

```ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    include: ['tests/**/*.test.ts', 'scripts/**/*.test.ts', 'theme/**/*.test.ts'],
    environment: 'happy-dom',
    coverage: { provider: 'v8', reporter: ['text', 'html'] }
  }
})
```

- [ ] **Step 3: Write the failing test**

`theme/components/Roadmap.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('./Disclaimer.vue', () => ({
  default: {
    name: 'Disclaimer',
    template: '<div data-testid="disclaimer">{{ kind }}</div>',
    props: ['kind']
  }
}))

import Roadmap from './Roadmap.vue'

describe('Roadmap', () => {
  const phases = [
    { label: 'Q3 2025', status: 'planned' as const, items: ['feature A'] },
    { label: 'Q4 2025', status: 'available' as const, items: ['feature B'] }
  ]

  it('renders phases', () => {
    const wrapper = mount(Roadmap, { props: { phases } })
    expect(wrapper.text()).toContain('Q3 2025')
    expect(wrapper.text()).toContain('feature A')
  })

  it('auto-includes forward-looking disclaimer by default', () => {
    const wrapper = mount(Roadmap, { props: { phases } })
    const d = wrapper.find('[data-testid="disclaimer"]')
    expect(d.exists()).toBe(true)
    expect(d.text()).toBe('forward-looking')
  })

  it('suppresses disclaimer when suppressDisclaimer=true', () => {
    const wrapper = mount(Roadmap, { props: { phases, suppressDisclaimer: true } })
    expect(wrapper.find('[data-testid="disclaimer"]').exists()).toBe(false)
  })
})
```

- [ ] **Step 4: Run — should fail**

Run: `npm test -- Roadmap`
Expected: FAIL (cannot resolve Roadmap.vue).

- [ ] **Step 5: Implement Roadmap.vue**

`theme/components/Roadmap.vue`:

```vue
<script setup lang="ts">
  import type { RoadmapPhase } from '../types'
  import Disclaimer from './Disclaimer.vue'

  defineProps<{
    phases: RoadmapPhase[]
    suppressDisclaimer?: boolean
  }>()
</script>

<template>
  <div class="roadmap">
    <div class="phases">
      <div v-for="phase in phases" :key="phase.label" :class="['phase', `phase--${phase.status}`]">
        <header>
          <span class="label">{{ phase.label }}</span>
          <span class="status">{{ phase.status }}</span>
        </header>
        <ul>
          <li v-for="item in phase.items" :key="item">{{ item }}</li>
        </ul>
      </div>
    </div>
    <Disclaimer v-if="!suppressDisclaimer" kind="forward-looking" />
  </div>
</template>

<style scoped>
  .roadmap {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  .phases {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
    gap: 1rem;
  }
  .phase {
    border: 1px solid #e5e9ed;
    border-radius: var(--sap-radius-card);
    padding: 1rem;
    background: #fff;
  }
  .phase--planned {
    border-left: 4px solid var(--sap-brand-orange);
  }
  .phase--in-development {
    border-left: 4px solid var(--sap-brand-blue);
  }
  .phase--available {
    border-left: 4px solid var(--sap-brand-green);
  }
  .phase header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 0.5rem;
  }
  .label {
    font-weight: 700;
    font-size: 1.1rem;
  }
  .status {
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    color: var(--sapContent_LabelColor);
  }
  .phase ul {
    padding-left: 1.25rem;
    margin: 0;
  }
  .phase li {
    font-size: 0.95rem;
    line-height: 1.5;
  }
</style>
```

- [ ] **Step 6: Run — passes**

Run: `npm test -- Roadmap`
Expected: PASS, all three tests green.

- [ ] **Step 7: Commit**

```bash
git add theme/components/Roadmap.vue theme/components/Roadmap.test.ts vitest.config.ts package.json package-lock.json
git commit -m "feat(component): Roadmap (auto-includes forward-looking disclaimer)"
```

---

## Phase 8: Core layouts (10 most-used POTX layouts)

Build the highest-leverage layouts first. Each is a Vue file in `theme/layouts/` exposing slots Slidev fills with the slide's Markdown body. Variants (Cover A–L, Divider A–D, Thank You A/B) collapse to single files with a `variant` prop.

**Layout authoring convention (read once):**

- The component receives slide front-matter as props (Slidev injects them).
- Use `<slot />` for the slide's body content. For multi-slot layouts, use named slots (`<slot name="left" />`); authors target them with `::left::` blocks.
- Look up POTX placeholder geometry in `theme/styles/_extracted/layouts.json` — match the visual proportions. EMU values: divide by 914400 to get inches; the POTX is 16:9 at 13.333"×7.5" (12,192,000 × 6,858,000 EMU).
- All colors come from CSS variables — never hardcode hex. Use `var(--sap-brand-blue)` etc.
- Keep `<style scoped>` per layout file. Shared rules live in `theme/styles/slide-styles.css`.

### Task 8.1: Cover layout (with 12 variants)

**Files:**

- Create: `theme/layouts/cover.vue`

- [ ] **Step 1: Look up Cover A geometry**

Run: `node -e "const j=require('./theme/styles/_extracted/layouts.json'); console.log(JSON.stringify(j.layouts.find(l=>l.name==='Cover A'),null,2))"`
Expected: prints the title and subtitle placeholder positions in EMU. Use them as a reference for proportions in the CSS.

- [ ] **Step 2: Write the layout**

`theme/layouts/cover.vue`:

```vue
<script setup lang="ts">
  import { getEvent } from '../setup/data'

  const props = defineProps<{
    title?: string
    subtitle?: string
    variant?: string // a..l
    presenter?: string
    event?: string // overrides event.yaml#name
  }>()
  const variant = props.variant ?? 'a'
  const event = getEvent()
  const eventName = props.event ?? event.name
</script>

<template>
  <div :class="['cover', `cover--${variant}`]">
    <div class="cover-content">
      <h1 v-if="title">{{ title }}</h1>
      <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
      <slot />
      <footer class="cover-footer">
        <Speaker v-if="presenter" :presenter="presenter" />
        <Speaker v-else />
        <span class="event">{{ eventName }}</span>
      </footer>
    </div>
  </div>
</template>

<style scoped>
  .cover {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 4rem 5rem;
    position: relative;
    overflow: hidden;
  }
  .cover-content {
    position: relative;
    z-index: 1;
    max-width: 70%;
  }
  .cover h1 {
    font-size: 4.5rem;
    line-height: 1.05;
    color: #fff;
    margin: 0 0 1.5rem;
    font-weight: 800;
    letter-spacing: -0.015em;
  }
  .cover .subtitle {
    font-size: 1.75rem;
    color: rgba(255, 255, 255, 0.95);
    margin: 0 0 2rem;
  }
  .cover-footer {
    margin-top: 3rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    color: rgba(255, 255, 255, 0.9);
  }
  .cover-footer .event {
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    opacity: 0.85;
  }

  /* Variant backgrounds — keyed to the SAP Horizon palette */
  .cover--a {
    background: linear-gradient(135deg, var(--sap-brand-blue-dark), var(--sap-brand-blue));
  }
  .cover--b {
    background: linear-gradient(135deg, var(--sap-brand-blue), var(--sap-brand-teal));
  }
  .cover--c {
    background: linear-gradient(135deg, var(--sap-brand-blue-darker), var(--sap-brand-purple-dark));
  }
  .cover--d {
    background: linear-gradient(135deg, var(--sap-brand-teal), var(--sap-brand-green));
  }
  .cover--e {
    background: linear-gradient(135deg, var(--sap-brand-purple-dark), var(--sap-brand-pink-dark));
  }
  .cover--f {
    background: var(--sap-brand-blue-darker);
  }
  .cover--g {
    background: var(--sap-brand-blue);
  }
  .cover--h {
    background: var(--sap-brand-teal-dark);
  }
  .cover--i {
    background: var(--sap-brand-purple);
  }
  .cover--j {
    background: var(--sap-brand-blue-darker)
      radial-gradient(at 30% 20%, var(--sap-brand-blue) 0%, transparent 50%);
  }
  .cover--k {
    background: var(--sap-brand-blue-darker)
      radial-gradient(at 70% 80%, var(--sap-brand-teal) 0%, transparent 60%);
  }
  .cover--l {
    background: linear-gradient(180deg, var(--sap-brand-blue-darker), var(--sap-black));
  }
</style>
```

> **Variant assignment** (a..l) is approximate — the actual POTX Cover A–L use specific photographic backgrounds and treatments. We approximate with gradients and solid fills tuned for legibility. Photographic variants can be added later by authors who drop a hero image into the slide and use the `full-bleed-image` layout for fully-bleed photo covers.

- [ ] **Step 3: Commit**

```bash
git add theme/layouts/cover.vue
git commit -m "feat(layout): cover (12 variants)"
```

### Task 8.2: Title-only layout

**Files:**

- Create: `theme/layouts/title-only.vue`

- [ ] **Step 1: Write**

```vue
<script setup lang="ts">
  defineProps<{ title?: string }>()
</script>

<template>
  <div class="layout title-only">
    <h1 v-if="title">{{ title }}</h1>
    <slot />
  </div>
</template>

<style scoped>
  .title-only {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 4rem 5rem;
    height: 100%;
  }
  .title-only h1 {
    font-size: 4rem;
    color: var(--sap-brand-blue-darker);
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add theme/layouts/title-only.vue
git commit -m "feat(layout): title-only"
```

### Task 8.3: Title-text layout (single content area)

**Files:**

- Create: `theme/layouts/title-text.vue`

- [ ] **Step 1: Write**

```vue
<script setup lang="ts">
  defineProps<{ title?: string }>()
</script>

<template>
  <div class="layout title-text">
    <h1 v-if="title">{{ title }}</h1>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
  .title-text {
    padding: 3rem 4rem;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .title-text h1 {
    font-size: 2.75rem;
    color: var(--sap-brand-blue-darker);
    margin-bottom: 1.5rem;
  }
  .title-text .content {
    flex: 1;
    font-size: 1.25rem;
    line-height: 1.55;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add theme/layouts/title-text.vue
git commit -m "feat(layout): title-text"
```

### Task 8.4: Title-text 2-col layout

**Files:**

- Create: `theme/layouts/title-text-2col.vue`

- [ ] **Step 1: Write**

```vue
<script setup lang="ts">
  defineProps<{ title?: string }>()
</script>

<template>
  <div class="layout title-text-2col">
    <h1 v-if="title">{{ title }}</h1>
    <div class="cols">
      <div class="col"><slot name="left" /></div>
      <div class="col"><slot name="right" /></div>
    </div>
  </div>
</template>

<style scoped>
  .title-text-2col {
    padding: 3rem 4rem;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .title-text-2col h1 {
    font-size: 2.75rem;
    color: var(--sap-brand-blue-darker);
    margin-bottom: 1.5rem;
  }
  .cols {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
  }
  .col {
    font-size: 1.15rem;
    line-height: 1.55;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add theme/layouts/title-text-2col.vue
git commit -m "feat(layout): title-text-2col"
```

### Task 8.5: Divider layout (4 variants)

**Files:**

- Create: `theme/layouts/divider.vue`

- [ ] **Step 1: Write**

```vue
<script setup lang="ts">
  defineProps<{ title?: string; variant?: 'a' | 'b' | 'c' | 'd' }>()
</script>

<template>
  <div :class="['layout', 'divider', `divider--${variant ?? 'a'}`]">
    <div class="divider-content">
      <h1 v-if="title">{{ title }}</h1>
      <slot />
    </div>
  </div>
</template>

<style scoped>
  .divider {
    height: 100%;
    padding: 5rem;
    display: flex;
    align-items: center;
    color: #fff;
  }
  .divider h1 {
    font-size: 4rem;
    color: #fff;
    max-width: 80%;
  }

  .divider--a {
    background: var(--sap-brand-blue-darker);
  }
  .divider--b {
    background: linear-gradient(135deg, var(--sap-brand-blue-darker), var(--sap-brand-blue));
  }
  .divider--c {
    background: var(--sap-brand-teal-dark);
  }
  .divider--d {
    background: linear-gradient(135deg, var(--sap-brand-purple-dark), var(--sap-brand-blue-darker));
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add theme/layouts/divider.vue
git commit -m "feat(layout): divider (4 variants)"
```

### Task 8.6: Quote layout

**Files:**

- Create: `theme/layouts/quote.vue`

- [ ] **Step 1: Write**

```vue
<script setup lang="ts">
  defineProps<{ author?: string; source?: string }>()
</script>

<template>
  <div class="layout quote">
    <blockquote>
      <slot />
    </blockquote>
    <footer v-if="author">
      <span class="author">— {{ author }}</span>
      <span v-if="source" class="source">, {{ source }}</span>
    </footer>
  </div>
</template>

<style scoped>
  .quote {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 5rem;
    height: 100%;
  }
  blockquote {
    font-size: 2.75rem;
    line-height: 1.3;
    color: var(--sap-brand-blue-darker);
    margin: 0 0 2rem;
    font-weight: 500;
    position: relative;
  }
  blockquote::before {
    content: '"';
    position: absolute;
    top: -3rem;
    left: -1rem;
    font-size: 8rem;
    color: var(--sap-brand-blue-pale);
    line-height: 1;
  }
  footer {
    font-size: 1.25rem;
    color: var(--sapContent_LabelColor);
  }
  .author {
    font-weight: 600;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add theme/layouts/quote.vue
git commit -m "feat(layout): quote"
```

### Task 8.7: Q&A layout

**Files:**

- Create: `theme/layouts/q-and-a.vue`

- [ ] **Step 1: Write**

```vue
<script setup lang="ts">
  defineProps<{ presenter?: string }>()
</script>

<template>
  <div class="layout q-and-a">
    <h1>Questions?</h1>
    <p class="prompt">Ask now, or find me later.</p>
    <Bio :presenter="presenter" compact />
    <slot />
  </div>
</template>

<style scoped>
  .q-and-a {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 1.5rem;
    padding: 4rem 5rem;
    height: 100%;
    background: linear-gradient(135deg, var(--sap-brand-blue-pale), #fff);
  }
  h1 {
    font-size: 5rem;
    color: var(--sap-brand-blue-darker);
    margin: 0;
  }
  .prompt {
    font-size: 1.5rem;
    color: var(--sapContent_LabelColor);
    margin: 0;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add theme/layouts/q-and-a.vue
git commit -m "feat(layout): q-and-a (with Bio)"
```

### Task 8.8: Thank-you layout (2 variants)

**Files:**

- Create: `theme/layouts/thank-you.vue`

- [ ] **Step 1: Write**

```vue
<script setup lang="ts">
  import { getEvent } from '../setup/data'
  const props = defineProps<{ presenter?: string; variant?: 'a' | 'b' }>()
  const event = getEvent()
</script>

<template>
  <div :class="['layout', 'thank-you', `thank-you--${variant ?? 'a'}`]">
    <h1>Thank you.</h1>
    <Speaker :presenter="presenter" />
    <p v-if="event.hashtag" class="hashtag">{{ event.hashtag }}</p>
    <slot />
  </div>
</template>

<style scoped>
  .thank-you {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 1.5rem;
    height: 100%;
    padding: 5rem;
    color: #fff;
  }
  .thank-you h1 {
    font-size: 6rem;
    margin: 0;
    color: #fff;
  }
  .hashtag {
    margin-top: 2rem;
    font-size: 1.25rem;
    letter-spacing: 0.05em;
  }
  .thank-you--a {
    background: var(--sap-brand-blue-darker);
  }
  .thank-you--b {
    background: linear-gradient(135deg, var(--sap-brand-blue), var(--sap-brand-teal));
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add theme/layouts/thank-you.vue
git commit -m "feat(layout): thank-you (2 variants)"
```

### Task 8.9: Agenda layout (uses Agenda component)

**Files:**

- Create: `theme/layouts/agenda.vue`

- [ ] **Step 1: Write**

```vue
<script setup lang="ts">
  defineProps<{
    title?: string
    variant?: 'a' | 'b'
    items?: string[]
    current?: number
  }>()
</script>

<template>
  <div :class="['layout', 'agenda-layout', `agenda-layout--${variant ?? 'a'}`]">
    <h1>{{ title ?? 'Agenda' }}</h1>
    <Agenda :items="items" :current="current" />
    <slot />
  </div>
</template>

<style scoped>
  .agenda-layout {
    padding: 3rem 5rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  .agenda-layout h1 {
    font-size: 3rem;
    color: var(--sap-brand-blue-darker);
    margin: 0;
  }
  .agenda-layout--b {
    background: var(--sap-brand-blue-pale);
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add theme/layouts/agenda.vue
git commit -m "feat(layout): agenda (2 variants)"
```

### Task 8.10: Blank layout (escape hatch)

**Files:**

- Create: `theme/layouts/blank.vue`

- [ ] **Step 1: Write**

```vue
<template>
  <div class="layout blank">
    <slot />
  </div>
</template>

<style scoped>
  .blank {
    padding: 0;
    height: 100%;
  }
</style>
```

- [ ] **Step 2: Smoke-test all 10 layouts in dev**

Update `slides.md` temporarily to use each layout in turn:

```markdown
---
theme: ./theme
---

---

layout: cover
variant: a
title: Test Cover
subtitle: A subtitle

---

---

layout: divider
title: Section break

---

---

layout: title-text
title: Hello

---

This is the body.

---

layout: quote
author: SAP team

---

The future is built on a foundation of careful work.

---

## layout: thank-you
```

Run: `npm run dev`
Expected: each slide renders in its layout. Spot-check colors and typography against brand expectations. Stop with Ctrl-C.

- [ ] **Step 3: Commit**

```bash
git add theme/layouts/blank.vue slides.md
git commit -m "feat(layout): blank + smoke-test all core layouts"
```

---

## Phase 9: Remaining layouts

The remaining 18 layout files cover all 35 not-yet-built POTX layouts. Variants of existing layouts (Cover B–L, Divider B–D, Thank You B) are already absorbed into the components from Phase 8 — this phase covers structurally-distinct layouts: 3-column, 4-column, content-with-image, full-bleed, screenshot, photo, content-photo, and the user-guide layouts.

Each task follows the same micro-pattern:

1. Look up the layout's geometry in `theme/styles/_extracted/layouts.json`.
2. Write the Vue file under `theme/layouts/`.
3. Add a slide using it to `slides.md` for visual smoke-testing.
4. Commit.

To keep this plan tractable, layouts of similar shape are grouped — when you see "implement these N layouts following the pattern of `<existing>`," produce N Vue files in one task, each ~25–40 lines.

### Task 9.1: Title-text 3-column

**Files:** Create: `theme/layouts/title-text-3col.vue`

- [ ] Write the Vue file mirroring `title-text-2col.vue` with three slots (`left`, `middle`, `right`), `grid-template-columns: 1fr 1fr 1fr`, gap 2rem, font-size 1.05rem.
- [ ] Commit: `git add theme/layouts/title-text-3col.vue && git commit -m "feat(layout): title-text-3col"`

### Task 9.2: Content+image 2/3/4-column layouts

**Files:**

- Create: `theme/layouts/content-image-2col.vue`
- Create: `theme/layouts/content-image-3col.vue`
- Create: `theme/layouts/content-image-4col.vue`

- [ ] **Step 1: Write `content-image-2col.vue`** — each column has an image slot + text slot, stacked vertically:

```vue
<script setup lang="ts">
  defineProps<{ title?: string }>()
</script>

<template>
  <div class="layout content-image-2col">
    <h1 v-if="title">{{ title }}</h1>
    <div class="cols">
      <div class="col">
        <div class="col-image"><slot name="left-image" /></div>
        <div class="col-text"><slot name="left" /></div>
      </div>
      <div class="col">
        <div class="col-image"><slot name="right-image" /></div>
        <div class="col-text"><slot name="right" /></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .content-image-2col {
    padding: 3rem 4rem;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .content-image-2col h1 {
    font-size: 2.5rem;
    color: var(--sap-brand-blue-darker);
    margin-bottom: 1.5rem;
  }
  .cols {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  .col {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .col-image :deep(img) {
    width: 100%;
    height: auto;
    border-radius: var(--sap-radius-card);
  }
  .col-text {
    font-size: 1.05rem;
    line-height: 1.5;
  }
</style>
```

- [ ] **Step 2: Write `content-image-3col.vue`** — same as 2col but with 3 columns, slot names `left/middle/right` and `left-image/middle-image/right-image`. Reduce font-size to 0.95rem, gap to 1.5rem.
- [ ] **Step 3: Write `content-image-4col.vue`** — 4 columns, slots `c1..c4` and `c1-image..c4-image`, font-size 0.85rem, gap 1.25rem.
- [ ] **Step 4: Commit:** `git add theme/layouts/content-image-*.vue && git commit -m "feat(layout): content-image (2/3/4-col)"`

### Task 9.3: Title-image-third (POTX "Title and Text with Image 1/3")

**Files:** Create: `theme/layouts/title-image-third.vue`

- [ ] Write a 2-column grid (2fr text, 1fr image), with `slot="image"` for the right column. Pattern: same as `title-text-2col` but asymmetric and with image styling.
- [ ] Commit.

### Task 9.4: Full-bleed image, image-slide, text-screenshot

**Files:**

- Create: `theme/layouts/full-bleed-image.vue`
- Create: `theme/layouts/image-slide.vue`
- Create: `theme/layouts/text-screenshot.vue`

- [ ] **Step 1: Write `full-bleed-image.vue`** — accepts `src` prop, renders as `background-image`, optional title overlay with gradient background. Use the pattern from cover variants for the overlay treatment.

- [ ] **Step 2: Write `image-slide.vue`** — for foreign-branded imports, no chrome:

```vue
<script setup lang="ts">
  defineProps<{ src: string; alt?: string }>()
</script>

<template>
  <div class="layout image-slide">
    <img :src="src" :alt="alt ?? ''" />
  </div>
</template>

<style scoped>
  .image-slide {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
    padding: 0;
  }
  .image-slide img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  .image-slide::after {
    content: none !important;
  }
</style>
```

- [ ] **Step 3: Write `text-screenshot.vue`** — 1fr/1.5fr grid with `slot="screenshot"` on the right; screenshot gets a subtle border, shadow, and rounded corners.
- [ ] **Step 4: Commit:** `git add theme/layouts/full-bleed-image.vue theme/layouts/image-slide.vue theme/layouts/text-screenshot.vue && git commit -m "feat(layout): full-bleed-image, image-slide, text-screenshot"`

### Task 9.5: Title-content layout (POTX "Title and Content")

**Files:** Create: `theme/layouts/title-content.vue`

- [ ] Write — mirrors `title-text` but with `:deep(h2)` styling for in-body section headings. Useful when slides have multiple sub-sections.
- [ ] Commit.

### Task 9.6: Title-photo + content-photo (1, 2)

**Files:**

- Create: `theme/layouts/title-photo.vue`
- Create: `theme/layouts/content-photo-1.vue`
- Create: `theme/layouts/content-photo-2.vue`

- [ ] **Step 1: Write `title-photo.vue`** — 50/50 grid: photo as left half (background-image, fallback to brand-blue-pale), title and slot on the right.
- [ ] **Step 2: Write `content-photo-1.vue`** — small avatar-style photo (4rem, circle, top-left) with title beside it; body below.
- [ ] **Step 3: Write `content-photo-2.vue`** — same as content-photo-1 but with `flex-direction: row-reverse` and a larger photo (8rem).
- [ ] **Step 4: Commit:** `git add theme/layouts/title-photo.vue theme/layouts/content-photo-*.vue && git commit -m "feat(layout): title-photo, content-photo-1, content-photo-2"`

### Task 9.7: Title, content-1, two-content (POTX-named generic layouts)

**Files:**

- Create: `theme/layouts/title.vue`
- Create: `theme/layouts/content-1.vue`
- Create: `theme/layouts/two-content.vue`

- [ ] **Step 1: Write `title.vue`** — centered title + subtitle, no body. Used for full-screen "Section: Foundations" announcements where `divider` is too heavy.
- [ ] **Step 2: Write `content-1.vue`** — re-export `title-content.vue` for POTX-fidelity authoring. Pattern:

```vue
<template>
  <TitleContent v-bind="$attrs"><slot /></TitleContent>
</template>

<script setup lang="ts">
  import TitleContent from './title-content.vue'
  defineOptions({ inheritAttrs: false })
</script>
```

- [ ] **Step 3: Write `two-content.vue`** — re-export `title-text-2col.vue` similarly.
- [ ] **Step 4: Commit:** `git add theme/layouts/title.vue theme/layouts/content-1.vue theme/layouts/two-content.vue && git commit -m "feat(layout): title, content-1, two-content (POTX-named aliases)"`

### Task 9.8: User-guide layouts (tips-tricks, color-palette, brand-site)

**Files:**

- Create: `theme/layouts/tips-tricks.vue`
- Create: `theme/layouts/color-palette.vue`
- Create: `theme/layouts/brand-site.vue`

- [ ] **Step 1: Write `tips-tricks.vue`** — 2-column grid of `<h3>`-headed tip cards from the slot content.

- [ ] **Step 2: Write `color-palette.vue`** — auto-renders a swatch grid from a hardcoded list of 12 brand colors:

```vue
<script setup lang="ts">
  const swatches = [
    { name: 'Brand Blue', var: '--sap-brand-blue' },
    { name: 'Brand Blue Bright', var: '--sap-brand-blue-bright' },
    { name: 'Brand Blue Dark', var: '--sap-brand-blue-dark' },
    { name: 'Brand Blue Darker', var: '--sap-brand-blue-darker' },
    { name: 'Brand Teal', var: '--sap-brand-teal' },
    { name: 'Brand Green', var: '--sap-brand-green' },
    { name: 'Brand Red', var: '--sap-brand-red' },
    { name: 'Brand Orange', var: '--sap-brand-orange' },
    { name: 'Brand Yellow', var: '--sap-brand-yellow' },
    { name: 'Brand Purple', var: '--sap-brand-purple' },
    { name: 'Brand Pink', var: '--sap-brand-pink' },
    { name: 'Brand Magenta', var: '--sap-brand-magenta' }
  ]
</script>

<template>
  <div class="layout color-palette">
    <h1>Color palette</h1>
    <div class="swatches">
      <div v-for="s in swatches" :key="s.var" class="swatch">
        <div class="chip" :style="{ background: `var(${s.var})` }" />
        <div class="meta">
          <strong>{{ s.name }}</strong
          ><code>{{ s.var }}</code>
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>

<style scoped>
  .color-palette {
    padding: 3rem 4rem;
    height: 100%;
  }
  .color-palette h1 {
    font-size: 2.5rem;
    color: var(--sap-brand-blue-darker);
    margin-bottom: 1.5rem;
  }
  .swatches {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }
  .swatch {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }
  .chip {
    width: 3rem;
    height: 3rem;
    border-radius: var(--sap-radius-button);
    border: 1px solid #e5e9ed;
  }
  .meta {
    display: flex;
    flex-direction: column;
  }
  .meta strong {
    font-size: 0.95rem;
  }
  .meta code {
    font-size: 0.75rem;
    color: var(--sapContent_LabelColor);
  }
</style>
```

- [ ] **Step 3: Write `brand-site.vue`** — list of public SAP brand resource links (brand.sap.com, experience.sap.com, news.sap.com).

- [ ] **Step 4: Commit:** `git add theme/layouts/tips-tricks.vue theme/layouts/color-palette.vue theme/layouts/brand-site.vue && git commit -m "feat(layout): user-guide layouts (tips-tricks, color-palette, brand-site)"`

### Task 9.9: Verify layout count and POTX coverage

**Files:** none modified.

- [ ] **Step 1: List layouts**

Run: `ls theme/layouts/*.vue | wc -l`
Expected: at least 28 files.

- [ ] **Step 2: Cross-check against POTX**

```bash
node -e "
const j = require('./theme/styles/_extracted/layouts.json')
const potx = j.layouts.map(l => l.name).filter(n => !n.startsWith('>'))
console.log('POTX layouts (excluding DO NOT USE):', potx.length)
console.log(potx.join(', '))
"
```

Confirm every POTX name maps to either a layout file or a variant of one. Document any gaps in CHANGELOG.

- [ ] **Step 3: If everything checks out, no commit needed.**

---

## Phase 10: Sample deck (`slides.md`)

Replace the smoke-test placeholder with a real demo deck that exercises every component and most layouts. This deck doubles as the **template repo's own GitHub Pages demo** — visitors who land on `username.github.io/sap-presentation-template/` see what the tool produces.

### Task 10.1: Write the sample deck

**Files:**

- Modify: `slides.md`

- [ ] **Step 1: Write the deck**

`slides.md`:

```markdown
---
theme: ./theme
title: SAP Presentation Template — Demo
info: |
  Demo deck for the sap-presentation-template repo.
  Replace this file with your own slides after forking.
fonts:
  sans: '72'
---

---

layout: cover
variant: a
title: Cloud-Native Development
subtitle: Building modern SAP applications with CAP and BTP

---

---

layout: agenda
title: Agenda
:items:

- Foundations
- The CAP development model
- Live demo
- Roadmap
- Q & A

---

---

layout: divider
variant: a
title: Foundations

---

---

layout: title-text
title: Why CAP?

---

The SAP Cloud Application Programming Model is a framework for building cloud-native business applications:

- Convention over configuration
- Domain-driven design
- One model, many surfaces
- TypeScript or Java
- Cloud-ready from day one

<KeyTakeaway>One model, many runtimes — CAP services run anywhere SAP runs.</KeyTakeaway>

---

layout: title-text-2col
title: How it compares

---

::left::
**Traditional approach**

- Hand-write SQL
- Manual CRUD endpoints
- Per-stack auth wiring
- Schema drift risk

::right::
**CAP approach**

- CDS-driven schema
- Auto-generated services
- Built-in auth via annotations
- Single source of truth

---

layout: divider
variant: b
title: The CAP development model

---

---

layout: title-content
title: A minimal CAP service

---

<CodeBlock lang="cds" filename="srv/catalog-service.cds">

\`\`\`cds
using { my.bookshop as my } from '../db/schema';

service CatalogService @(path:'/browse') {
@readonly entity Books as projection on my.Books;
}
\`\`\`

</CodeBlock>

That's a working OData V4 service.

---

layout: divider
variant: c
title: Live demo

---

---

layout: title-only
title: Let's see it live.

---

<DemoCallout kind="live" fallback="see screenshots in following slides" />

---

layout: divider
variant: d
title: Roadmap

---

---

layout: title-content
title: What's next for CAP

---

<Roadmap :phases="[
  { label: 'Q3 2026', status: 'planned', items: ['Native HANA Cloud streaming', 'Improved draft handling'] },
  { label: 'Q4 2026', status: 'in-development', items: ['CDS 7 toolkit', 'Cloud SDK 6 integration'] },
  { label: 'Q1 2027', status: 'available', items: ['Currently shipping in cds@9.x'] }
]" />

---

layout: title-only
title: SAP Developer Advocates

---

<DeveloperAdvocates />

---

## layout: q-and-a

---

layout: thank-you
variant: a

---
```

> **Note on Roadmap props:** the YAML-style array inside the HTML attribute uses Vue's expression binding. Ensure your editor/linter accepts the multi-line attribute value; if Vue complains, move the phases array into a `<script setup>` block of an inline component or use Slidev's `js` block.

- [ ] **Step 2: Run dev**

Run: `npm run dev`
Expected: every slide renders without errors. Click through and visually verify each layout.

> **Likely issues to debug:**
>
> - **Components not auto-resolved** → Slidev should auto-import from `theme/components/`. If `<Bio>` errors out, check Slidev's `setupFiles` or add an explicit `components` registration in `theme/setup/main.ts`.
> - **YAML in attributes failing** → simplify by storing phases in a global Vue `defineExpose` or import from a `roadmap.yaml`.
> - **Fonts not loading** → check Network tab; if `72` fonts fail, fall back to system stack and document.

- [ ] **Step 3: Commit**

```bash
git add slides.md
git commit -m "feat: real sample deck demonstrating layouts and components"
```

---

## Phase 11: PPTX import script

Add `npm run import-pptx <file.pptx>` for foreign-branded slide ingestion. Optional dependency on LibreOffice; documented manual fallback for those without it.

### Task 11.1: Detect external tools (LibreOffice + pdftoppm)

**Files:**

- Create: `scripts/lib/detect-tools.mjs`
- Create: `scripts/lib/detect-tools.test.ts`

- [ ] **Step 1: Test**

```ts
import { describe, it, expect } from 'vitest'
import { detectTools } from './detect-tools.mjs'

describe('detectTools', () => {
  it('returns booleans for soffice and pdftoppm', async () => {
    const r = await detectTools()
    expect(typeof r.soffice).toBe('boolean')
    expect(typeof r.pdftoppm).toBe('boolean')
  })
})
```

- [ ] **Step 2: Implement**

`scripts/lib/detect-tools.mjs`:

```js
import { spawn } from 'node:child_process'

function which(cmd) {
  return new Promise((resolve) => {
    const isWin = process.platform === 'win32'
    const lookup = isWin ? 'where' : 'which'
    const child = spawn(lookup, [cmd], { stdio: 'ignore' })
    child.on('close', (code) => resolve(code === 0))
    child.on('error', () => resolve(false))
  })
}

export async function detectTools() {
  const [soffice, pdftoppm] = await Promise.all([which('soffice'), which('pdftoppm')])
  return { soffice, pdftoppm }
}
```

- [ ] **Step 3: Run — passes**

Run: `npm test -- detect-tools`

- [ ] **Step 4: Commit**

```bash
git add scripts/lib/detect-tools.mjs scripts/lib/detect-tools.test.ts
git commit -m "feat: external tool detection (soffice, pdftoppm)"
```

### Task 11.2: import-pptx orchestrator

**Files:**

- Create: `scripts/import-pptx.mjs`

- [ ] **Step 1: Write the script**

`scripts/import-pptx.mjs`:

```js
#!/usr/bin/env node
/**
 * import-pptx.mjs — convert a foreign PPTX to per-slide PNG images.
 *
 * Usage: node scripts/import-pptx.mjs <file.pptx> [--name <slug>]
 *
 * Requires: LibreOffice (`soffice` on PATH).
 * Optional: `pdftoppm` (Poppler) for faster PDF-to-PNG; falls back to pdf-to-img npm.
 *
 * Writes:
 *   public/imported/<name>/slide-NN.png
 *   public/imported/<name>/slides.json
 *   snippets/<name>-frame.md  (Markdown stub: first + last slides as image-slide)
 */

import { spawn } from 'node:child_process'
import { mkdir, readdir, writeFile, copyFile, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { resolve, basename, extname, join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'
import { mkdtemp } from 'node:fs/promises'

import { detectTools } from './lib/detect-tools.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

function shell(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit', ...opts })
    child.on('close', (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))
    )
    child.on('error', reject)
  })
}

async function main() {
  const args = process.argv.slice(2)
  if (args.length === 0) {
    console.error('Usage: npm run import-pptx <file.pptx> [-- --name <slug>]')
    process.exit(1)
  }
  const pptx = resolve(args[0])
  const nameIdx = args.indexOf('--name')
  const name =
    nameIdx >= 0
      ? args[nameIdx + 1]
      : basename(pptx, extname(pptx))
          .toLowerCase()
          .replace(/[^a-z0-9-]+/g, '-')

  if (!existsSync(pptx)) {
    console.error(`File not found: ${pptx}`)
    process.exit(1)
  }

  const tools = await detectTools()
  if (!tools.soffice) {
    console.error('LibreOffice (soffice) not found on PATH.')
    console.error(
      'Install LibreOffice from https://www.libreoffice.org or use the manual fallback:'
    )
    console.error('  1. Open the PPTX in PowerPoint')
    console.error('  2. File → Export → Change file type → PNG')
    console.error(
      '  3. Drop PNGs into public/imported/<name>/ named slide-01.png, slide-02.png, ...'
    )
    process.exit(1)
  }

  const tmp = await mkdtemp(join(tmpdir(), 'pptx-import-'))
  console.log(`Converting ${pptx} via LibreOffice...`)

  // Step 1: PPTX → PDF
  await shell('soffice', ['--headless', '--convert-to', 'pdf', '--outdir', tmp, pptx])
  const pdfPath = join(tmp, basename(pptx, extname(pptx)) + '.pdf')
  if (!existsSync(pdfPath)) throw new Error(`LibreOffice did not produce PDF at ${pdfPath}`)

  // Step 2: PDF → PNGs (one per page)
  const outDir = resolve(ROOT, 'public', 'imported', name)
  await rm(outDir, { recursive: true, force: true })
  await mkdir(outDir, { recursive: true })

  if (tools.pdftoppm) {
    console.log('Using pdftoppm for PDF → PNG (fast)...')
    await shell('pdftoppm', ['-png', '-r', '150', pdfPath, join(outDir, 'slide')])
    // pdftoppm names files slide-1.png, slide-2.png — normalize to slide-NN.png
    const files = (await readdir(outDir)).filter((f) => /^slide-\d+\.png$/.test(f))
    for (const file of files) {
      const n = Number(file.match(/(\d+)/)[1])
      const padded = `slide-${String(n).padStart(2, '0')}.png`
      if (file !== padded)
        await copyFile(join(outDir, file), join(outDir, padded)).then(() => rm(join(outDir, file)))
    }
  } else {
    console.log('pdftoppm not found — falling back to pdf-to-img npm...')
    const { pdf } = await import('pdf-to-img')
    let i = 1
    for await (const buf of await pdf(pdfPath, { scale: 2 })) {
      const padded = `slide-${String(i).padStart(2, '0')}.png`
      await writeFile(join(outDir, padded), buf)
      i++
    }
  }

  // Step 3: write manifest
  const slides = (await readdir(outDir)).filter((f) => f.endsWith('.png')).sort()
  await writeFile(
    join(outDir, 'slides.json'),
    JSON.stringify({ name, source: basename(pptx), count: slides.length, slides }, null, 2),
    'utf-8'
  )

  // Step 4: write snippet stub (first + last slides as image-slide)
  const snippetPath = resolve(ROOT, 'snippets', `${name}-frame.md`)
  if (slides.length >= 2) {
    const first = slides[0]
    const last = slides[slides.length - 1]
    const content = [
      '---',
      'layout: image-slide',
      `src: /imported/${name}/${first}`,
      '---',
      '',
      '<!-- Your slides go here. Add `---` separators between them. -->',
      '',
      '---',
      'layout: image-slide',
      `src: /imported/${name}/${last}`,
      '---',
      ''
    ].join('\n')
    if (!existsSync(snippetPath)) {
      await writeFile(snippetPath, content, 'utf-8')
      console.log(`✓ Wrote snippet stub: ${snippetPath}`)
    }
  }

  console.log(`✓ Imported ${slides.length} slides to ${outDir}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
```

- [ ] **Step 2: Smoke-test (only if LibreOffice is installed)**

If you have a sample PPTX handy:

```bash
npm run import-pptx -- ./sample.pptx
```

Expected: outputs PNGs under `public/imported/sample/` and a snippet stub. Skip this step if you don't have LibreOffice or a test PPTX — the script is documented and tested against the lib helpers.

- [ ] **Step 3: Commit**

```bash
git add scripts/import-pptx.mjs
git commit -m "feat: PPTX import script (LibreOffice + pdftoppm/pdf-to-img)"
```

### Task 11.3: Make pdf-to-img an optional dep

**Files:**

- Modify: `package.json`

- [ ] **Step 1: Add `pdf-to-img` to optionalDependencies**

In `package.json`, add (don't make it a hard dep):

```json
"optionalDependencies": {
  "pdf-to-img": "^4.0.0"
}
```

This way it installs when available but doesn't fail the install on platforms where it can't build.

- [ ] **Step 2: Re-install**

Run: `npm install`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: pdf-to-img as optionalDependency"
```

---

## Phase 12: Kitchen-sink gallery page

A `pages/all-layouts.md` deck that demos every layout — used as the visual-regression baseline and as a discoverability tool for fork-authors (`npm run gallery`).

### Task 12.1: Add the gallery script

**Files:**

- Modify: `package.json`

- [ ] **Step 1: Update scripts**

In `package.json`, add:

```json
"gallery": "slidev pages/all-layouts.md --port 3031"
```

- [ ] **Step 2: Commit later — first write the gallery page.**

### Task 12.2: Author the gallery page

**Files:**

- Create: `pages/all-layouts.md`

- [ ] **Step 1: Write the gallery**

`pages/all-layouts.md`:

```markdown
---
theme: ../theme
title: Layout & Component Gallery
info: Visual reference and regression baseline for every layout and component.
---

---

layout: cover
variant: a
title: Layout Gallery
subtitle: Every layout, every component, in one deck

---

---

layout: title-only
title: Cover variants (a–l)

---

This gallery shows the 12 cover variants, all dividers, all content layouts, and every component.

---

layout: cover
variant: a
title: Cover A

---

---

layout: cover
variant: b
title: Cover B

---

<!-- Repeat for c through l -->

---

layout: divider
variant: a
title: Divider A

---

---

layout: divider
variant: b
title: Divider B

---

<!-- c, d -->

---

layout: title-only
title: Just a title.

---

---

layout: title-text
title: Title and text

---

Body content here. Lorem ipsum dolor sit amet.

---

layout: title-text-2col
title: Two columns

---

::left::
Left column content.

::right::
Right column content.

---

layout: title-text-3col
title: Three columns

---

::left::
Left.

::middle::
Middle.

::right::
Right.

---

layout: quote
author: Anonymous
source: this gallery

---

A pithy quote that fits the layout.

---

## layout: q-and-a

---

layout: thank-you
variant: a

---

---

layout: title-only
title: Components

---

---

layout: title-content
title: Bio component

---

<Bio />

---

layout: title-content
title: Speaker component

---

<Speaker /> presented this section.

---

layout: title-content
title: Team component

---

<Team team="dev-advocates" />

---

layout: title-only
title: Developer Advocates

---

<DeveloperAdvocates />

---

layout: title-content
title: Disclaimer (forward-looking)

---

<Disclaimer kind="forward-looking" />

---

layout: title-content
title: Roadmap

---

<Roadmap :phases="[
  { label: 'Q3', status: 'planned', items: ['Item A'] },
  { label: 'Q4', status: 'available', items: ['Item B'] }
]" />

---

layout: title-content
title: KeyTakeaway

---

<KeyTakeaway>The takeaway is succinct, memorable, and one sentence.</KeyTakeaway>

---

layout: title-content
title: DemoCallout

---

<DemoCallout kind="live" />
<DemoCallout kind="recorded" />
<DemoCallout kind="interactive" />

---

layout: title-content
title: QRCode + EventBadge

---

<QRCode url="https://developers.sap.com" caption="Scan to follow up" />

<EventBadge />

---

layout: title-content
title: Logo

---

<Logo variant="logo-sap-primary" />

---

## layout: color-palette

---

## layout: brand-site

---

layout: tips-tricks
title: Authoring tips

---

### Layout selection

Use `cover` for the title slide, `divider` between sections, `thank-you` to close.

### Component composition

Components nest naturally inside layouts — `<Bio />` works inside `title-content` or `q-and-a`.
```

> **Filling in the rest:** the comment-stubs (`<!-- Repeat for c through l -->`) should be expanded into actual slides for each variant when the gallery is finalized. For v1, expanding all 12 cover variants is recommended for visual regression coverage; the divider variants and content layouts likewise.

- [ ] **Step 2: Run gallery**

Run: `npm run gallery`
Expected: opens at http://localhost:3031, every slide renders. Stop with Ctrl-C.

- [ ] **Step 3: Commit**

```bash
git add pages/all-layouts.md package.json
git commit -m "feat: kitchen-sink gallery page (all-layouts)"
```

---

## Phase 13: Playwright visual regression

Snapshot the kitchen-sink gallery on every PR.

### Task 13.1: Install Playwright browsers

- [ ] Run: `npx playwright install --with-deps chromium`
      Expected: downloads Chromium + system dependencies.

### Task 13.2: Playwright config

**Files:** Create: `playwright.config.ts`

- [ ] **Step 1: Write config**

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  testMatch: /.*\.spec\.ts$/,
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:3031',
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run gallery',
    url: 'http://localhost:3031',
    timeout: 60_000,
    reuseExistingServer: !process.env.CI
  },
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.005 }
  }
})
```

- [ ] **Step 2: Commit:** `git add playwright.config.ts && git commit -m "chore: Playwright configuration"`

### Task 13.3: Visual regression spec

**Files:**

- Create: `tests/visual.spec.ts`
- Create: `tests/__screenshots__/.gitkeep`

- [ ] **Step 1: Write the spec**

```ts
import { test, expect } from '@playwright/test'

const SLIDE_COUNT = 30 // adjust to match the kitchen-sink page total
const SETTLE_MS = 200

async function settle(page: import('@playwright/test').Page) {
  await page.waitForFunction(() => document.fonts.ready)
  await page.waitForTimeout(SETTLE_MS)
}

test.describe('Kitchen-sink gallery', () => {
  for (let i = 1; i <= SLIDE_COUNT; i++) {
    test(`slide ${String(i).padStart(2, '0')}`, async ({ page }) => {
      await page.goto(`/${i}`)
      await settle(page)
      await expect(page).toHaveScreenshot(`slide-${String(i).padStart(2, '0')}.png`, {
        fullPage: false
      })
    })
  }
})
```

- [ ] **Step 2: Set actual slide count**

Run: `grep -c '^---$' pages/all-layouts.md` and adjust `SLIDE_COUNT`. Verify against Slidev's slide counter in dev mode.

- [ ] **Step 3: Generate baselines:** `npm run test:visual:update`
- [ ] **Step 4: Run against baselines:** `npm run test:visual` (should be all green).
- [ ] **Step 5: Commit baselines**

```bash
git add tests/visual.spec.ts tests/__screenshots__/
git commit -m "test: visual regression baselines for kitchen-sink"
```

### Task 13.4: tests/README.md

**Files:** Create: `tests/README.md`

- [ ] Document local commands (`npm run test:visual`, `:update`), when to update baselines, where CI artifacts go on failure.
- [ ] Commit.

---

## Phase 14: GitHub Actions — deploy workflow

### Task 14.1: Deploy workflow

**Files:** Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Write the workflow**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - name: Build
        run: npm run build -- --base /${{ github.event.repository.name }}/
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

> Slidev's `--base` flag has been stable; if a future version changes it, update accordingly. The double `--` is required to pass through `npm run`.

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: deploy to GitHub Pages on push to main"
```

---

## Phase 15: GitHub Actions — visual regression workflow

### Task 15.1: Visual regression workflow

**Files:** Create: `.github/workflows/visual-regression.yml`

- [ ] **Step 1: Write the workflow**

```yaml
name: Visual regression

on:
  pull_request:
    branches: [main]
  workflow_dispatch:

jobs:
  visual:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium
      - name: Run visual regression
        run: npm run test:visual
        env:
          CI: true
      - name: Upload diff artifacts on failure
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: |
            playwright-report/
            test-results/
          retention-days: 14
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/visual-regression.yml
git commit -m "ci: visual regression on PR"
```

---

## Phase 16: README and CONTENT-GUIDE

### Task 16.1: README

**Files:** Create: `README.md`

- [ ] **Step 1: Write README** with these sections:
  - Tagline + "built for external community speakers" note
  - Quick start (Use this template, set Pages → GitHub Actions, edit presenters/event/slides, push)
  - Local development commands
  - Updating to a new SAP brand version (5-step flow)
  - Importing foreign-branded slides (PPTX import + manual fallback)
  - "What's in the box" table
  - Link to CONTENT-GUIDE
  - License note (template MIT, brand assets remain SAP)
  - Versioning (template version vs brand version)

The full text is in the spec (Section 9.4) and CONTENT-GUIDE; copy and adapt.

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: README"
```

### Task 16.2: CONTENT-GUIDE

**Files:** Create: `CONTENT-GUIDE.md`

- [ ] **Step 1: Write CONTENT-GUIDE** with these sections:
  - Layout selection (decision-tree table: situation → layout)
  - Component decision tree
  - Slide-text length budgets per layout (table)
  - Image guidance (resolution, format, paths, foreign imports)
  - **SAP brand voice — curated public links only**: brand.sap.com, experience.sap.com, news.sap.com, help.sap.com, "verify forward-looking wording against latest SAP IR" note
  - Quality patterns (one thought per slide, show-then-tell, compose-don't-customize, short code blocks, demos fail loudly)
  - Anti-patterns (don't override colors, don't bypass `<Logo>`, don't long-form `<KeyTakeaway>`, don't hardcode hex, don't reuse slugs across namespaces, don't commit `dist/`)
  - Updating the brand (the 7-step flow)

> **Constraint:** **No internal-only URLs.** Every link must work for an external community speaker.

- [ ] **Step 2: Commit**

```bash
git add CONTENT-GUIDE.md
git commit -m "docs: CONTENT-GUIDE (layout/component conventions, brand voice links)"
```

### Task 16.3: CHANGELOG

**Files:** Create: `CHANGELOG.md`

- [ ] **Step 1: Write initial changelog**

```markdown
# Changelog

Two version dimensions:

- **Template version** (`package.json#version`) — structure, components, conventions
- **Brand version** (`package.json#brandVersion`) — POTX-derived

Both follow [semver](https://semver.org).

## [0.1.0] — 2026-06-13

### Initial release

- Slidev-based template with workspace-package theme (`slidev-theme-sap`)
- Brand extraction from `SAP_Corp.potx` → CSS tokens, layout manifest, raw media
- 28 layouts covering all 45 POTX layouts (variants collapsed via `variant` props)
- 14 components: `<Bio>`, `<Speaker>`, `<Team>`, `<DeveloperAdvocates>`, `<Agenda>`, `<EventBadge>`, `<Disclaimer>`, `<Roadmap>`, `<QRCode>`, `<SocialIcon>`, `<Logo>`, `<DemoCallout>`, `<CodeBlock>`, `<KeyTakeaway>`
- Data layer: `presenters/`, `teams/`, `programs/`, `event.yaml`, `snippets/`
- PPTX import script (LibreOffice, optional)
- Kitchen-sink gallery (`pages/all-layouts.md`)
- Playwright visual regression on PR
- GitHub Pages deploy on push to `main`
- README + CONTENT-GUIDE

### Brand version: 2024.1

- Initial extraction from `SAP_Corp.potx` (SAP Horizon palette, "72 Brand" typeface)
```

- [ ] **Step 2: Commit:** `git add CHANGELOG.md && git commit -m "docs: initial CHANGELOG"`

---

## Phase 17: Polish

### Task 17.1: Run full lint + tests

- [ ] `npm run lint` — passes
- [ ] `npm test` — all green
- [ ] `npm run test:visual` — all green
- [ ] Commit any fixes

### Task 17.2: Smoke-test the build

- [ ] `npm run build` — produces `dist/`
- [ ] `npx serve dist -p 4000` — click through every slide; verify fonts load, brand colors render, UI5 components have Horizon styling
- [ ] `npm run export` — produces working PDF

### Task 17.3: Verify no internal-only URLs

- [ ] Run grep:

```bash
grep -rE 'sapintra|sap.corp|saphana.com/internal|wiki.wdf.sap' . \
  --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git \
  --exclude-dir=tests/__screenshots__
```

Expected: no matches.

- [ ] Manually verify key URLs in `programs/developer-advocates.yaml`, `theme/layouts/brand-site.vue`, `CONTENT-GUIDE.md` return 2xx.

---

## Phase 18: Pre-merge checklist

### Task 18.1: Final checklist

- [ ] All Phase 1–17 tasks complete and committed
- [ ] `npm run lint` passes
- [ ] `npm test` passes
- [ ] `npm run test:visual` passes
- [ ] `npm run build` succeeds
- [ ] `npm run export` produces a working PDF
- [ ] `npm run extract-brand` is idempotent (no diff on second run)
- [ ] Demo deck (`slides.md`) renders end-to-end without console errors
- [ ] Kitchen-sink gallery (`npm run gallery`) renders end-to-end without console errors
- [ ] No internal-only URLs anywhere
- [ ] README quick-start instructions are accurate
- [ ] CONTENT-GUIDE links all resolve
- [ ] CHANGELOG entries match what shipped
- [ ] `package.json#brandVersion` matches the POTX hash in `_extracted/README.md`

### Task 18.2: Merge

- [ ] **Step 1: Push:** `git push origin feat/initial-implementation`
- [ ] **Step 2: Open PR:**

```bash
gh pr create --base main --head feat/initial-implementation \
  --title "Initial implementation: SAP Presentation Template v0.1.0" \
  --body "Implements docs/superpowers/specs/2026-06-13-sap-presentation-template-design.md"
```

- [ ] **Step 3: Wait for CI to pass.** Investigate failures.
- [ ] **Step 4: Merge:** `gh pr merge --squash --delete-branch`

### Task 18.3: Tag the release

- [ ] `git checkout main && git pull`
- [ ] `git tag v0.1.0 -m "Initial release" && git push --tags`
- [ ] `gh release create v0.1.0 --title "v0.1.0 — Initial release" --notes-file CHANGELOG.md`
- [ ] Verify the demo deck is live at `https://<username>.github.io/<repo-name>/`

### Task 18.4: Mark template-ready

- [ ] **Step 1:** Repo Settings → check "Template repository"
- [ ] **Step 2:** Add topics: `sap`, `slidev`, `presentation-template`, `fiori`, `vue`, `github-pages`
- [ ] **Step 3:** Smoke-test "Use this template" in a browser; delete the test repo afterward

---

## Done

The template is live, documented, and ready for forks. Subsequent work (more layouts, internationalization, analytics, etc.) lives in v1.x plans against the spec's "Open questions" and "Out-of-scope" lists.

<!-- PLAN_END_MARKER -->
