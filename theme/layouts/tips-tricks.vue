<script setup lang="ts">
  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = props.frontmatter ?? {}
</script>

<template>
  <div class="layout tips-tricks">
    <h1 v-if="fm.title">
      {{ fm.title }}
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
    /* Inherits font-family/weight/size/color from .slidev-layout h1 in
       slide-styles.css; size comes from --typography-content-title-size. */
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
