<script setup lang="ts">
  import { computed } from 'vue'
  import DecorationThankYou from '../components/decorations/DecorationThankYou.vue'
  import Speaker from '../components/Speaker.vue'
  import { getEvent } from '../setup/data'

  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = computed(() => props.frontmatter ?? {})
  const variant = computed(() => (fm.value.variant as string | undefined) ?? 'a')
  const presenter = computed(() => fm.value.presenter as string | undefined)
  const event = getEvent()
</script>

<template>
  <div :class="['thank-you', `thank-you--${variant}`]">
    <DecorationThankYou :variant="variant" />
    <div class="thank-you-content">
      <h1>Thank you.</h1>
      <Speaker :presenter="presenter" />
      <p v-if="event.hashtag" class="hashtag">{{ event.hashtag }}</p>
      <slot />
    </div>
  </div>
</template>

<style scoped>
  .thank-you {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .thank-you-content {
    position: relative;
    z-index: 2;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 1.5rem;
    padding: 5rem;
    color: #ffffff;
  }
  .thank-you h1 {
    font-size: var(--typography-thankyou-title-size, 6rem);
    line-height: var(--typography-thankyou-title-line-height, 1);
    margin: 0;
    color: #ffffff;
  }
  .hashtag {
    margin-top: 2rem;
    font-size: 1.25rem;
    letter-spacing: 0.05em;
  }
  .thank-you::after {
    content: none !important;
  }
</style>
