<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{
    level?: 'PUBLIC' | 'EXTERNAL' | 'INTERNAL' | 'CONFIDENTIAL' | null
    scope?: string | null
  }>()

  const DEFAULT_LEVEL = 'INTERNAL'
  const DEFAULT_SCOPE = 'SAP and External Parties under NDA Only'

  const level = computed(() => (props.level === null ? null : (props.level ?? DEFAULT_LEVEL)))
  const scope = computed(() => (props.scope === null ? '' : (props.scope ?? DEFAULT_SCOPE)))

  const text = computed(() => {
    if (level.value === null) return ''
    if (!scope.value || level.value === 'PUBLIC') return level.value
    return `${level.value} — ${scope.value}`
  })
</script>

<template>
  <small v-if="text" class="classification-footer">{{ text }}</small>
</template>

<style scoped>
  .classification-footer {
    position: absolute;
    bottom: var(--cover-classification-bottom, 2.6%);
    left: var(--cover-classification-left, 4.13%);
    font-size: 0.5rem;
    color: var(--sap-text-secondary, var(--sap-grey-7));
    letter-spacing: 0.04em;
    text-transform: none;
    z-index: 3;
    pointer-events: none;
  }
</style>
