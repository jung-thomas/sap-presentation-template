<!-- theme/components/cover/CoverContent.vue -->
<script setup lang="ts">
  import { computed } from 'vue'
  import { assetUrl } from '../../setup/assets'
  import { resolvePresenter } from '../../setup/data'
  import PartnerLogoPlaceholder from './PartnerLogoPlaceholder.vue'

  const props = defineProps<{
    /** L-half background color; passed through from cover.vue's variant spec. */
    bg: string
    /** 'light' = white text + white logo; 'dark' = navy text + color logo. */
    textOnL: 'light' | 'dark'
    title: string
    presenter?: string
    /** ISO 8601 date string. Falls back to today if undefined. */
    date?: string
    /** Three-state partner logo (passed through to PartnerLogoPlaceholder). */
    partnerLogo?: string | null
  }>()

  const logoSrc = computed(() =>
    assetUrl(
      props.textOnL === 'light' ? '/logos/logo-sap-white.svg' : '/logos/logo-sap-primary.svg'
    )
  )

  const presenterData = computed(() => (props.presenter ? resolvePresenter(props.presenter) : null))

  // Format the date as POTX shows it: "Month Date, Year" (e.g., "September 15, 2026").
  const formattedDate = computed(() => {
    const raw = props.date ? new Date(props.date) : new Date()
    if (Number.isNaN(raw.getTime())) return ''
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(raw)
  })
</script>

<template>
  <div :class="['cover-content', `cover-content--${textOnL}`]" :style="{ background: bg }">
    <img class="cover-logo" :src="logoSrc" alt="SAP" />

    <h1 class="cover-title">{{ title }}</h1>

    <div class="cover-byline">
      <span v-if="presenterData" class="cover-name">
        {{ presenterData.name }}, {{ presenterData.title }}
      </span>
      <span class="cover-date">{{ formattedDate }}</span>
    </div>

    <PartnerLogoPlaceholder :logo="partnerLogo" :text-on-l="textOnL" class="cover-partner" />
  </div>
</template>

<style scoped>
  .cover-content {
    position: relative;
    width: 60%;
    height: 100%;
    padding: 5% 4%;
    display: flex;
    flex-direction: column;
    font-family: var(--sap-font-family);
  }
  .cover-content--dark {
    color: var(--sap-text-primary, #1a2733);
  }
  .cover-content--light {
    color: #ffffff;
  }
  .cover-logo {
    width: 8%;
    height: auto;
    aspect-ratio: 2 / 1;
    margin-bottom: auto; /* pushes everything else down */
  }
  .cover-title {
    font-family: var(--sap-font-family-bold);
    font-size: clamp(2rem, 4.5vw, 3.5rem);
    line-height: 1.05;
    margin: 0 0 1.5rem;
    color: inherit;
  }
  .cover-byline {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
  }
  .cover-byline .cover-date {
    opacity: 0.75;
  }
  .cover-partner {
    margin-top: auto;
  }
</style>
