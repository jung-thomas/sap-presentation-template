<script setup lang="ts">
  defineProps<{ title?: string }>()
</script>

<template>
  <div class="layout title-text-2col">
    <h1 v-if="title">{{ title }}</h1>
    <div class="cols">
      <div class="col"><slot name="left" /></div>
      <div class="col"><slot name="right" /></div>
    </div>
  </div>
</template>

<style scoped>
  .title-text-2col {
    padding: 3rem 4rem;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .title-text-2col h1 {
    font-size: 2.75rem;
    color: var(--sap-brand-blue-darker);
    margin-bottom: 1.5rem;
  }
  .cols {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
  }
  .col {
    font-size: 1.15rem;
    line-height: 1.55;
  }
</style>
