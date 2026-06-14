<script setup lang="ts">
  import { computed } from 'vue'

  const props = withDefaults(
    defineProps<{
      value: number
      of: number
      color?: string
      size?: 'sm' | 'md' | 'lg'
    }>(),
    { color: 'var(--sap-blue-7)', size: 'md' }
  )

  const fraction = computed(() => Math.max(0, Math.min(props.value, props.of)) / props.of)
  const px = computed(() => ({ sm: 16, md: 24, lg: 32 })[props.size])

  const sectorPath = computed(() => {
    const f = fraction.value
    if (f === 0) return ''
    const r = 8
    const cx = 10,
      cy = 10
    if (f >= 1) return `M${cx},${cy - r} A${r},${r} 0 1 1 ${cx - 0.001},${cy - r} Z`
    const angle = f * 2 * Math.PI - Math.PI / 2
    const x = cx + r * Math.cos(angle)
    const y = cy + r * Math.sin(angle)
    const largeArc = f > 0.5 ? 1 : 0
    return `M${cx},${cy} L${cx},${cy - r} A${r},${r} 0 ${largeArc} 1 ${x},${y} Z`
  })
</script>

<template>
  <svg
    :width="px"
    :height="px"
    viewBox="0 0 20 20"
    :style="{ color }"
    :aria-label="`${value} of ${of}`"
    role="img"
  >
    <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="1.5" />
    <path v-if="sectorPath" :d="sectorPath" fill="currentColor" />
  </svg>
</template>
