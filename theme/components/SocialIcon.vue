<script setup lang="ts">
  import type { SocialLink } from '../types'
  import { socialUrl } from '../setup/social'

  const props = defineProps<{ platform: SocialLink['platform']; handle: string; url?: string }>()
  const href = socialUrl({ platform: props.platform, handle: props.handle, url: props.url })
  const label = `${props.platform}: ${props.handle}`
</script>

<template>
  <a :href="href" :aria-label="label" class="social-icon" target="_blank" rel="noopener">
    <span class="platform">{{ platform }}</span>
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
    text-transform: capitalize;
    font-weight: 600;
  }
  .handle {
    opacity: 0.85;
  }
</style>
