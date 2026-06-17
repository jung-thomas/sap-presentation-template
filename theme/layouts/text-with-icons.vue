<script setup lang="ts">
  import { computed } from 'vue'
  import SapIcon from '../components/SapIcon.vue'
  import ClassificationFooter from '../components/ClassificationFooter.vue'

  type Item = {
    icon: string
    title: string
    description?: string
    iconColor?: string
    link?: { text: string; url: string }
  }

  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = computed(() => props.frontmatter ?? {})
  const items = computed<Item[]>(() => {
    const raw = fm.value.items
    return Array.isArray(raw) ? (raw as Item[]) : []
  })
  const classification = computed(() => fm.value.classification as string | null | undefined)

  // Warn (in any env) when items is missing — helps authors who set the
  // layout but forgot the items: array. Cost in production is one console
  // call per render of an empty layout, which is negligible. Keeps the
  // unit test deterministic across DEV/PROD env detection.
  if (items.value.length === 0) {
    console.warn('[text-with-icons] no items provided — slide will render only the title (if set).')
  }

  // Locked grid rules per spec §4.2.
  const columnCount = computed(() => {
    const n = items.value.length
    if (n === 0) return 1
    if (n <= 3) return n // 1, 2, or 3 cols
    if (n === 4) return 2 // 2×2
    return 3 // 5+: 3 cols (5 → 3+2 centered, 6 → 3×2, 7+ → 3×N)
  })

  // For the 5-item case, the last 2 cells need to be visually centered in
  // their row. Mark cells 3 + 4 (0-based) with .center-bottom-row so CSS
  // can shift them by half a column.
  const cellClass = (i: number) => {
    const n = items.value.length
    if (n === 5 && i >= 3) return 'center-bottom-row'
    return ''
  }
</script>

<template>
  <div class="layout text-with-icons">
    <h1 v-if="fm.title" class="text-with-icons-title">{{ fm.title }}</h1>
    <div :class="['text-with-icons-grid', `cols-${columnCount}`]">
      <div v-for="(item, i) in items" :key="i" :class="['text-with-icons-cell', cellClass(i)]">
        <SapIcon
          :name="item.icon"
          class="text-with-icons-icon"
          size="79px"
          :color="item.iconColor ?? 'var(--sap-blue-7)'"
        />
        <h3 class="text-with-icons-cell-title">{{ item.title }}</h3>
        <p v-if="item.description" class="text-with-icons-cell-desc">{{ item.description }}</p>
        <a
          v-if="item.link"
          :href="item.link.url"
          class="text-with-icons-cell-link"
          target="_blank"
          rel="noopener"
          >{{ item.link.text }} ›</a
        >
      </div>
    </div>
    <ClassificationFooter :level="classification" />
  </div>
</template>

<style scoped>
  .text-with-icons {
    position: relative;
    width: 100%;
    height: 100%;
    background: #ffffff;
    color: var(--sap-text-primary, #000);
    font-family: var(--sap-font-family);
    padding: 4.2% 4.2% 0 4.2%;
    box-sizing: border-box;
  }
  .text-with-icons-title {
    font-family: var(--sap-font-family-bold, var(--sap-font-family));
    font-weight: 700;
    font-size: 1.5rem; /* 24pt ≈ 1.5rem */
    line-height: 1.1;
    margin: 0 0 1.5rem;
  }
  .text-with-icons-grid {
    display: grid;
    column-gap: 2%;
    row-gap: 5%;
    width: 100%;
  }
  .text-with-icons-grid.cols-1 {
    grid-template-columns: 1fr;
  }
  .text-with-icons-grid.cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }
  .text-with-icons-grid.cols-3 {
    grid-template-columns: repeat(3, 1fr);
  }
  .text-with-icons-cell {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .text-with-icons-icon {
    margin-bottom: 0.4rem;
  }
  .text-with-icons-cell-title {
    font-family: var(--sap-font-family-bold, var(--sap-font-family));
    font-weight: 600;
    font-size: 1rem; /* 16pt ≈ 1rem */
    line-height: 1.2;
    margin: 0;
  }
  .text-with-icons-cell-desc {
    font-size: 0.875rem; /* 14pt ≈ 0.875rem */
    line-height: 1.4;
    margin: 0;
  }
  .text-with-icons-cell-link {
    font-size: 0.875rem;
    color: var(--sap-blue-7);
    text-decoration: none;
    margin-top: 0.25rem;
  }
  .text-with-icons-cell-link:hover {
    text-decoration: underline;
  }
  /* Suppress global ::after accent. */
  .text-with-icons::after {
    content: none !important;
  }
  /* 5-item case: shift cells 4 + 5 (= grid cells 4 and 5 of a 3-col grid) so
     they land in cols 1.5 and 2.5 respectively, centering the bottom row.
     Cell width = column width (1fr cells), so translateX(50%) shifts each
     cell by exactly half a column = correct centering offset. The
     column-gap: 2% introduces a half-gap drift but is visually negligible. */
  .text-with-icons-grid.cols-3 .text-with-icons-cell.center-bottom-row:nth-child(4) {
    grid-column: 1 / 2;
    transform: translateX(50%);
  }
  .text-with-icons-grid.cols-3 .text-with-icons-cell.center-bottom-row:nth-child(5) {
    grid-column: 2 / 3;
    transform: translateX(50%);
  }
</style>
