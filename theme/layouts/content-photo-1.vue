<script setup lang="ts">
  import { computed } from 'vue'
  import ClassificationFooter from '../components/ClassificationFooter.vue'

  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = computed(() => props.frontmatter ?? {})
  const classification = computed(() => fm.value.classification as string | null | undefined)
</script>

<template>
  <div class="layout content-photo-1">
    <div class="header">
      <img
        v-if="fm.photo"
        :src="fm.photo as string"
        :alt="(fm.alt as string) ?? ''"
        class="avatar"
      />
      <div v-else class="avatar avatar--placeholder" />
      <h1 v-if="fm.title">
        {{ fm.title }}
      </h1>
    </div>
    <div class="body">
      <slot />
    </div>
    <ClassificationFooter :level="classification" />
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
    font-size: var(--typography-content-title-size, 2.5rem);
    line-height: var(--typography-content-title-line-height, 1.1);
    color: var(--sap-brand-blue-darker);
    margin: 0;
  }
  .body {
    flex: 1;
    font-size: var(--typography-content-body-size, 1.2rem);
    line-height: var(--typography-content-body-line-height, 1.55);
  }
</style>
