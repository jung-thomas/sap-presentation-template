<script setup lang="ts">
  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = props.frontmatter ?? {}
</script>

<template>
  <div class="layout title-text">
    <h1 v-if="fm.title">
      {{ fm.title }}
    </h1>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
  .title-text {
    padding: 3rem 4rem;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .title-text h1 {
    font-size: 2.75rem;
    color: var(--sap-brand-blue-darker);
    margin-bottom: 1.5rem;
  }
  .title-text .content {
    flex: 1;
    font-size: 1.25rem;
    line-height: 1.55;
  }
</style>
