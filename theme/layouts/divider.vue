<script setup lang="ts">
  defineProps<{ title?: string; variant?: 'a' | 'b' | 'c' | 'd' }>()
</script>

<template>
  <div :class="['layout', 'divider', `divider--${variant ?? 'a'}`]">
    <div class="divider-content">
      <h1 v-if="title">
        {{ title }}
      </h1>
      <slot />
    </div>
  </div>
</template>

<style scoped>
  .divider {
    height: 100%;
    padding: 5rem;
    display: flex;
    align-items: center;
    color: #fff;
  }
  .divider h1 {
    font-size: 4rem;
    color: #fff;
    max-width: 80%;
  }

  .divider--a {
    background: var(--sap-brand-blue-darker);
  }
  .divider--b {
    background: linear-gradient(135deg, var(--sap-brand-blue-darker), var(--sap-brand-blue));
  }
  .divider--c {
    background: var(--sap-brand-teal-dark);
  }
  .divider--d {
    background: linear-gradient(135deg, var(--sap-brand-purple-dark), var(--sap-brand-blue-darker));
  }
</style>
