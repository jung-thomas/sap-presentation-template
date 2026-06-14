<script setup lang="ts">
  import { computed } from 'vue'
  import iconsCatalog from '../styles/_extracted/icons.json'
  import { assetUrl } from '../setup/assets'

  type IconEntry = { src: string; viewBox: string }
  const catalog = iconsCatalog as Record<string, IconEntry>

  const props = withDefaults(
    defineProps<{
      name: string
      color?: string
      size?: string | number
    }>(),
    { color: 'currentColor', size: '1em' }
  )

  const entry = computed(() => {
    const e = catalog[props.name]
    if (!e) console.warn(`[SapIcon] unknown icon name: "${props.name}"`)
    return e
  })

  const sizeStyle = computed(() => {
    const s = typeof props.size === 'number' ? `${props.size}px` : props.size
    return { width: s, height: s }
  })
</script>

<template>
  <span class="sap-icon" :style="{ ...sizeStyle, color }">
    <img v-if="entry" :src="assetUrl(entry.src)" alt="" />
  </span>
</template>

<style scoped>
  .sap-icon {
    display: inline-block;
    vertical-align: middle;
  }
  .sap-icon img {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
