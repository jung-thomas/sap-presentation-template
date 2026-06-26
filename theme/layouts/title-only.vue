<script setup lang="ts">
  import { computed } from 'vue'
  import ClassificationFooter from '../components/ClassificationFooter.vue'

  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = computed(() => props.frontmatter ?? {})
  const classification = computed(() => fm.value.classification as string | null | undefined)
</script>

<template>
  <div class="layout title-only">
    <h1 v-if="fm.title">
      {{ fm.title }}
    </h1>
    <slot />
    <ClassificationFooter :level="classification" />
  </div>
</template>

<style scoped>
  .title-only {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 4rem 5rem;
    height: 100%;
  }
  .title-only h1 {
    /* Title sits above any body decoration (e.g. Bio team-mode anvil band)
       so it remains readable when used with full-bleed body components.
       Inherits font-family/weight/size/color from .slidev-layout h1 in
       slide-styles.css; size comes from --typography-content-title-size. */
    position: relative;
    z-index: 5;
  }
  /* When the slide body renders the Bio team-mode dark anvil band, the
     default flex-column layout would push the band BELOW the h1, leaving
     the title sitting on white background and the band only filling the
     remaining vertical space.

     Instead, when .bio--team is present:
       - the :slotted Bio fills the entire slide (`position: absolute; inset: 0`)
         so its anvil band reaches the very top edge.
       - the h1 sits absolutely at the top-left INSIDE the dark band, in
         white text + z-index 5 so it reads above the pattern. */
  .title-only:has(.bio--team) {
    padding: 0;
  }
  .title-only:has(.bio--team) :deep(.bio--team) {
    position: absolute;
    inset: 0;
  }
  .title-only:has(.bio--team) h1 {
    position: absolute;
    top: 6%;
    left: 4.2%;
    margin: 0;
    color: #ffffff;
    z-index: 5;
  }
</style>
