<script setup lang="ts">
  import { computed } from 'vue'
  import { getLegalNotice } from '../setup/legal'

  const props = withDefaults(
    defineProps<{
      /** Per-deck override for the © legal-notice text. */
      override?: string | null
      /** When true, renders white text (use over dark anvil bands). */
      invert?: boolean
    }>(),
    { override: null, invert: false }
  )

  const text = computed(() => getLegalNotice(props.override))
</script>

<template>
  <p :class="['legal-notice', { 'legal-notice--invert': invert }]">{{ text }}</p>
</template>

<style scoped>
  .legal-notice {
    margin: 0;
    font-family: var(--sap-font-family);
    font-size: 0.7rem;
    line-height: 1;
    color: var(--sap-text-secondary, #555);
    text-align: center;
  }
  .legal-notice--invert {
    color: #ffffff;
  }
</style>
