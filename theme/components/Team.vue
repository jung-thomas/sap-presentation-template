<script setup lang="ts">
  import { resolveTeam } from '../setup/data'
  import Bio from './Bio.vue'
  import QRCode from './QRCode.vue'

  const props = defineProps<{ team: string; columns?: number }>()
  const t = resolveTeam(props.team)
  const cols = props.columns ?? Math.min(3, t.presenters.length)
</script>

<template>
  <div class="team">
    <header v-if="t.tagline" class="team-tagline">
      {{ t.tagline }}
    </header>
    <div class="team-grid" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)` }">
      <div v-for="p in t.presenters" :key="p.slug" class="team-member">
        <Bio :presenter="p.slug" compact />
        <QRCode v-if="p.qr" :url="p.qr" :size="64" class="team-qr" />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .team {
    width: 100%;
  }
  .team-tagline {
    font-size: 1.25rem;
    color: var(--sap-brand-blue-dark);
    margin-bottom: 1rem;
    font-weight: 500;
  }
  .team-grid {
    display: grid;
    gap: 1rem;
  }
  .team-member {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  .team-qr {
    width: 64px;
    height: 64px;
  }
</style>
