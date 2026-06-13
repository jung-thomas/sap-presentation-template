<script setup lang="ts">
  defineProps<{ title?: string }>()
</script>

<template>
  <div class="layout title-only">
    <h1 v-if="title">
      {{ title }}
    </h1>
    <slot />
  </div>
</template>

<style scoped>
  .title-only {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 4rem 5rem;
    height: 100%;
  }
  .title-only h1 {
    font-size: 4rem;
    color: var(--sap-brand-blue-darker);
  }
</style>
