<script setup lang="ts">
  import { computed } from 'vue'
  import ClassificationFooter from '../components/ClassificationFooter.vue'

  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = computed(() => props.frontmatter ?? {})
  const classification = computed(() => fm.value.classification as string | null | undefined)
</script>

<template>
  <div class="layout title-photo">
    <div class="photo-half" :style="fm.photo ? { backgroundImage: `url(${fm.photo})` } : {}">
      <slot name="photo" />
    </div>
    <div class="text-half">
      <h1 v-if="fm.title">
        {{ fm.title }}
      </h1>
      <slot />
    </div>
    <ClassificationFooter :level="classification" />
  </div>
</template>

<style scoped>
  .title-photo {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0;
  }
  .photo-half {
    background-size: cover;
    background-position: center;
    background-color: var(--sap-brand-blue-pale);
    min-height: 100%;
  }
  .text-half {
    padding: 4rem 4rem 4rem 3.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .text-half h1 {
    /* Body-slide title (not a cover title). Inherits font-family/weight/
       size/color from .slidev-layout h1 in slide-styles.css; size comes
       from --typography-content-title-size. */
  }
  .text-half :deep(*) {
    font-size: 1.15rem;
    line-height: 1.55;
  }
</style>
