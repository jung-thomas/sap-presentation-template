<script setup lang="ts">
  import { computed } from 'vue'
  import HandPlacedAnvils from '../components/decorations/HandPlacedAnvils.vue'
  import ClassificationFooter from '../components/ClassificationFooter.vue'
  import { assetUrl } from '../setup/assets'

  /**
   * The POTX has a single divider design (slide 6 of SAP_Corp.potx):
   *   - top half: white background, title in black
   *   - bottom half: navy (sap-blue-10) with the canonical anvil pattern
   *     in sap-blue-6, rendered via <HandPlacedAnvils>
   *
   * v0.4.2 introduced four variants (a/b/c/d), but only one — variant c —
   * matched the actual POTX. v0.4.2.3 collapses to the single canonical
   * design. The `variant:` front-matter field is no longer read; existing
   * decks that set it will see the canonical design instead. CHANGELOG
   * notes the breaking change.
   */
  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = computed(() => props.frontmatter ?? {})
  const classification = computed(() => fm.value.classification as string | null | undefined)
  const logoSrc = computed(() => assetUrl('/logos/logo-sap-primary.svg'))
</script>

<template>
  <div class="divider">
    <!-- Bottom 50% navy band with the canonical POTX anvil pattern -->
    <div class="divider-anvil-band">
      <HandPlacedAnvils />
    </div>

    <!-- POTX has the SAP logo top-left in primary color (sits on the white
         top half). -->
    <img class="divider-logo" :src="logoSrc" alt="SAP" />

    <!-- Title sits in the white top half. POTX measurement: y=22-30% of
         slide height. -->
    <div class="divider-content">
      <h1 class="divider-title">{{ fm.title }}</h1>
      <slot />
    </div>

    <ClassificationFooter :level="classification" />
  </div>
</template>

<style scoped>
  .divider {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #ffffff;
    color: var(--sap-text-primary);
    font-family: var(--sap-font-family);
  }

  .divider-anvil-band {
    position: absolute;
    top: 49.8%;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--sap-blue-10);
    z-index: 1;
  }

  .divider-logo {
    position: absolute;
    top: 7.35%;
    left: 4.13%;
    width: 5.96%;
    aspect-ratio: 2 / 1;
    height: auto;
    z-index: 3;
  }

  .divider-content {
    position: absolute;
    /* POTX divider title sits at y=22% of slide height, in the white top half */
    top: 22%;
    left: 4.13%;
    right: 4.13%;
    z-index: 3;
  }

  .divider-title {
    font-family: var(--sap-font-family-bold, var(--sap-font-major));
    font-weight: 700;
    font-size: 3rem;
    line-height: 1.1;
    margin: 0;
    color: inherit;
  }

  .divider::after {
    content: none !important;
  }
</style>
