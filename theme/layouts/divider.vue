<script setup lang="ts">
  import { computed } from 'vue'
  import RipplePattern from '../components/decorations/RipplePattern.vue'
  import FlatAnvil from '../components/decorations/FlatAnvil.vue'
  import ClassificationFooter from '../components/ClassificationFooter.vue'
  import { assetUrl } from '../setup/assets'

  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = computed(() => props.frontmatter ?? {})
  const variant = computed(() => ((fm.value.variant as string) ?? 'a').toLowerCase())
  const isDark = computed(() => variant.value !== 'a') // a is light, b/c/d dark
  const logoSrc = computed(() =>
    assetUrl(isDark.value ? '/logos/logo-sap-white.svg' : '/logos/logo-sap-primary.svg')
  )
  const classification = computed(() => fm.value.classification as string | null | undefined)
</script>

<template>
  <div :class="['divider', `divider--${variant}`, { 'divider--dark': isDark }]">
    <RipplePattern v-if="variant !== 'b'" placement="full" />
    <FlatAnvil v-if="variant === 'b'" />
    <img class="divider-logo" :src="logoSrc" alt="SAP" />
    <div class="divider-content">
      <h1 v-if="fm.title">{{ fm.title }}</h1>
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
  }
  .divider--a {
    background: #ffffff;
    color: var(--sap-text-primary);
  }
  .divider--b {
    background: var(--sap-blue-10);
    color: #fff;
  }
  .divider--c {
    background: var(--sap-blue-11);
    color: #fff;
  }
  .divider--d {
    background: var(--sap-blue-7);
    color: #fff;
  }
  .divider-logo {
    position: absolute;
    top: var(--cover-logo-top, 7.35%);
    left: var(--cover-logo-left, 4.13%);
    width: var(--cover-logo-width, 5.96%);
    aspect-ratio: 2 / 1;
    z-index: 2;
  }
  .divider-content {
    position: absolute;
    top: 40%;
    left: 4.13%;
    right: 4.13%;
    z-index: 2;
    font-family: var(--sap-font-family);
  }
  .divider h1 {
    font-family: var(--sap-font-family-bold);
    font-size: 3rem;
    margin: 0;
  }
</style>
