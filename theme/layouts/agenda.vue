<script setup lang="ts">
  import AgendaList from '../components/Agenda.vue'

  defineProps<{ frontmatter?: Record<string, unknown> }>()
</script>

<template>
  <div class="layout agenda-layout">
    <h1>{{ $frontmatter?.title ?? 'Agenda' }}</h1>
    <AgendaList :items="$frontmatter?.items" :current="$frontmatter?.current" />
    <slot />
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
