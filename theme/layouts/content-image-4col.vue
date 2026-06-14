<script setup lang="ts">
  import { computed } from 'vue'
  import ClassificationFooter from '../components/ClassificationFooter.vue'

  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = computed(() => props.frontmatter ?? {})
  const classification = computed(() => fm.value.classification as string | null | undefined)
</script>

<template>
  <div class="layout content-image-4col">
    <h1 v-if="fm.title">
      {{ fm.title }}
    </h1>
    <div class="cols">
      <div class="col">
        <div class="col-image">
          <slot name="c1-image" />
        </div>
        <div class="col-text">
          <slot name="c1" />
        </div>
      </div>
      <div class="col">
        <div class="col-image">
          <slot name="c2-image" />
        </div>
        <div class="col-text">
          <slot name="c2" />
        </div>
      </div>
      <div class="col">
        <div class="col-image">
          <slot name="c3-image" />
        </div>
        <div class="col-text">
          <slot name="c3" />
        </div>
      </div>
      <div class="col">
        <div class="col-image">
          <slot name="c4-image" />
        </div>
        <div class="col-text">
          <slot name="c4" />
        </div>
      </div>
    </div>
    <ClassificationFooter :level="classification" />
  </div>
</template>

<style scoped>
  .content-image-4col {
    padding: 3rem 4rem;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .content-image-4col h1 {
    font-size: var(--typography-content-title-size, 2.5rem);
    line-height: var(--typography-content-title-line-height, 1.1);
    color: var(--sap-brand-blue-darker);
    margin-bottom: 1.5rem;
  }
  .cols {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 1.25rem;
  }
  .col {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .col-image :deep(img) {
    width: 100%;
    height: auto;
    border-radius: var(--sap-radius-card);
  }
  .col-text {
    font-size: var(--typography-content-body-size, 0.85rem);
    line-height: var(--typography-content-body-line-height, 1.5);
  }
</style>
