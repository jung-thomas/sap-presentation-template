<script setup lang="ts">
  import { computed } from 'vue'
  import { assetUrl } from '../setup/assets'

  const props = withDefaults(
    defineProps<{
      /** When true, renders the white SAP logo (use on dark backgrounds). */
      invert?: boolean
    }>(),
    { invert: false }
  )

  const logoSrc = computed(() =>
    assetUrl(props.invert ? '/logos/logo-sap-white.svg' : '/logos/logo-sap-primary.svg')
  )
</script>

<template>
  <div class="tagline-lockup">
    <img class="tagline-logo" :src="logoSrc" alt="SAP" />
    <span class="tagline-text">Bring out your best.</span>
  </div>
</template>

<style scoped>
  .tagline-lockup {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    font-family: var(--sap-font-family-bold, var(--sap-font-major));
    font-weight: 700;
    color: var(--sap-text-primary, #000);
  }
  .tagline-logo {
    /* POTX shows the logo at roughly the same height as the tagline text. */
    height: 2rem;
    width: auto;
    aspect-ratio: 2 / 1;
  }
  .tagline-text {
    font-size: 1.5rem;
    line-height: 1;
  }
</style>
