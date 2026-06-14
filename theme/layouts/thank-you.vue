<script setup lang="ts">
  import { computed } from 'vue'
  import RipplePattern from '../components/decorations/RipplePattern.vue'
  import WordmarkBookmark from '../components/decorations/WordmarkBookmark.vue'
  import Speaker from '../components/Speaker.vue'
  import ClassificationFooter from '../components/ClassificationFooter.vue'

  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = computed(() => props.frontmatter ?? {})
  const variant = computed(() => ((fm.value.variant as string) ?? 'b').toLowerCase())
  const presenter = computed(() => fm.value.presenter as string | undefined)
  const coPresenter = computed(() => fm.value.coPresenter as string | undefined)
  const classification = computed(() => fm.value.classification as string | null | undefined)
</script>

<template>
  <div :class="['thank-you', `thank-you--${variant}`]">
    <RipplePattern placement="hero-band" />
    <WordmarkBookmark placement="bottom-right" />
    <div class="thank-you-content">
      <h1>Thank you.</h1>
      <Speaker v-if="presenter" :presenter="presenter" />
      <Speaker v-if="coPresenter" :presenter="coPresenter" />
    </div>
    <ClassificationFooter :level="classification" />
  </div>
</template>

<style scoped>
  .thank-you {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .thank-you--a {
    background: #ffffff;
    color: var(--sap-text-primary);
  }
  .thank-you--b {
    background: var(--sap-blue-11);
    color: #ffffff;
  }
  .thank-you-content {
    position: absolute;
    top: 50%;
    left: 4.13%;
    transform: translateY(-50%);
    z-index: 2;
    font-family: var(--sap-font-family);
  }
  .thank-you h1 {
    font-family: var(--sap-font-family-bold);
    font-size: 4rem;
    margin: 0 0 2rem;
  }
</style>
