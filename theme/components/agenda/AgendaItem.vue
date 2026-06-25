<!-- theme/components/agenda/AgendaItem.vue -->
<script setup lang="ts">
  import { computed } from 'vue'

  const props = withDefaults(
    defineProps<{
      /** 0-based index in the parent list. Rendered as 1-based, zero-padded to 2 digits. */
      index: number
      title: string
      /** Optional POTX-style description shown below the title. */
      description?: string
      /** When true, suppresses the hairline below this row (last item in list). */
      isLast?: boolean
    }>(),
    {
      isLast: false
    }
  )

  const numLabel = computed(() => String(props.index + 1).padStart(2, '0'))
</script>

<template>
  <div :class="['agenda-item', { 'agenda-item--with-hairline': !isLast }]">
    <div class="agenda-item__num">{{ numLabel }}</div>
    <div class="agenda-item__body">
      <div class="agenda-item__title">{{ title }}</div>
      <div v-if="description" class="agenda-item__description">{{ description }}</div>
    </div>
  </div>
</template>

<style scoped>
  /* All px-equivalent values scale by --agenda-density (set on the parent
     .agenda-layout). 1.0 for ≤5 items; smaller for denser lists. The CSS
     variable falls back to 1.0 if a caller uses this component standalone. */
  .agenda-item {
    display: grid;
    grid-template-columns: max-content 1fr;
    column-gap: 1.25rem;
    align-items: start;
    /* v0.4.2.3: 0.8% → 0.4% to claw back vertical space; POTX item-row
       still reads as well-spaced when 6 items render on a 1080px slide.
       v0.5.2: scaled by --agenda-density for ≥6-item agendas. */
    padding-bottom: calc(0.4% * var(--agenda-density, 1));
  }
  .agenda-item--with-hairline {
    /* Per POTX measurement: 2px solid sap-blue-6 hairline between items.
       Hairline margin reduced (1.5% → 0.8%) in v0.4.2.3 so 6 items fit
       within slide height without clipping the last row. */
    border-bottom: 2px solid var(--sap-blue-6, #1b90ff);
    margin-bottom: calc(0.8% * var(--agenda-density, 1));
  }
  .agenda-item__num {
    font-family: var(--sap-font-family-bold, var(--sap-font-major));
    font-weight: 700;
    /* POTX label height: 88px on 1080-tall slide ≈ 8.1% — match with rem-equivalent. */
    font-size: calc(3.25rem * var(--agenda-density, 1));
    line-height: 1;
    color: var(--sap-text-primary, #000);
    min-width: calc(4.5rem * var(--agenda-density, 1));
  }
  .agenda-item__body {
    display: flex;
    flex-direction: column;
    gap: calc(0.4rem * var(--agenda-density, 1));
  }
  .agenda-item__title {
    font-family: var(--sap-font-family-bold, var(--sap-font-major));
    font-weight: 700;
    /* POTX label is roughly 50px on 1080 ≈ 4.6% */
    font-size: calc(1.85rem * var(--agenda-density, 1));
    line-height: 1.1;
    color: var(--sap-text-primary, #000);
  }
  .agenda-item__description {
    /* POTX description is 26px on 1080 ≈ 2.4% */
    font-size: calc(1rem * var(--agenda-density, 1));
    line-height: 1.4;
    color: var(--sap-text-primary, #000);
    opacity: 0.7;
  }
</style>
