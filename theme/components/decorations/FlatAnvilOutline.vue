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
    <!-- vector-effect keeps the stroke a uniform CSS-pixel width regardless of
         the host container's aspect ratio. Without it, preserveAspectRatio="none"
         scales x and y independently and renders horizontal vs vertical strokes
         at different pixel widths (visibly distorted on non-2:1 frames). -->
    <path
      d="M0 0 0 297 307.459 297 605 0 0 0Z"
      fill="none"
      :stroke="color"
      :stroke-width="strokeWidth"
      vector-effect="non-scaling-stroke"
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
