<!-- theme/layouts/agenda.vue -->
<script setup lang="ts">
  import { computed } from 'vue'
  import AgendaItem from '../components/agenda/AgendaItem.vue'
  import HandPlacedAnvils from '../components/decorations/HandPlacedAnvils.vue'
  import ClassificationFooter from '../components/ClassificationFooter.vue'

  type AgendaItemData = {
    title: string
    description?: string
    /** v0.3 backward-compat: nested bullet list. Renders below description if both present. */
    subsections?: string[]
  }

  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = computed(() => props.frontmatter ?? {})
  const classification = computed(() => fm.value.classification as string | null | undefined)
  const items = computed<AgendaItemData[]>(() => {
    const raw = fm.value.items
    if (!Array.isArray(raw)) return []
    // v0.3 supported items as plain strings; coerce.
    return raw.map((it) => (typeof it === 'string' ? { title: it } : (it as AgendaItemData)))
  })

  // v0.3 backward-compat: only render nested bullets if showSubsections is true (legacy default).
  const agendaConfig = computed(() => (fm.value.agenda as { showSubsections?: boolean }) ?? {})
  const showSubsections = computed(() => agendaConfig.value.showSubsections === true)

  /**
   * v0.5.2: when an agenda has ≥6 items with descriptions, the cumulative
   * row height exceeds the 1080px slide. Rather than ship a fixed density
   * tuned for one item count, expose a density scale to the AgendaItem
   * component via a CSS variable. 1.0 for ≤5 items (the original POTX
   * spec); steps down for denser lists.
   */
  const densityScale = computed(() => {
    const n = items.value.length
    if (n <= 5) return 1.0
    if (n === 6) return 0.82
    if (n === 7) return 0.72
    return 0.62 // 8+ items — author should split, but render legibly anyway
  })
</script>

<template>
  <div
    class="layout agenda-layout"
    :style="{ '--agenda-density': densityScale }"
  >
    <div class="agenda-content">
      <h1 class="agenda-title">{{ fm.title ?? 'Agenda' }}</h1>
      <div class="agenda-list">
        <div v-for="(item, i) in items" :key="i" class="agenda-row">
          <AgendaItem
            :index="i"
            :title="item.title"
            :description="item.description"
            :is-last="i === items.length - 1"
          />
          <ul
            v-if="showSubsections && item.subsections && item.subsections.length"
            class="agenda-subsections"
          >
            <li v-for="(s, j) in item.subsections" :key="j">{{ s }}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="agenda-decoration">
      <HandPlacedAnvils shape="portrait" />
    </div>
    <ClassificationFooter :level="classification" />
  </div>
</template>

<style scoped>
  /* POTX agenda-b: 1920×1080 → 66.56% left content + 33.44% right anvil column.
     1278/1920 = 66.5625% (left), 642/1920 = 33.4375% (right). */
  .agenda-layout {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #ffffff;
  }
  .agenda-content {
    position: absolute;
    top: 0;
    left: 0;
    /* Use 66.56% width, 4.2% horizontal padding (POTX-derived item-row left position).
       Tightened top padding (8.4% → 6%) and inter-row gap (1.5rem → 0.5rem) in
       v0.4.2.3 so 6 agenda items fit within 1080px slide height without
       clipping the last row. */
    width: 66.56%;
    height: 100%;
    padding: 6% 4.2% 3% 4.2%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .agenda-decoration {
    /* Right-column band painted with sap-blue-10 navy; HandPlacedAnvils
       renders the anvil pattern over it. */
    position: absolute;
    left: 66.56%;
    right: 0;
    top: 0;
    bottom: 0;
    background: var(--sap-blue-10);
    z-index: 0;
  }
  .agenda-title {
    font-family: var(--sap-font-family-bold, var(--sap-font-major));
    font-weight: 700;
    /* POTX title 47px on 1080-tall slide ≈ 4.4% */
    font-size: calc(2.5rem * var(--agenda-density, 1));
    line-height: 1;
    color: var(--sap-text-primary, #000);
    margin: 0 0 0.5rem;
  }
  .agenda-list {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0; /* allows flex children to shrink below content-intrinsic */
  }
  .agenda-row {
    /* Each row contains an AgendaItem + (optional) v0.3 subsections. */
  }
  .agenda-subsections {
    list-style: disc inside;
    margin: 0.5rem 0 1rem 4.5rem;
    padding: 0;
    color: var(--sap-text-primary, #000);
    opacity: 0.6;
    font-size: 0.95rem;
  }
  .agenda-subsections li {
    padding: 0.15rem 0;
  }
  /* Suppress the global slide-styles ::after accent — agenda doesn't use it. */
  .agenda-layout::after {
    content: none !important;
  }
</style>
