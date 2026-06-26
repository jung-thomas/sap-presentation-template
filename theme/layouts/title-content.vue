<script setup lang="ts">
  import { computed } from 'vue'
  import ClassificationFooter from '../components/ClassificationFooter.vue'

  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = computed(() => props.frontmatter ?? {})
  const classification = computed(() => fm.value.classification as string | null | undefined)
</script>

<template>
  <div class="layout title-content">
    <h1 v-if="fm.title">
      {{ fm.title }}
    </h1>
    <div class="content">
      <slot />
    </div>
    <ClassificationFooter :level="classification" />
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
    /* Inherits font-family/weight/size/color from .slidev-layout h1 in
       slide-styles.css; size comes from --typography-content-title-size. */
  }
  .title-content .content {
    flex: 1;
    font-size: var(--typography-content-body-size, 1.25rem);
    line-height: var(--typography-content-body-line-height, 1.55);
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
