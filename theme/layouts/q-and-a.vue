<script setup lang="ts">
  import { computed } from 'vue'
  import ClassificationFooter from '../components/ClassificationFooter.vue'

  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = computed(() => props.frontmatter ?? {})
  const presenter = computed(() => fm.value.presenter as string | undefined)
  const classification = computed(() => fm.value.classification as string | null | undefined)
</script>

<template>
  <div class="layout q-and-a">
    <h1>Questions?</h1>
    <p class="prompt">Ask now, or find me later.</p>
    <Bio :presenter="presenter" compact />
    <slot />
    <ClassificationFooter :level="classification" />
  </div>
</template>

<style scoped>
  .q-and-a {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 1.5rem;
    padding: 4rem 5rem;
    height: 100%;
    background: linear-gradient(135deg, var(--sap-brand-blue-pale), #fff);
  }
  h1 {
    font-size: var(--typography-content-title-size, 5rem);
    line-height: var(--typography-content-title-line-height, 1.1);
    color: var(--sap-brand-blue-darker);
    margin: 0;
  }
  .prompt {
    font-size: var(--typography-content-body-size, 1.5rem);
    line-height: var(--typography-content-body-line-height, 1.4);
    color: var(--sapContent_LabelColor);
    margin: 0;
  }
</style>
