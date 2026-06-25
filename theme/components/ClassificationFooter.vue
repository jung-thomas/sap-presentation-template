<script setup lang="ts">
  import { computed } from 'vue'
  import { getEvent } from '../setup/data'

  /**
   * Three layers of resolution, highest priority first:
   *   1. Per-slide `classification:` frontmatter (overrides everything).
   *   2. Deck-wide `event.classification` from event.yaml.
   *   3. Default `INTERNAL` (safer default for SAP-internal use).
   *
   * Setting `classification: null` at slide OR event level explicitly
   * suppresses the footer.
   */
  const props = defineProps<{
    level?: 'PUBLIC' | 'EXTERNAL' | 'INTERNAL' | 'CONFIDENTIAL' | null
    scope?: string | null
  }>()

  const DEFAULT_LEVEL = 'INTERNAL'
  const DEFAULT_SCOPE = 'SAP and External Parties under NDA Only'

  const eventClassification = computed(() => {
    try {
      return getEvent().classification
    } catch {
      // event.yaml is optional in some test setups
      return undefined
    }
  })

  const level = computed(() => {
    // Slide frontmatter wins. `null` is an explicit "suppress" signal at any level.
    if (props.level === null) return null
    if (props.level !== undefined) return props.level
    // Then deck-wide event default. `null` here is also "suppress".
    const ev = eventClassification.value
    if (ev === null) return null
    if (ev !== undefined) return ev
    // Last resort: the safest default for SAP-internal use.
    return DEFAULT_LEVEL
  })

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
