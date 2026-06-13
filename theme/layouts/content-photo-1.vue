<script setup lang="ts">
  defineProps<{ title?: string; photo?: string; alt?: string }>()
</script>

<template>
  <div class="layout content-photo-1">
    <div class="header">
      <img
        v-if="photo"
        :src="photo"
        :alt="alt ?? ''"
        class="avatar"
      />
      <div v-else class="avatar avatar--placeholder" />
      <h1 v-if="title">{{ title }}</h1>
    </div>
    <div class="body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
  .content-photo-1 {
    padding: 3rem 4rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  .header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  .avatar {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }
  .avatar--placeholder {
    background: var(--sap-brand-blue-pale);
    border: 2px solid var(--sap-brand-blue);
  }
  .header h1 {
    font-size: 2.5rem;
    color: var(--sap-brand-blue-darker);
    margin: 0;
  }
  .body {
    flex: 1;
    font-size: 1.2rem;
    line-height: 1.55;
  }
</style>
