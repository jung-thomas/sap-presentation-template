<template>
  <div class="decoration-gradient" aria-hidden="true" />
</template>

<style scoped>
  .decoration-gradient {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background: linear-gradient(
      180deg,
      var(--sap-brand-blue-darker) 0%,
      var(--sap-black, #000) 100%
    );
  }
</style>

<script lang="ts">
  export const logoTreatment = 'white' as const
</script>
