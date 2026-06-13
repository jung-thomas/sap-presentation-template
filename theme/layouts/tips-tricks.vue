<script setup lang="ts">
  defineProps<{ title?: string }>()
</script>

<template>
  <div class="layout tips-tricks">
    <h1 v-if="title">
      {{ title }}
    </h1>
    <div class="grid">
      <slot />
    </div>
  </div>
</template>

<style scoped>
  .tips-tricks {
    padding: 3rem 4rem;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .tips-tricks h1 {
    font-size: 2.5rem;
    color: var(--sap-brand-blue-darker);
    margin-bottom: 1.5rem;
  }
  .grid {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    align-content: start;
  }
  .grid :deep(h3) {
    font-size: 1.2rem;
    color: var(--sap-brand-blue-dark);
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  .grid :deep(p),
  .grid :deep(li) {
    font-size: 1rem;
    line-height: 1.5;
    color: var(--sapTextColor);
  }
</style>
