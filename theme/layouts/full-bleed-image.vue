<script setup lang="ts">
  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = props.frontmatter ?? {}
</script>

<template>
  <div
    class="layout full-bleed-image"
    :style="fm.src ? { backgroundImage: `url(${fm.src})` } : {}"
  >
    <div v-if="fm.title" class="overlay">
      <h1>{{ fm.title }}</h1>
      <slot />
    </div>
  </div>
</template>

<style scoped>
  .full-bleed-image {
    height: 100%;
    width: 100%;
    background-size: cover;
    background-position: center;
    background-color: var(--sap-brand-blue-darker);
    display: flex;
    align-items: flex-end;
    padding: 0;
  }
  .overlay {
    width: 100%;
    padding: 3rem 4rem;
    background: linear-gradient(to top, rgba(0, 20, 74, 0.85), transparent);
  }
  .overlay h1 {
    font-size: 3.5rem;
    color: #fff;
    margin: 0 0 0.5rem;
  }
  .overlay :deep(*) {
    color: rgba(255, 255, 255, 0.9);
  }
</style>
