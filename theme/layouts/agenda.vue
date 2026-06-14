<script setup lang="ts">
  import { computed } from 'vue'
  import AgendaList from '../components/Agenda.vue'
  import ClassificationFooter from '../components/ClassificationFooter.vue'

  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = computed(() => props.frontmatter ?? {})
  const classification = computed(() => fm.value.classification as string | null | undefined)
</script>

<template>
  <div class="layout agenda-layout">
    <h1>{{ $frontmatter?.title ?? 'Agenda' }}</h1>
    <AgendaList :items="$frontmatter?.items" :current="$frontmatter?.current" />
    <slot />
    <ClassificationFooter :level="classification" />
  </div>
</template>

<style scoped>
  .agenda-layout {
    padding: 3rem 5rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  .agenda-layout h1 {
    font-size: var(--typography-content-title-size, 3rem);
    line-height: var(--typography-content-title-line-height, 1.1);
    color: var(--sap-brand-blue-darker);
    margin: 0;
  }
  .agenda-layout--b {
    background: var(--sap-brand-blue-pale);
  }
</style>
