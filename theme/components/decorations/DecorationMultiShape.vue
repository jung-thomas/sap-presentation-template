<script setup lang="ts">
  defineProps<{ variant?: string }>()
</script>

<template>
  <div :class="['decoration-multi', `decoration-multi--${variant ?? 'c'}`]" aria-hidden="true">
    <svg viewBox="0 0 1280 720" preserveAspectRatio="none">
      <polygon
        points="0,0 1280,0 1280,432 768,432 768,720 0,720"
        fill="var(--decoration-multi-bg, var(--sap-brand-blue-darker))"
      />
      <polygon
        points="768,288 1280,288 1280,720 768,720"
        fill="var(--decoration-multi-accent, var(--sap-brand-blue))"
      />
    </svg>
  </div>
</template>

<style scoped>
  .decoration-multi {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background: #ffffff;
  }
  .decoration-multi svg {
    width: 100%;
    height: 100%;
    display: block;
  }
  .decoration-multi--c {
    --decoration-multi-bg: var(--sap-brand-blue-darker);
    --decoration-multi-accent: var(--sap-brand-blue);
  }
  .decoration-multi--d {
    --decoration-multi-bg: var(--sap-brand-teal-dark);
    --decoration-multi-accent: var(--sap-brand-green);
  }
  .decoration-multi--e {
    --decoration-multi-bg: var(--sap-brand-purple-dark);
    --decoration-multi-accent: var(--sap-brand-pink);
  }
</style>

<script lang="ts">
  export const logoTreatment = 'white' as const
</script>
