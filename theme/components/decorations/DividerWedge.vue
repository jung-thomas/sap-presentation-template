<script setup lang="ts">
defineProps<{ variant?: string }>()
</script>

<template>
  <div :class="['divider-wedge', `divider-wedge--${variant ?? 'a'}`]" aria-hidden="true" />
</template>

<style scoped>
  .divider-wedge {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }
  .divider-wedge--a { background: var(--sap-brand-blue-darker); }
  .divider-wedge--b {
    background: linear-gradient(135deg, var(--sap-brand-blue-darker) 0%, var(--sap-brand-blue) 100%);
  }
  .divider-wedge--c { background: var(--sap-brand-teal-dark); }
  .divider-wedge--d {
    background: linear-gradient(135deg, var(--sap-brand-purple-dark) 0%, var(--sap-brand-blue-darker) 100%);
  }
</style>
