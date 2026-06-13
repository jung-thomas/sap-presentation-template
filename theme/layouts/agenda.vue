<script setup lang="ts">
  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = props.frontmatter ?? {}
</script>

<template>
  <div :class="['layout', 'agenda-layout', `agenda-layout--${fm.variant ?? 'a'}`]">
    <h1>{{ fm.title ?? 'Agenda' }}</h1>
    <Agenda :items="(fm.items as string[] | undefined)" :current="(fm.current as number | undefined)" />
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
