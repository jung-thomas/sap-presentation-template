<script setup lang="ts">
  import { assetUrl } from '../../setup/assets'

  withDefaults(
    defineProps<{
      placement?: 'top-right' | 'bottom-right'
    }>(),
    { placement: 'top-right' }
  )
</script>

<template>
  <img
    :src="assetUrl('/sap/wordmark.png')"
    alt="SAP"
    class="wordmark"
    :class="`pos-${placement}`"
  />
</template>

<style scoped>
  .wordmark {
    position: absolute;
    height: auto;
    opacity: 0.85;
    pointer-events: none;
  }
  .pos-top-right {
    top: 5%;
    right: 5%;
    width: 12%;
  }
  .pos-bottom-right {
    bottom: 5%;
    right: 5%;
    width: 12%;
  }
</style>
