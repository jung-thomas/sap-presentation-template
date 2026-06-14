<script setup lang="ts">
  import FlatAnvil from './FlatAnvil.vue'

  withDefaults(
    defineProps<{
      cols?: number
      rows?: number
      background?: string
      anvilColor?: string
    }>(),
    {
      cols: 24,
      rows: 4,
      background: 'var(--sap-blue-11)',
      anvilColor: 'var(--sap-blue-7)'
    }
  )
</script>

<template>
  <div
    class="anvil-grid"
    :style="{
      background,
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, 1fr)`
    }"
  >
    <div v-for="i in cols * rows" :key="i" class="anvil-cell">
      <FlatAnvil :color="anvilColor" />
    </div>
  </div>
</template>

<style scoped>
  .anvil-grid {
    position: absolute;
    inset: 0;
    display: grid;
    pointer-events: none;
  }
  .anvil-cell {
    overflow: hidden;
    opacity: 0.6;
    padding: 6%;
  }
</style>
