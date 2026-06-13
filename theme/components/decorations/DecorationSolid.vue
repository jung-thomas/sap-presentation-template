<script setup lang="ts">
  defineProps<{ variant?: string }>()
</script>

<template>
  <div :class="['decoration', `decoration-solid--${variant ?? 'f'}`]" aria-hidden="true" />
</template>

<style scoped>
  .decoration {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }
  .decoration-solid--f {
    background: var(--sap-brand-blue-darker);
  }
  .decoration-solid--h {
    background: var(--sap-brand-teal-dark);
  }
  .decoration-solid--i {
    background: var(--sap-brand-purple);
  }
  .decoration-solid--k {
    background: var(--sap-brand-blue-darker);
  }
</style>

<script lang="ts">
  // Logo treatment hint consumed by setup/cover-variants.ts useDarkLogo()
  export const logoTreatment = 'white' as const
</script>
