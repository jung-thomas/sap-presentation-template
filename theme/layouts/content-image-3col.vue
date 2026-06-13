<script setup lang="ts">
  defineProps<{ title?: string }>()
</script>

<template>
  <div class="layout content-image-3col">
    <h1 v-if="title">
      {{ title }}
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
    font-size: 2.5rem;
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
    font-size: 0.95rem;
    line-height: 1.5;
  }
</style>
