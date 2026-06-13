---
theme: ./theme
title: "Building Cloud-Native Apps with SAP CAP"
info: |
  A demonstration deck showcasing all SAP Presentation Template layouts and components.
  Event: Sample Event 2026
---

<script setup>
const roadmapPhases = [
  {
    label: 'Phase 1',
    status: 'available',
    items: ['CDS data modelling', 'OData service exposure', 'SQLite local dev'],
  },
  {
    label: 'Phase 2',
    status: 'in-development',
    items: ['HANA Cloud deployment', 'Authentication with XSUAA', 'Fiori Elements UI'],
  },
  {
    label: 'Phase 3',
    status: 'planned',
    items: ['Event-driven messaging', 'Remote service integration', 'AI extensions'],
  },
]
</script>

---
layout: cover
title: "Building Cloud-Native Apps with SAP CAP"
subtitle: "From zero to production on BTP"
presenter: thomas-jung
variant: a
---

---
layout: agenda
title: Agenda
items:
  - Foundations of CAP
  - The data modelling layer
  - Service definitions & OData
  - Deploying to BTP
  - Live demo
  - Q & A
---

---
layout: divider
title: Foundations
variant: a
---

Part 1 of 6

---
layout: title-text
title: What is SAP CAP?
---

The **SAP Cloud Application Programming Model** (CAP) is a framework of languages, libraries, and tools for building cloud-native business applications on SAP BTP.

- Uses **CDS** (Core Data Services) for data and service definitions
- Supports **Node.js** and **Java** runtimes
- Built-in support for OData v2/v4, REST, and GraphQL
- First-class integration with SAP HANA Cloud, XSUAA, and the Destination Service

<KeyTakeaway>CAP lets you focus on domain logic — the framework handles persistence, protocols, and security boilerplate.</KeyTakeaway>

---
layout: title-text-2col
title: CAP vs. Classic ABAP Development
---

::left::

**Classic ABAP**

- Tightly coupled to the ABAP stack
- SQL via OpenSQL with direct table access
- BAPI/RFC for integration
- Long release cycles

::right::

**SAP CAP**

- Cloud-native, stack-agnostic
- CQL queries via `cds.ql` (no raw SQL)
- OData + events for integration
- Continuous delivery on BTP

---
layout: title-content
title: The Data Modelling Layer
---

```sql
namespace my.bookshop;
using { managed } from '@sap/cds/common';

entity Books : managed {
  key ID     : Integer;
  title      : localized String(111);
  author     : Association to Authors;
  stock      : Integer;
  price      : Decimal(9,2);
}

entity Authors : managed {
  key ID   : Integer;
  name     : String(111);
  books    : Composition of many Books on books.author = $self;
}
```

<CodeBlock lang="CDS" filename="db/schema.cds" caption="Managed entities get createdAt/createdBy/modifiedAt/modifiedBy for free." />

---
layout: title-text
title: Service Definitions
---

CDS services are **projection layers** over your domain entities. They control what is exposed, to whom, and in what shape.

```sql
service CatalogService @(path: '/browse') {
  @readonly entity Books as SELECT from my.Books
    { *, author.name as authorName }
    where stock > 0;
}
```

- `@readonly` generates GET + $metadata automatically
- `where` clause filters at the DB level — no N+1
- Annotations like `@requires` enforce role-based access

<DemoCallout kind="live" fallback="walk through the code on screen" />

---
layout: divider
title: Live Demo
variant: b
---

Let's deploy to BTP

---
layout: title-text
title: The Deployment Pipeline
---

```bash
# 1. Build for production
cds build --production

# 2. One-stop deploy to BTP
cds up
```

<KeyTakeaway>cds up replaces the multi-step mbt build → cf deploy chain for standard CAP projects.</KeyTakeaway>

A single Cloud Foundry application manifest is generated automatically from your `package.json` and `mta.yaml`.

---
layout: title-text-2col
title: Speaker Profiles
---

::left::

<Bio presenter="thomas-jung" />

::right::

Meet the SAP Developer Advocates team — community-focused engineers who run workshops, write tutorials, and speak at SAP events worldwide.

<Speaker presenter="thomas-jung" />

---
layout: title-content
title: SAP Developer Advocates Programme
---

<DeveloperAdvocates />

---
layout: title-content
title: CAP Feature Roadmap
---

<Roadmap :phases="roadmapPhases" />

---
layout: q-and-a
presenter: thomas-jung
---

---
layout: thank-you
presenter: thomas-jung
variant: a
---
