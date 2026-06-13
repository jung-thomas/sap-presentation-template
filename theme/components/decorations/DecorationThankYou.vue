<script setup lang="ts">
  defineProps<{ variant?: string }>()
</script>

<template>
  <div
    :class="['decoration-thankyou', `decoration-thankyou--${variant ?? 'a'}`]"
    aria-hidden="true"
  />
</template>

<style scoped>
  .decoration-thankyou {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }
  .decoration-thankyou--a {
    background: var(--sap-brand-blue-darker);
  }
  .decoration-thankyou--b {
    background: linear-gradient(135deg, var(--sap-brand-blue) 0%, var(--sap-brand-teal) 100%);
  }
</style>
