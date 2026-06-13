<script setup lang="ts">
  import { getEvent } from '../setup/data'

  const props = defineProps<{
    title?: string
    subtitle?: string
    variant?: string // a..l
    presenter?: string
    event?: string // overrides event.yaml#name
  }>()
  const variant = props.variant ?? 'a'
  const eventData = getEvent()
  const eventName = props.event ?? eventData.name
</script>

<template>
  <div :class="['cover', `cover--${variant}`]">
    <div class="cover-content">
      <h1 v-if="title">{{ title }}</h1>
      <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
      <slot />
      <footer class="cover-footer">
        <Speaker v-if="presenter" :presenter="presenter" />
        <Speaker v-else />
        <span class="event">{{ eventName }}</span>
      </footer>
    </div>
  </div>
</template>

<style scoped>
  .cover {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 4rem 5rem;
    position: relative;
    overflow: hidden;
  }
  .cover-content {
    position: relative;
    z-index: 1;
    max-width: 70%;
  }
  .cover h1 {
    font-size: 4.5rem;
    line-height: 1.05;
    color: #fff;
    margin: 0 0 1.5rem;
    font-weight: 800;
    letter-spacing: -0.015em;
  }
  .cover .subtitle {
    font-size: 1.75rem;
    color: rgba(255, 255, 255, 0.95);
    margin: 0 0 2rem;
  }
  .cover-footer {
    margin-top: 3rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    color: rgba(255, 255, 255, 0.9);
  }
  .cover-footer .event {
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    opacity: 0.85;
  }

  /* Variant backgrounds — keyed to the SAP Horizon palette */
  .cover--a {
    background: linear-gradient(135deg, var(--sap-brand-blue-dark), var(--sap-brand-blue));
  }
  .cover--b {
    background: linear-gradient(135deg, var(--sap-brand-blue), var(--sap-brand-teal));
  }
  .cover--c {
    background: linear-gradient(135deg, var(--sap-brand-blue-darker), var(--sap-brand-purple-dark));
  }
  .cover--d {
    background: linear-gradient(135deg, var(--sap-brand-teal), var(--sap-brand-green));
  }
  .cover--e {
    background: linear-gradient(135deg, var(--sap-brand-purple-dark), var(--sap-brand-pink-dark));
  }
  .cover--f {
    background: var(--sap-brand-blue-darker);
  }
  .cover--g {
    background: var(--sap-brand-blue);
  }
  .cover--h {
    background: var(--sap-brand-teal-dark);
  }
  .cover--i {
    background: var(--sap-brand-purple);
  }
  .cover--j {
    background: var(--sap-brand-blue-darker)
      radial-gradient(at 30% 20%, var(--sap-brand-blue) 0%, transparent 50%);
  }
  .cover--k {
    background: var(--sap-brand-blue-darker)
      radial-gradient(at 70% 80%, var(--sap-brand-teal) 0%, transparent 60%);
  }
  .cover--l {
    background: linear-gradient(180deg, var(--sap-brand-blue-darker), var(--sap-black));
  }
</style>
