<script setup lang="ts">
  import { computed } from 'vue'
  import ClassificationFooter from '../components/ClassificationFooter.vue'

  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = computed(() => props.frontmatter ?? {})
  const classification = computed(() => fm.value.classification as string | null | undefined)
</script>

<template>
  <div class="layout title-text-3col">
    <h1 v-if="fm.title">
      {{ fm.title }}
    </h1>
    <div class="cols">
      <div class="col">
        <slot name="left" />
      </div>
      <div class="col">
        <slot name="middle" />
      </div>
      <div class="col">
        <slot name="right" />
      </div>
    </div>
    <ClassificationFooter :level="classification" />
  </div>
</template>

<style scoped>
  .title-text-3col {
    padding: 3rem 4rem;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .title-text-3col h1 {
    font-size: var(--typography-content-title-size, 2.75rem);
    line-height: var(--typography-content-title-line-height, 1.1);
    color: var(--sap-brand-blue-darker);
    margin-bottom: 1.5rem;
  }
  .cols {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 2rem;
  }
  .col {
    font-size: var(--typography-content-body-size, 1.05rem);
    line-height: var(--typography-content-body-line-height, 1.55);
  }
</style>
