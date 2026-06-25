<script setup lang="ts">
  import { computed } from 'vue'
  import ClassificationFooter from '../components/ClassificationFooter.vue'

  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = computed(() => props.frontmatter ?? {})
  const classification = computed(() => fm.value.classification as string | null | undefined)
</script>

<template>
  <div class="layout title-text">
    <h1 v-if="fm.title">
      {{ fm.title }}
    </h1>
    <div class="content">
      <slot />
    </div>
    <ClassificationFooter :level="classification" />
  </div>
</template>

<style scoped>
  /* v0.5.2: explicit font-family + bg + padding because Slidev's
     .slidev-layout global rule doesn't apply here (root class is .layout,
     not .slidev-layout). Earlier versions relied on browser defaults for
     the h1 font and let content overflow the slide when authors stacked
     multiple components inside <slot />. */
  .title-text {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 3rem 4rem 4rem 4rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    color: var(--sap-text-primary, #000);
    font-family: var(--sap-font-family, var(--sap-font-major));
    overflow: hidden;
  }
  .title-text h1 {
    font-family: var(--sap-font-family-bold, var(--sap-font-major));
    font-weight: 700;
    font-size: var(--typography-content-title-size, 2.75rem);
    line-height: var(--typography-content-title-line-height, 1.1);
    color: var(--sap-brand-blue-darker);
    margin: 0 0 1.5rem 0;
    flex-shrink: 0;
  }
  /* Content area: takes the remaining height, grids tall children so
     two stacked components (e.g., two <Bio> cards) sit side-by-side
     instead of stacking vertically and overflowing the slide. */
  .title-text .content {
    flex: 1 1 0;
    min-height: 0;
    font-size: var(--typography-content-body-size, 1.25rem);
    line-height: var(--typography-content-body-line-height, 1.55);
    display: grid;
    grid-auto-columns: minmax(0, 1fr);
    grid-auto-flow: column;
    gap: 1.5rem;
    align-items: stretch;
    overflow: hidden;
  }
  /* When the slot has only one child, the auto-column grid collapses to
     one column at full width — same effect as the old flex column layout. */
  .title-text .content > :only-child {
    grid-column: 1 / -1;
  }
</style>
