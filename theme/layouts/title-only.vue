<script setup lang="ts">
  import { computed } from 'vue'
  import ClassificationFooter from '../components/ClassificationFooter.vue'

  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = computed(() => props.frontmatter ?? {})
  const classification = computed(() => fm.value.classification as string | null | undefined)
</script>

<template>
  <div class="layout title-only">
    <h1 v-if="fm.title">
      {{ fm.title }}
    </h1>
    <slot />
    <ClassificationFooter :level="classification" />
  </div>
</template>

<style scoped>
  .title-only {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 4rem 5rem;
    height: 100%;
  }
  .title-only h1 {
    /* Title sits above any body decoration (e.g. Bio team-mode anvil band)
       so it remains readable when used with full-bleed body components. */
    position: relative;
    z-index: 5;
    font-size: var(--typography-content-title-size, 4rem);
    line-height: var(--typography-content-title-line-height, 1.1);
    color: var(--sap-brand-blue-darker);
  }
  /* When the slide body renders the Bio team-mode dark anvil band at the
     top, the default dark-blue title would be unreadable. Switch the title
     to white in that scenario. The selector matches `.title-only` whose
     direct slot contains `.bio--team`, which is the v0.4.1 team layout. */
  .title-only:has(.bio--team) h1 {
    color: #ffffff;
  }
</style>
