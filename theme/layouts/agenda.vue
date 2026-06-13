<script setup lang="ts">
  defineProps<{
    title?: string
    variant?: 'a' | 'b'
    items?: string[]
    current?: number
  }>()
</script>

<template>
  <div :class="['layout', 'agenda-layout', `agenda-layout--${variant ?? 'a'}`]">
    <h1>{{ title ?? 'Agenda' }}</h1>
    <Agenda :items="items" :current="current" />
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
    font-size: 3rem;
    color: var(--sap-brand-blue-darker);
    margin: 0;
  }
  .agenda-layout--b {
    background: var(--sap-brand-blue-pale);
  }
</style>
