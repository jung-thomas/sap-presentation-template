<script setup lang="ts">
  defineProps<{ title?: string; subtitle?: string }>()
</script>

<template>
  <div class="layout title">
    <div class="title-inner">
      <h1 v-if="title">{{ title }}</h1>
      <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
      <slot />
    </div>
  </div>
</template>

<style scoped>
  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 100%;
    padding: 4rem 6rem;
  }
  .title-inner {
    max-width: 70%;
  }
  .title h1 {
    font-size: 4.5rem;
    color: var(--sap-brand-blue-darker);
    margin-bottom: 1rem;
  }
  .subtitle {
    font-size: 1.75rem;
    color: var(--sapContent_LabelColor);
    margin: 0;
  }
</style>
