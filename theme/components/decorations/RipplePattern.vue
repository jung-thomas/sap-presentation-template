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
    /* Anvil-pattern decorations should never sit underneath title or body
       text — per SAP brand examples on brand.sap.com, the ripple appears as
       a thin decorative band along the slide edge. Each placement variant
       below sets a height capped well below the title/content region.
       Slight opacity preserves readability if a long title line overflows
       toward the band; the SAP brand examples show the ripple at full
       saturation but always with text safely above it. */
    opacity: 0.85;
  }
  .ripple-bottom {
    left: 0;
    right: 0;
    bottom: 0;
    height: 12%;
  }
  .ripple-top {
    left: 0;
    right: 0;
    top: 0;
    height: 12%;
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
    /* `contain` preserves the SVG's natural ~3.4:1 aspect (5242×1553), so the
       anvils render at their intended density inside the band. `cover` would
       upscale the pattern beyond the band (and over the title text). */
    object-fit: contain;
    object-position: bottom;
  }
  .ripple-top .ripple-img,
  .ripple-top .ripple-inline :deep(svg) {
    object-position: top;
  }
  .ripple-inline :deep(path) {
    fill: var(--ripple-color) !important;
  }
</style>
