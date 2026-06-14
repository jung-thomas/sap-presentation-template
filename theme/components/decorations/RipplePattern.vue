<!-- theme/components/decorations/RipplePattern.vue -->
<script setup lang="ts">
  import { computed, ref, watchEffect } from 'vue'
  import { assetUrl } from '../../setup/assets'

  type Placement = 'top' | 'bottom' | 'full' | 'hero-band'

  interface ClearSpace {
    top: number
    left: number
    width: number
    height: number
  }

  const props = withDefaults(
    defineProps<{
      color?: string
      placement?: Placement
      inline?: boolean
      clearSpace?: ClearSpace | null
    }>(),
    {
      color: 'var(--sap-blue-6)',
      placement: 'bottom',
      inline: false,
      clearSpace: null
    }
  )

  const src = computed(() => assetUrl('/sap/anvil-ripple.svg'))

  const inlineSvg = ref<string>('')
  watchEffect(async () => {
    if (props.inline) {
      const m = await import('/sap/anvil-ripple.svg?raw')
      inlineSvg.value = m.default
    }
  })

  const placementClass = computed(() => `ripple-${props.placement}`)
</script>

<template>
  <div class="ripple-wrapper" :class="placementClass" :style="{ '--ripple-color': color }">
    <img v-if="!inline" :src="src" alt="" class="ripple-img" />
    <div v-else class="ripple-inline" v-html="inlineSvg"></div>
  </div>
</template>

<style scoped>
  .ripple-wrapper {
    position: absolute;
    pointer-events: none;
    z-index: 1;
  }
  .ripple-bottom {
    left: 0;
    right: 0;
    bottom: 0;
    height: 30%;
  }
  .ripple-top {
    left: 0;
    right: 0;
    top: 0;
    height: 30%;
  }
  .ripple-full {
    inset: 0;
  }
  .ripple-hero-band {
    left: 0;
    right: 0;
    top: 0;
    height: 40%;
  }

  .ripple-img,
  .ripple-inline :deep(svg) {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .ripple-inline :deep(path) {
    fill: var(--ripple-color) !important;
  }
</style>
