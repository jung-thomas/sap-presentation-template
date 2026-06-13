<script setup lang="ts">
  import { computed } from 'vue'
  import { getEvent } from '../setup/data'

  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = computed(() => props.frontmatter ?? {})
  const presenter = computed(() => fm.value.presenter as string | undefined)
  const variant = computed(() => (fm.value.variant as string | undefined) ?? 'a')
  const event = getEvent()
</script>

<template>
  <div :class="['layout', 'thank-you', `thank-you--${variant}`]">
    <h1>Thank you.</h1>
    <Speaker :presenter="presenter" />
    <p v-if="event.hashtag" class="hashtag">
      {{ event.hashtag }}
    </p>
    <slot />
  </div>
</template>

<style scoped>
  .thank-you {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 1.5rem;
    height: 100%;
    padding: 5rem;
    color: #fff;
  }
  .thank-you h1 {
    font-size: 6rem;
    margin: 0;
    color: #fff;
  }
  .hashtag {
    margin-top: 2rem;
    font-size: 1.25rem;
    letter-spacing: 0.05em;
  }
  .thank-you--a {
    background: var(--sap-brand-blue-darker);
  }
  .thank-you--b {
    background: linear-gradient(135deg, var(--sap-brand-blue), var(--sap-brand-teal));
  }
</style>
