<script setup lang="ts">
  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = props.frontmatter ?? {}
</script>

<template>
  <div class="layout title-image-third">
    <h1 v-if="fm.title">
      {{ fm.title }}
    </h1>
    <div class="grid">
      <div class="text-area">
        <slot />
      </div>
      <div class="image-area">
        <slot name="image" />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .title-image-third {
    padding: 3rem 4rem;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .title-image-third h1 {
    font-size: 2.75rem;
    color: var(--sap-brand-blue-darker);
    margin-bottom: 1.5rem;
  }
  .grid {
    flex: 1;
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2.5rem;
    align-items: start;
  }
  .text-area {
    font-size: 1.15rem;
    line-height: 1.55;
  }
  .image-area :deep(img) {
    width: 100%;
    height: auto;
    border-radius: var(--sap-radius-card);
    object-fit: cover;
  }
</style>
