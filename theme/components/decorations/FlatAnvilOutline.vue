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
  <svg viewBox="0 0 605 297" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
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
