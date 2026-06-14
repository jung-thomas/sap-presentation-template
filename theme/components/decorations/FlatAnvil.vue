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
  <svg viewBox="0 0 605 297" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
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
