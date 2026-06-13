<script setup lang="ts">
  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = props.frontmatter ?? {}
</script>

<template>
  <div class="layout title-only">
    <h1 v-if="fm.title">
      {{ fm.title }}
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
    font-size: var(--typography-content-title-size, 4rem);
    line-height: var(--typography-content-title-line-height, 1.1);
    color: var(--sap-brand-blue-darker);
  }
</style>
