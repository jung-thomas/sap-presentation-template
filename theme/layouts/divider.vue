<script setup lang="ts">
  import { computed } from 'vue'
  import AnvilGridDecoration from '../components/decorations/AnvilGridDecoration.vue'
  import FlatAnvil from '../components/decorations/FlatAnvil.vue'
  import ClassificationFooter from '../components/ClassificationFooter.vue'
  import { assetUrl } from '../setup/assets'

  type Variant = 'a' | 'b' | 'c' | 'd'

  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = computed(() => props.frontmatter ?? {})
  const variant = computed<Variant>(() => {
    const raw = ((fm.value.variant as string) ?? 'a').toLowerCase()
    return ['a', 'b', 'c', 'd'].includes(raw) ? (raw as Variant) : 'a'
  })

  // Logo position is top-left at top: 7.35%. Only variant b has a dark
  // background there (sap-blue-6); a, c, d all sit on white at that anchor
  // (c's anvil-tile band starts at 49.8%, d's pale band at 25.9%). Use the
  // primary (color) logo on a/c/d; only b warrants the white logo.
  const useColorLogo = computed(() => variant.value !== 'b')
  const logoSrc = computed(() =>
    assetUrl(useColorLogo.value ? '/logos/logo-sap-primary.svg' : '/logos/logo-sap-white.svg')
  )

  const classification = computed(() => fm.value.classification as string | null | undefined)
</script>

<template>
  <div :class="['divider', `divider--${variant}`]">
    <!-- Variant b: 4 FlatAnvil shapes per POTX divider-b multi-shape composition. -->
    <template v-if="variant === 'b'">
      <FlatAnvil class="divider-flat-anvil divider-flat-anvil--br1" color="var(--sap-blue-10)" />
      <FlatAnvil class="divider-flat-anvil divider-flat-anvil--br2" color="var(--sap-blue-7)" />
      <FlatAnvil class="divider-flat-anvil divider-flat-anvil--tl" color="var(--sap-blue-2)" />
      <FlatAnvil class="divider-flat-anvil divider-flat-anvil--cl" color="var(--sap-blue-7)" />
    </template>

    <!-- Variant c: bottom 50% AnvilGridDecoration band -->
    <AnvilGridDecoration
      v-if="variant === 'c'"
      class="divider-anvil-grid"
      bg="var(--sap-blue-10)"
      color="var(--sap-blue-6)"
    />

    <!-- Variant d: pale-blue horizontal band y=280-805 (≈26% to 74.5% of height) -->
    <div v-if="variant === 'd'" class="divider-band" />

    <img class="divider-logo" :src="logoSrc" alt="SAP" />
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
    font-family: var(--sap-font-family);
  }
  .divider--a {
    background: #ffffff;
    color: var(--sap-text-primary);
  }
  .divider--b {
    background: var(--sap-blue-6);
    color: #ffffff;
  }
  .divider--c {
    background: #ffffff;
    color: var(--sap-text-primary);
  }
  .divider--d {
    background: #ffffff;
    color: var(--sap-text-primary);
  }

  .divider-anvil-grid {
    top: 49.8% !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
  }

  .divider-band {
    position: absolute;
    left: 0;
    right: 0;
    top: 25.9%;
    bottom: 25.5%;
    background: var(--sap-blue-2);
    z-index: 1;
  }

  .divider-flat-anvil {
    position: absolute;
    z-index: 1;
  }
  .divider-flat-anvil--br1 {
    right: 5%;
    bottom: 8%;
    width: 38%;
    height: 28%;
  }
  .divider-flat-anvil--br2 {
    right: 12%;
    bottom: 38%;
    width: 22%;
    height: 16%;
  }
  .divider-flat-anvil--tl {
    left: 6%;
    top: 8%;
    width: 18%;
    height: 14%;
  }
  .divider-flat-anvil--cl {
    left: 22%;
    top: 42%;
    width: 16%;
    height: 12%;
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
    top: 40%;
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
