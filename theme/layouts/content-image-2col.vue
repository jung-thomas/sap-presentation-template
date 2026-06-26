<script setup lang="ts">
  import { computed } from 'vue'
  import ClassificationFooter from '../components/ClassificationFooter.vue'

  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = computed(() => props.frontmatter ?? {})
  const classification = computed(() => fm.value.classification as string | null | undefined)
</script>

<template>
  <div class="layout content-image-2col">
    <h1 v-if="fm.title">
      {{ fm.title }}
    </h1>
    <div class="cols">
      <div class="col">
        <div class="col-image">
          <slot name="left-image" />
        </div>
        <div class="col-text">
          <slot name="left" />
        </div>
      </div>
      <div class="col">
        <div class="col-image">
          <slot name="right-image" />
        </div>
        <div class="col-text">
          <slot name="right" />
        </div>
      </div>
    </div>
    <ClassificationFooter :level="classification" />
  </div>
</template>

<style scoped>
  .content-image-2col {
    padding: 3rem 4rem;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .content-image-2col h1 {
    /* Inherits font-family/weight/size/color from .slidev-layout h1 in
       slide-styles.css; size comes from --typography-content-title-size. */
  }
  .cols {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  .col {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .col-image :deep(img) {
    width: 100%;
    height: auto;
    border-radius: var(--sap-radius-card);
  }
  .col-text {
    font-size: var(--typography-content-body-size, 1.15rem);
    line-height: var(--typography-content-body-line-height, 1.5);
  }
</style>
