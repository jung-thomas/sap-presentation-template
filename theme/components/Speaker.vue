<script setup lang="ts">
  import { computed } from 'vue'
  import { resolvePresenter, resolvePresenters } from '../setup/data'

  /**
   * Renders one or more presenters compactly (name + title). Two display
   * modes:
   *   - inline: comma-separated on a single line. Good for inline use
   *     ("Presented by Thomas Jung · Developer Advocate, SAP").
   *   - block: each speaker on their own line. Default when ≥2 presenters
   *     are passed (matches reading expectations on Q&A / closing slides).
   *
   * Authors can force either mode with the `layout` prop.
   */
  const props = defineProps<{
    presenter?: string
    presenters?: string[]
    /** Force inline or block layout. Default: block when 2+ presenters, inline otherwise. */
    layout?: 'inline' | 'block'
  }>()

  const list = computed(() =>
    props.presenters
      ? resolvePresenters(props.presenters)
      : [resolvePresenter(props.presenter)]
  )

  const isBlock = computed(() => {
    if (props.layout) return props.layout === 'block'
    return list.value.length > 1
  })
</script>

<template>
  <span :class="['speaker', isBlock ? 'speaker--block' : 'speaker--inline']">
    <span v-for="(p, i) in list" :key="p.slug" class="speaker-item">
      <strong>{{ p.name }}</strong>
      <span class="speaker-title"> · {{ p.title }}</span>
      <span v-if="!isBlock && i < list.length - 1">, </span>
    </span>
  </span>
</template>

<style scoped>
  .speaker {
    font-size: 1rem;
    color: var(--sapContent_LabelColor);
  }
  .speaker--inline {
    /* Comma-separated inline list. */
  }
  /* Each presenter on its own line, with a small gap between rows. */
  .speaker--block {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .speaker-title {
    opacity: 0.85;
  }
</style>
