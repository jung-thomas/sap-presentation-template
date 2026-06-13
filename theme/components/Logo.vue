<script setup lang="ts">
  const props = defineProps<{
    variant?: string
    alt?: string
    ext?: 'svg' | 'png'
  }>()
  const variant = props.variant ?? 'logo-sap-primary'
  const ext = props.ext ?? 'svg'
  const src = `/logos/${variant}.${ext}`
</script>

<template>
  <img :src="src" :alt="alt ?? variant" class="sap-logo" />
</template>

<style scoped>
  .sap-logo {
    height: 2.5rem;
    width: auto;
  }
</style>
