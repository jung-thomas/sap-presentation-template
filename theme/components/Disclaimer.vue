<script setup lang="ts">
  import { resolveDisclaimers } from '../setup/data'
  import type { Disclaimers } from '../types'

  const props = defineProps<{ kind: keyof Disclaimers }>()
  const all = resolveDisclaimers()
  const text = all[props.kind]
  if (!text)
    throw new Error(
      `disclaimer kind "${String(props.kind)}" not found in programs/disclaimers.yaml`
    )
</script>

<template>
  <div :class="['disclaimer', `disclaimer--${kind}`]">
    {{ text }}
  </div>
</template>

<style scoped>
  .disclaimer {
    font-size: 0.75rem;
    line-height: 1.5;
    color: var(--sapContent_LabelColor);
    background: var(--sapList_SelectionBackgroundColor, #f0f5ff);
    border-left: 3px solid var(--sap-brand-blue);
    padding: 0.75rem 1rem;
    max-width: 60rem;
    white-space: pre-wrap;
  }
</style>
