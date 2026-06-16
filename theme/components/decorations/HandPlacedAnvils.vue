<!-- theme/components/decorations/HandPlacedAnvils.vue -->
<script setup lang="ts">
  /**
   * Renders the canonical SAP anvil background pattern, sourced verbatim
   * from `SAP_Corp.potx` → `ppt/media/image38.svg` (id `Ripple_Pattern`).
   *
   * 1,040 individual anvil shapes, hand-placed by the brand designers.
   * viewBox 5242.82 × 1553.5, color sap-blue-6 (#1B90FF) baked in.
   *
   * The SVG is fetched and parsed into a Vue-managed DOM tree at mount-time
   * (NOT injected via innerHTML, to avoid an XSS-shaped pattern even though
   * the asset is a trusted same-origin resource). We don't use
   * `background-image: url(...)` because the browser's intrinsic-size
   * fallback (300×150) overrides the SVG's viewBox-implied dimensions and
   * renders each tiny anvil glyph as ~1 pixel. Inline insertion lets the
   * SVG element fill its parent via width/height: 100% while preserving
   * the viewBox-driven internal coordinates.
   *
   * SHAPE: the source SVG is 3.38:1 (wide). When rendered into a band that
   * shares that aspect (thank-you, divider-c, Bio team-mode = ~3.55:1)
   * the default 'wide' crop matches POTX slide-6's srcRect. A narrow
   * portrait container (agenda right column ≈ 0.59:1) needs a different
   * slice from the source — `shape: 'portrait'` picks one suited to that.
   *
   * NOTE: the color is fixed at sap-blue-6 (the value embedded in the
   * source SVG paths) since that's the only color the brand uses for
   * this pattern.
   */
  import { onMounted, ref } from 'vue'
  import { assetUrl } from '../../setup/assets'

  const props = withDefaults(
    defineProps<{
      /**
       * Crop preset matching the POTX slide where this pattern is used.
       *   - 'wide' (default): for full-width bands ~3.5:1 (thank-you,
       *     divider-c, Bio team-mode). Mimics POTX slide-6 srcRect.
       *   - 'portrait': for narrow tall containers like the agenda
       *     right column (~0.6:1). Selects a vertical slice from the
       *     source SVG so anvils render at native pixel scale.
       */
      shape?: 'wide' | 'portrait'
    }>(),
    { shape: 'wide' }
  )

  const root = ref<HTMLElement | null>(null)

  // Source viewBox dimensions
  const SRC_W = 5242.82
  const SRC_H = 1553.5

  // Crop windows. Values mimic POTX srcRect from slide-6 for 'wide';
  // 'portrait' is hand-tuned to expose a narrow vertical strip from the
  // source so anvils fill the agenda column without distortion.
  function cropWindow(shape: 'wide' | 'portrait') {
    if (shape === 'portrait') {
      // Take a ~10% wide × 100% tall slice from near the source's right
      // edge (where the density looks balanced). Width ≈ 524, height ≈ 1554.
      // 524/1554 = 0.34 ratio — close to the agenda column's ~0.59:1, so
      // slice cropping is minimal.
      return {
        x: SRC_W * 0.45,
        y: 0,
        w: SRC_W * 0.1,
        h: SRC_H,
      }
    }
    // 'wide' default
    return {
      x: SRC_W * 0.032,
      y: -SRC_H * 0.009,
      w: SRC_W * (1 - 0.032 - 0.422),
      h: SRC_H * (1 - -0.009 - 0.5),
    }
  }

  onMounted(async () => {
    if (!root.value) return
    try {
      const url = assetUrl('/sap/anvil-pattern-source.svg')!
      const res = await fetch(url)
      const text = await res.text()
      const parsed = new DOMParser().parseFromString(text, 'image/svg+xml')
      const svg = parsed.documentElement
      if (svg.nodeName !== 'svg') {
        throw new Error('expected <svg> root, got <' + svg.nodeName + '>')
      }
      const c = cropWindow(props.shape)
      svg.setAttribute('viewBox', `${c.x} ${c.y} ${c.w} ${c.h}`)
      svg.setAttribute('width', '100%')
      svg.setAttribute('height', '100%')
      svg.setAttribute('preserveAspectRatio', 'xMidYMid slice')
      ;(svg as SVGElement).style.overflow = 'hidden'
      while (root.value.firstChild) root.value.removeChild(root.value.firstChild)
      root.value.appendChild(document.importNode(svg, true))
    } catch (err) {
      console.warn('[HandPlacedAnvils] failed to load source SVG:', err)
    }
  })
</script>

<template>
  <div ref="root" class="hand-placed-anvils" aria-hidden="true"></div>
</template>

<style scoped>
  .hand-placed-anvils {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }
</style>
