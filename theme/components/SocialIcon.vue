<script setup lang="ts">
  import { computed } from 'vue'
  import type { SocialLink, SocialPlatform } from '../types'
  import { socialUrl } from '../setup/social'

  const props = defineProps<{ platform: SocialLink['platform']; handle: string; url?: string }>()
  const href = socialUrl({ platform: props.platform, handle: props.handle, url: props.url })

  // Brand-correct display labels — the identifier keys are lowercase
  // (linkedin, github, …) but the rendered label needs each brand's
  // canonical capitalization (LinkedIn, GitHub, YouTube, Bluesky, …).
  // CSS text-transform: capitalize handled only the first letter and
  // produced 'Github'/'Linkedin'.
  const DISPLAY_LABELS: Record<SocialPlatform, string> = {
    linkedin: 'LinkedIn',
    github: 'GitHub',
    twitter: 'Twitter',
    x: 'X',
    mastodon: 'Mastodon',
    bsky: 'Bluesky',
    youtube: 'YouTube',
  }
  const displayLabel = computed(() => DISPLAY_LABELS[props.platform] ?? props.platform)
  const ariaLabel = computed(() => `${displayLabel.value}: ${props.handle}`)
</script>

<template>
  <a :href="href" :aria-label="ariaLabel" class="social-icon" target="_blank" rel="noopener">
    <span class="platform">{{ displayLabel }}</span>
    <span class="handle">{{ handle }}</span>
  </a>
</template>

<style scoped>
  .social-icon {
    display: inline-flex;
    gap: 0.4rem;
    align-items: baseline;
    padding: 0.25rem 0.6rem;
    border-radius: var(--sap-radius-button);
    background: var(--sap-brand-blue-pale);
    color: var(--sap-brand-blue-dark);
    text-decoration: none;
    font-size: 0.95rem;
    margin-right: 0.4rem;
  }
  .social-icon:hover {
    background: var(--sap-brand-blue);
    color: #fff;
  }
  .platform {
    /* DISPLAY_LABELS in the script provides brand-correct casing;
       no text-transform here. */
    font-weight: 600;
  }
  .handle {
    opacity: 0.85;
  }
</style>
