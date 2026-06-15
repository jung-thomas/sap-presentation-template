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
  .agenda-item {
    display: grid;
    grid-template-columns: max-content 1fr;
    column-gap: 1.25rem;
    align-items: start;
    padding-bottom: 0.8%;
  }
  .agenda-item--with-hairline {
    /* Per POTX measurement: 2px solid sap-blue-6 hairline between items.
       The 1.5%/0 padding above/below the hairline matches POTX item-row height. */
    border-bottom: 2px solid var(--sap-blue-6, #1b90ff);
    margin-bottom: 1.5%;
  }
  .agenda-item__num {
    font-family: var(--sap-font-family-bold, var(--sap-font-major));
    font-weight: 700;
    /* POTX label height: 88px on 1080-tall slide ≈ 8.1% — match with rem-equivalent. */
    font-size: 3.25rem;
    line-height: 1;
    color: var(--sap-text-primary, #000);
    min-width: 4.5rem;
  }
  .agenda-item__body {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .agenda-item__title {
    font-family: var(--sap-font-family-bold, var(--sap-font-major));
    font-weight: 700;
    /* POTX label is roughly 50px on 1080 ≈ 4.6% */
    font-size: 1.85rem;
    line-height: 1.1;
    color: var(--sap-text-primary, #000);
  }
  .agenda-item__description {
    /* POTX description is 26px on 1080 ≈ 2.4% */
    font-size: 1rem;
    line-height: 1.4;
    color: var(--sap-text-primary, #000);
    opacity: 0.7;
  }
</style>
