<script setup lang="ts">
  import { computed } from 'vue'
  import DividerWedge from '../components/decorations/DividerWedge.vue'
  import ClassificationFooter from '../components/ClassificationFooter.vue'

  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = computed(() => props.frontmatter ?? {})
  const variant = computed(() => (fm.value.variant as string | undefined) ?? 'a')
  const classification = computed(() => fm.value.classification as string | null | undefined)
</script>

<template>
  <div :class="['divider', `divider--${variant}`]">
    <DividerWedge :variant="variant" />
    <div class="divider-content">
      <h1 v-if="fm.title">
        {{ fm.title }}
      </h1>
      <slot />
    </div>
    <ClassificationFooter :level="classification" />
  </div>
</template>

<style scoped>
  .divider {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    color: #ffffff;
  }
  .divider-content {
    position: relative;
    z-index: 2;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 5rem;
  }
  .divider h1 {
    font-size: var(--typography-divider-title-size, 4rem);
    line-height: var(--typography-divider-title-line-height, 1);
    margin: 0;
    color: #ffffff;
    max-width: 80%;
  }
  .divider::after {
    content: none !important;
  }
</style>
