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
  <div class="anvil-grid" :style="style" aria-hidden="true"></div>
</template>

<style scoped>
  .anvil-grid {
    position: absolute;
    inset: 0;
    background-repeat: repeat;
    /* Tile SVG is 240×120 (anvil in top-left quadrant, whitespace right + below).
       Render the tile at 200×100 — keeps the 2:1 tile ratio so the anvil
       inside the tile renders at its canonical 2.04:1 silhouette without
       distortion (brand rule: never distort the anvil). The whitespace in
       the SVG produces visible gaps between repeated anvils, matching the
       POTX divider-c pattern (no "shark teeth"). */
    background-size: 200px 100px;
    pointer-events: none;
  }
</style>
