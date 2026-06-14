<!-- theme/components/decorations/AnvilGridDecoration.vue -->
<script setup lang="ts">
  import { computed } from 'vue'
  import { assetUrl } from '../../setup/assets'

  const props = withDefaults(
    defineProps<{
      color?: string // CSS color (anvil fill — uses currentColor cascade)
      bg?: string // CSS color OR 'photo' (background behind anvils)
    }>(),
    {
      color: 'var(--sap-blue-6)',
      bg: 'var(--sap-blue-11)'
    }
  )

  // assetUrl prepends import.meta.env.BASE_URL for GitHub Pages deploys.
  const tileUrl = computed(() => assetUrl('/sap/anvil-tile.svg'))

  const style = computed(() => ({
    color: props.color,
    backgroundColor: props.bg === 'photo' ? 'transparent' : props.bg,
    backgroundImage: `url(${tileUrl.value})`
  }))
</script>

<template>
  <div class="anvil-grid" :style="style"></div>
</template>

<style scoped>
  .anvil-grid {
    position: absolute;
    inset: 0;
    background-repeat: repeat;
    background-size: 60px 30px;
    pointer-events: none;
  }
</style>
