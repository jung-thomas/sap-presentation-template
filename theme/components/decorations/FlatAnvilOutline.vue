<script setup lang="ts">
  withDefaults(
    defineProps<{
      /** Stroke color (any CSS color). Defaults to sap-blue-6 per POTX qa.png. */
      color?: string
      /** Stroke width in viewBox units (605×297). Default 6 ≈ thin 1080-relative outline. */
      strokeWidth?: number
    }>(),
    {
      color: 'var(--sap-blue-6)',
      strokeWidth: 6
    }
  )
</script>

<template>
  <!-- The anvil silhouette is a brand mark and MUST NOT be distorted (SAP brand
       guidelines, hard rule). Default preserveAspectRatio (xMidYMid meet) keeps
       the canonical 605:297 ≈ 2.04:1 trapezoid. Hosts MUST size their container
       at the same ratio (`aspect-ratio: 605 / 297;`) so the SVG fills it. -->
  <svg viewBox="0 0 605 297" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0 0 0 297 307.459 297 605 0 0 0Z"
      fill="none"
      :stroke="color"
      :stroke-width="strokeWidth"
    />
  </svg>
</template>

<style scoped>
  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
