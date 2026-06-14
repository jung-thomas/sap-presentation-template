<script setup lang="ts">
  import { computed } from 'vue'
  import { resolveCoverVariant, getDecoration, useDarkLogo } from '../setup/cover-variants'
  import { assetUrl } from '../setup/assets'
  import Speaker from '../components/Speaker.vue'
  import ClassificationFooter from '../components/ClassificationFooter.vue'
  import { getEvent } from '../setup/data'

  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = computed(() => props.frontmatter ?? {})

  const variantLetter = computed(() => resolveCoverVariant(fm.value.variant as string | undefined))
  const Decoration = computed(() => getDecoration(variantLetter.value))
  const isDarkBg = computed(() =>
    useDarkLogo(variantLetter.value, fm.value.image as string | undefined)
  )
  const logoSrc = computed(() =>
    assetUrl(isDarkBg.value ? '/logos/logo-sap-white.svg' : '/logos/logo-sap-primary.svg')
  )
  const presenter = computed(() => fm.value.presenter as string | undefined)
  const image = computed(() => assetUrl(fm.value.image as string | undefined))

  const eventData = getEvent()
  const eventName = computed(() => (fm.value.event as string) ?? eventData.name)
  const classification = computed(() => fm.value.classification as string | null | undefined)
</script>

<template>
  <div :class="['cover', `cover--${variantLetter}`, { 'cover--dark': isDarkBg }]">
    <component :is="Decoration" :variant="variantLetter" :image="image" />
    <img class="cover-logo" :src="logoSrc" alt="SAP" />
    <div class="cover-content">
      <h1 v-if="fm.title">
        {{ fm.title }}
      </h1>
      <p v-if="fm.subtitle" class="subtitle">
        {{ fm.subtitle }}
      </p>
      <slot />
      <footer class="cover-footer">
        <Speaker :presenter="presenter" />
        <span class="event">{{ eventName }}</span>
      </footer>
    </div>
    <ClassificationFooter :level="classification" />
  </div>
</template>

<style scoped>
  .cover {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .cover-logo {
    position: absolute;
    top: var(--cover-logo-top, 7.35%);
    left: var(--cover-logo-left, 4.13%);
    width: var(--cover-logo-width, 5.96%);
    /* SVGs without intrinsic dimensions need an explicit aspect-ratio.
       The POTX places the logo in a 727192 × 360000 EMU box ≈ 2:1 wide.
       Both logo SVG variants render with a transparent canvas where the
       wordmark fills roughly half the canvas height, so 2:1 keeps the
       visual size consistent with the POTX. */
    aspect-ratio: 2 / 1;
    height: auto;
    z-index: 2;
  }
  .cover-content {
    position: absolute;
    top: var(--cover-title-top, 39.46%);
    left: var(--cover-title-left, 4.13%);
    width: var(--cover-title-width, 39.08%);
    z-index: 2;
    color: var(--sap-brand-blue-darker);
  }
  .cover--dark .cover-content {
    color: #ffffff;
  }
  .cover h1 {
    font-size: var(--typography-cover-title-size, 3rem);
    line-height: var(--typography-cover-title-line-height, 0.9);
    margin: 0 0 1rem;
    font-weight: 700;
    color: inherit;
  }
  .cover .subtitle {
    font-size: 1.5rem;
    color: inherit;
    opacity: 0.9;
    margin: 0 0 2rem;
  }
  .cover-footer {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    color: inherit;
    opacity: 0.85;
  }
  .cover-footer .event {
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  /* Suppress the global slide-styles ::after accent — covers don't use it */
  .cover::after {
    content: none !important;
  }
</style>
