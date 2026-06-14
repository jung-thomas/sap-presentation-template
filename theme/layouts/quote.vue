<script setup lang="ts">
  import { computed } from 'vue'
  import ClassificationFooter from '../components/ClassificationFooter.vue'

  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = computed(() => props.frontmatter ?? {})
  const classification = computed(() => fm.value.classification as string | null | undefined)
</script>

<template>
  <div class="layout quote">
    <blockquote>
      <slot />
    </blockquote>
    <footer v-if="fm.author">
      <span class="author">— {{ fm.author }}</span>
      <span v-if="fm.source" class="source">, {{ fm.source }}</span>
    </footer>
    <ClassificationFooter :level="classification" />
  </div>
</template>

<style scoped>
  .quote {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 5rem;
    height: 100%;
  }
  blockquote {
    font-size: var(--typography-quote-title-size, 2.75rem);
    line-height: var(--typography-quote-title-line-height, 1.3);
    color: var(--sap-brand-blue-darker);
    margin: 0 0 2rem;
    font-weight: 500;
    position: relative;
  }
  blockquote::before {
    content: '\201C';
    position: absolute;
    top: -3rem;
    left: -1rem;
    font-size: 8rem;
    color: var(--sap-brand-blue-pale);
    line-height: 1;
  }
  footer {
    font-size: var(--typography-quote-body-size, 1.25rem);
    color: var(--sapContent_LabelColor);
  }
  .author {
    font-weight: 600;
  }
</style>
