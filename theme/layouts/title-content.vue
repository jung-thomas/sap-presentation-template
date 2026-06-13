<script setup lang="ts">
  defineProps<{ title?: string }>()
</script>

<template>
  <div class="layout title-content">
    <h1 v-if="title">{{ title }}</h1>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
  .title-content {
    padding: 3rem 4rem;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .title-content h1 {
    font-size: 2.75rem;
    color: var(--sap-brand-blue-darker);
    margin-bottom: 1.5rem;
  }
  .title-content .content {
    flex: 1;
    font-size: 1.25rem;
    line-height: 1.55;
  }
  .title-content .content :deep(h2) {
    font-size: 1.5rem;
    color: var(--sap-brand-blue-dark);
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  .title-content .content :deep(h3) {
    font-size: 1.2rem;
    color: var(--sap-brand-blue);
    margin-top: 1rem;
    margin-bottom: 0.4rem;
    font-weight: 600;
  }
</style>
