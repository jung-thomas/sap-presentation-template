<script setup lang="ts">
  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = props.frontmatter ?? {}
</script>

<template>
  <div class="layout content-image-3col">
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
          <slot name="middle-image" />
        </div>
        <div class="col-text">
          <slot name="middle" />
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
  </div>
</template>

<style scoped>
  .content-image-3col {
    padding: 3rem 4rem;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .content-image-3col h1 {
    font-size: var(--typography-content-title-size, 2.5rem);
    line-height: var(--typography-content-title-line-height, 1.1);
    color: var(--sap-brand-blue-darker);
    margin-bottom: 1.5rem;
  }
  .cols {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1.5rem;
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
    font-size: var(--typography-content-body-size, 1.05rem);
    line-height: var(--typography-content-body-line-height, 1.5);
  }
</style>
