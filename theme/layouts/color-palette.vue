<script setup lang="ts">
  const swatches = [
    { name: 'Brand Blue', var: '--sap-brand-blue' },
    { name: 'Brand Blue Bright', var: '--sap-brand-blue-bright' },
    { name: 'Brand Blue Dark', var: '--sap-brand-blue-dark' },
    { name: 'Brand Blue Darker', var: '--sap-brand-blue-darker' },
    { name: 'Brand Teal', var: '--sap-brand-teal' },
    { name: 'Brand Green', var: '--sap-brand-green' },
    { name: 'Brand Red', var: '--sap-brand-red' },
    { name: 'Brand Orange', var: '--sap-brand-orange' },
    { name: 'Brand Yellow', var: '--sap-brand-yellow' },
    { name: 'Brand Purple', var: '--sap-brand-purple' },
    { name: 'Brand Pink', var: '--sap-brand-pink' },
    { name: 'Brand Magenta', var: '--sap-brand-magenta' }
  ]
</script>

<template>
  <div class="layout color-palette">
    <h1>Color palette</h1>
    <div class="swatches">
      <div v-for="s in swatches" :key="s.var" class="swatch">
        <div class="chip" :style="{ background: `var(${s.var})` }" />
        <div class="meta">
          <strong>{{ s.name }}</strong
          ><code>{{ s.var }}</code>
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>

<style scoped>
  .color-palette {
    padding: 3rem 4rem;
    height: 100%;
  }
  .color-palette h1 {
    font-size: 2.5rem;
    color: var(--sap-brand-blue-darker);
    margin-bottom: 1.5rem;
  }
  .swatches {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }
  .swatch {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }
  .chip {
    width: 3rem;
    height: 3rem;
    border-radius: var(--sap-radius-button);
    border: 1px solid #e5e9ed;
    flex-shrink: 0;
  }
  .meta {
    display: flex;
    flex-direction: column;
  }
  .meta strong {
    font-size: 0.95rem;
  }
  .meta code {
    font-size: 0.75rem;
    color: var(--sapContent_LabelColor);
  }
</style>
