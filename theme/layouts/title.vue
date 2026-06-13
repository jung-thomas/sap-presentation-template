<script setup lang="ts">
  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = props.frontmatter ?? {}
</script>

<template>
  <div class="layout title">
    <div class="title-inner">
      <h1 v-if="fm.title">
        {{ fm.title }}
      </h1>
      <p v-if="fm.subtitle" class="subtitle">
        {{ fm.subtitle }}
      </p>
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
    font-size: var(--typography-cover-title-size, 4.5rem);
    line-height: var(--typography-cover-title-line-height, 1.0);
    color: var(--sap-brand-blue-darker);
    margin-bottom: 1rem;
  }
  .subtitle {
    font-size: 1.75rem;
    color: var(--sapContent_LabelColor);
    margin: 0;
  }
</style>
