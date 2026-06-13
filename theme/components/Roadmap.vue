<script setup lang="ts">
  import type { RoadmapPhase } from '../types'
  import Disclaimer from './Disclaimer.vue'

  defineProps<{
    phases: RoadmapPhase[]
    suppressDisclaimer?: boolean
  }>()
</script>

<template>
  <div class="roadmap">
    <div class="phases">
      <div v-for="phase in phases" :key="phase.label" :class="['phase', `phase--${phase.status}`]">
        <header>
          <span class="label">{{ phase.label }}</span>
          <span class="status">{{ phase.status }}</span>
        </header>
        <ul>
          <li v-for="item in phase.items" :key="item">{{ item }}</li>
        </ul>
      </div>
    </div>
    <Disclaimer v-if="!suppressDisclaimer" kind="forward-looking" />
  </div>
</template>

<style scoped>
  .roadmap {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  .phases {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
    gap: 1rem;
  }
  .phase {
    border: 1px solid #e5e9ed;
    border-radius: var(--sap-radius-card);
    padding: 1rem;
    background: #fff;
  }
  .phase--planned {
    border-left: 4px solid var(--sap-brand-orange);
  }
  .phase--in-development {
    border-left: 4px solid var(--sap-brand-blue);
  }
  .phase--available {
    border-left: 4px solid var(--sap-brand-green);
  }
  .phase header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 0.5rem;
  }
  .label {
    font-weight: 700;
    font-size: 1.1rem;
  }
  .status {
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    color: var(--sapContent_LabelColor);
  }
  .phase ul {
    padding-left: 1.25rem;
    margin: 0;
  }
  .phase li {
    font-size: 0.95rem;
    line-height: 1.5;
  }
</style>
