<script setup lang="ts">
  defineProps<{ presenter?: string }>()
</script>

<template>
  <div class="layout q-and-a">
    <h1>Questions?</h1>
    <p class="prompt">Ask now, or find me later.</p>
    <Bio :presenter="presenter" compact />
    <slot />
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
    font-size: 5rem;
    color: var(--sap-brand-blue-darker);
    margin: 0;
  }
  .prompt {
    font-size: 1.5rem;
    color: var(--sapContent_LabelColor);
    margin: 0;
  }
</style>
