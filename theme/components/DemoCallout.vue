<script setup lang="ts">
  const props = defineProps<{ kind?: 'live' | 'recorded' | 'interactive'; fallback?: string }>()
  const kind = props.kind ?? 'live'
  const labels = { live: 'Live Demo', recorded: 'Recorded Demo', interactive: 'Try it Yourself' }
  const icons = { live: '🎬', recorded: '📹', interactive: '🖱️' }
</script>

<template>
  <div :class="['demo-callout', `demo-callout--${kind}`]">
    <span class="icon">{{ icons[kind] }}</span>
    <span class="label">{{ labels[kind] }}</span>
    <slot />
    <p v-if="fallback" class="fallback">If the demo gods are unkind: {{ fallback }}</p>
  </div>
</template>

<style scoped>
  .demo-callout {
    display: inline-flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.75rem 1rem;
    border-radius: var(--sap-radius-card);
    background: var(--sap-brand-blue);
    color: #fff;
    font-weight: 600;
    box-shadow: var(--sap-shadow-card);
  }
  .demo-callout--recorded {
    background: var(--sap-brand-purple);
  }
  .demo-callout--interactive {
    background: var(--sap-brand-green);
  }
  .icon {
    font-size: 1.5rem;
  }
  .label {
    font-size: 1.25rem;
  }
  .fallback {
    font-size: 0.85rem;
    opacity: 0.85;
    font-weight: 400;
  }
</style>
