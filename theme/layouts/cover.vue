<!-- theme/layouts/cover.vue -->
<script setup lang="ts">
  import { computed } from 'vue'
  import { resolveCoverVariant, getVariantSpec } from '../setup/cover-variants'
  import { computeKeepOut } from '../setup/clear-space'
  import { COVER_TOKENS } from '../setup/cover-tokens'
  import { assetUrl } from '../setup/assets'
  import Speaker from '../components/Speaker.vue'
  import ClassificationFooter from '../components/ClassificationFooter.vue'
  import { getEvent } from '../setup/data'

  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = computed(() => props.frontmatter ?? {})

  const variant = computed(() => resolveCoverVariant(fm.value.variant as string | undefined))
  const spec = computed(() => getVariantSpec(variant.value))
  const isDark = computed(() => spec.value.textOnBg === 'light')
  const logoSrc = computed(() =>
    assetUrl(isDark.value ? '/logos/logo-sap-white.svg' : '/logos/logo-sap-primary.svg')
  )
  const presenter = computed(() => fm.value.presenter as string | undefined)
  const image = computed(() =>
    assetUrl((fm.value.image as string | undefined) ?? '/sap/covers/cover-1.png')
  )
  const classification = computed(() => fm.value.classification as string | null | undefined)
  const eventName = computed(() => (fm.value.event as string) ?? getEvent().name)

  // Clear-space derived from cover-tokens.css default values (the SAP shield's
  // POTX position). When cover-tokens shifts these, the keep-out box follows.
  const keepOut = computeKeepOut(COVER_TOKENS)
</script>

<template>
  <div
    :class="['cover', `cover--${variant}`, { 'cover--dark': isDark }]"
    :style="{ background: spec.background }"
  >
    <component
      v-for="(Decoration, i) in spec.decorations"
      :key="i"
      :is="Decoration"
      :image="image"
      :clear-space="keepOut"
    />
    <img class="cover-logo" :src="logoSrc" alt="SAP" />
    <div class="cover-content">
      <h1 v-if="fm.title">{{ fm.title }}</h1>
      <p v-if="fm.subtitle" class="subtitle">{{ fm.subtitle }}</p>
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
    color: var(--sap-text-primary);
    font-family: var(--sap-font-family);
  }
  .cover--dark .cover-content {
    color: #ffffff;
  }
  .cover h1 {
    font-size: var(--typography-cover-title-size, 3rem);
    line-height: var(--typography-cover-title-line-height, 0.9);
    margin: 0 0 1rem;
    font-family: var(--sap-font-family-bold);
    color: inherit;
  }
  .cover .subtitle {
    font-size: 1.5rem;
    opacity: 0.9;
    margin: 0 0 2rem;
  }
  .cover-footer {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    opacity: 0.85;
  }
  .cover-footer .event {
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .cover::after {
    content: none !important;
  }
</style>
