<template>
  <div class="decoration-wedges" aria-hidden="true">
    <svg viewBox="0 0 1280 720" preserveAspectRatio="none">
      <rect width="1280" height="720" fill="var(--sap-brand-blue-darker)" />
      <polygon points="100,72 1280,72 1280,576 1024,648 100,648" fill="var(--sap-brand-blue)" />
      <polygon points="256,180 1280,180 1280,540 920,612 256,612" fill="var(--sap-brand-blue-light, #89D1FF)" />
      <polygon points="448,288 1280,288 1280,468 808,540 448,540" fill="var(--sap-brand-blue-pale, #D1EFFF)" />
    </svg>
  </div>
</template>

<style scoped>
  .decoration-wedges {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }
  .decoration-wedges svg {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>

<script lang="ts">
export const logoTreatment = 'white' as const
</script>
