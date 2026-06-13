<script setup lang="ts">
  import { resolveProgram } from '../setup/data'
  import Team from './Team.vue'

  const program = resolveProgram('developer-advocates')
</script>

<template>
  <div class="dev-advocates">
    <h2>SAP Developer Advocates</h2>
    <p class="dev-advocates-tagline">
      {{ program.tagline }}
    </p>
    <p class="dev-advocates-desc">
      {{ program.description }}
    </p>

    <Team team="dev-advocates" />

    <div class="dev-advocates-engage">
      <span class="label">Engage with us:</span>
      <a
        v-for="link in program.engagementLinks"
        :key="link.url"
        :href="link.url"
        target="_blank"
        rel="noopener"
        class="engage-link"
        >{{ link.label }}</a
      >
    </div>
  </div>
</template>

<style scoped>
  .dev-advocates h2 {
    color: var(--sap-brand-blue-darker);
    margin-bottom: 0.5rem;
  }
  .dev-advocates-tagline {
    font-size: 1.5rem;
    color: var(--sap-brand-blue);
    margin-bottom: 1rem;
  }
  .dev-advocates-desc {
    font-size: 1.05rem;
    margin-bottom: 1.5rem;
    max-width: 60rem;
  }
  .dev-advocates-engage {
    margin-top: 1.5rem;
    display: flex;
    gap: 0.75rem;
    align-items: baseline;
    flex-wrap: wrap;
  }
  .dev-advocates-engage .label {
    font-weight: 600;
    color: var(--sapContent_LabelColor);
  }
  .engage-link {
    color: var(--sap-brand-blue);
    text-decoration: none;
    padding: 0.25rem 0.75rem;
    border: 1px solid var(--sap-brand-blue);
    border-radius: var(--sap-radius-button);
  }
  .engage-link:hover {
    background: var(--sap-brand-blue);
    color: #fff;
  }
</style>
