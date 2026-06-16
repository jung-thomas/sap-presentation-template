<!-- theme/components/decorations/FlatAnvil.vue -->
<script setup lang="ts">
  withDefaults(
    defineProps<{
      color?: string // CSS color
      rotate?: number // 0 only (any other value warns in dev)
    }>(),
    {
      color: 'var(--sap-blue-7)',
      rotate: 0
    }
  )
</script>

<template>
  <!-- The anvil silhouette is a brand mark and MUST NOT be distorted (SAP brand
       guidelines, hard rule). preserveAspectRatio defaults to xMidYMid meet,
       which preserves the canonical 605:297 ≈ 2.04:1 ratio. The host container
       MUST be sized at the same aspect ratio (use `aspect-ratio: 605 / 297;` in
       the consumer's CSS) so the SVG fills it without letterboxing. -->
  <svg viewBox="0 0 605 297" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0 0 297 307.459 297 605 0 0 0Z" :fill="color" />
  </svg>
</template>

<style scoped>
  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
