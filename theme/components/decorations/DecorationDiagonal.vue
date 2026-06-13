<script setup lang="ts">
  defineProps<{ variant?: string }>()
</script>

<template>
  <div
    :class="['decoration-diagonal', `decoration-diagonal--${variant ?? 'b'}`]"
    aria-hidden="true"
  >
    <svg viewBox="0 0 1280 720" preserveAspectRatio="none">
      <polygon points="0,0 1280,0 1280,504 896,720 0,720" fill="var(--sap-brand-blue)" />
    </svg>
  </div>
</template>

<style scoped>
  .decoration-diagonal {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }
  .decoration-diagonal svg {
    width: 100%;
    height: 100%;
    display: block;
  }
  .decoration-diagonal--b {
    background: #ffffff;
  }
  .decoration-diagonal--j {
    background: var(--sap-brand-blue-darker);
  }
</style>
