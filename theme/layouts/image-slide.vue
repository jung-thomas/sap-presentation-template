<script setup lang="ts">
  import { computed } from 'vue'
  import ClassificationFooter from '../components/ClassificationFooter.vue'

  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = computed(() => props.frontmatter ?? {})
  const classification = computed(() => fm.value.classification as string | null | undefined)
</script>

<template>
  <div class="layout image-slide">
    <img :src="fm.src as string" :alt="(fm.alt as string) ?? ''" />
    <ClassificationFooter :level="classification" />
  </div>
</template>

<style scoped>
  .image-slide {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
    padding: 0;
  }
  .image-slide img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  .image-slide::after {
    content: none !important;
  }
</style>
