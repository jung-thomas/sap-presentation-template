<!-- theme/components/cover/PartnerLogoPlaceholder.vue -->
<script setup lang="ts">
  import { computed } from 'vue'
  import { assetUrl } from '../../setup/assets'

  const props = defineProps<{
    /** Three states:
     *   undefined → dashed-border placeholder with "Add partner logo and alt text"
     *   string    → <img> with that src
     *   null      → renders nothing at all
     */
    logo?: string | null
    /** Cascades from the cover variant: 'light' = white text, 'dark' = brand-blue-darker.
     *  Determines border color (white-dashed vs grey-dashed). */
    textOnL: 'light' | 'dark'
  }>()

  const src = computed(() => (typeof props.logo === 'string' ? assetUrl(props.logo) : null))
  const placeholderClass = computed(() =>
    props.textOnL === 'light' ? 'placeholder-light' : 'placeholder-dark'
  )
</script>

<template>
  <div v-if="logo !== null" class="partner-logo">
    <img v-if="src" :src="src" alt="Partner logo" />
    <div v-else :class="['partner-placeholder', placeholderClass]">
      <span>Add partner logo <br />and alt text</span>
    </div>
  </div>
</template>

<style scoped>
  .partner-logo {
    width: 12%;
    aspect-ratio: 3 / 2;
  }
  .partner-logo img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .partner-placeholder {
    width: 100%;
    height: 100%;
    border: 1.5px dashed currentColor;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 0.55rem;
    line-height: 1.2;
  }
  .placeholder-light {
    color: rgba(255, 255, 255, 0.65);
  }
  .placeholder-dark {
    color: var(--sap-grey-7, #475e75);
  }
</style>
