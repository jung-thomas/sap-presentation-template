<script setup lang="ts">
  import { computed } from 'vue'
  import ClassificationFooter from '../components/ClassificationFooter.vue'

  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = computed(() => props.frontmatter ?? {})
  const classification = computed(() => fm.value.classification as string | null | undefined)
</script>

<template>
  <div class="layout text-screenshot">
    <h1 v-if="fm.title">
      {{ fm.title }}
    </h1>
    <div class="grid">
      <div class="text-area">
        <slot />
      </div>
      <div class="screenshot-area">
        <slot name="screenshot" />
      </div>
    </div>
    <ClassificationFooter :level="classification" />
  </div>
</template>

<style scoped>
  .text-screenshot {
    padding: 3rem 4rem;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .text-screenshot h1 {
    font-size: 2.75rem;
    color: var(--sap-brand-blue-darker);
    margin-bottom: 1.5rem;
  }
  .grid {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 2.5rem;
    align-items: start;
  }
  .text-area {
    font-size: 1.15rem;
    line-height: 1.55;
  }
  .screenshot-area :deep(img) {
    width: 100%;
    height: auto;
    border-radius: var(--sap-radius-card);
    border: 1px solid #e5e9ed;
    box-shadow: var(--sap-shadow-card);
    object-fit: contain;
  }
</style>
