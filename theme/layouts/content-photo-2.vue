<script setup lang="ts">
  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = props.frontmatter ?? {}
</script>

<template>
  <div class="layout content-photo-2">
    <div class="header">
      <h1 v-if="fm.title">
        {{ fm.title }}
      </h1>
      <img v-if="fm.photo" :src="(fm.photo as string)" :alt="(fm.alt as string) ?? ''" class="avatar" />
      <div v-else class="avatar avatar--placeholder" />
    </div>
    <div class="body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
  .content-photo-2 {
    padding: 3rem 4rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  .header {
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    gap: 1.5rem;
    justify-content: flex-end;
  }
  .avatar {
    width: 8rem;
    height: 8rem;
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
