<script setup lang="ts">
  import { getEvent } from '../setup/data'
  const event = getEvent()
</script>

<template>
  <span class="event-badge">
    <span class="event-name">{{ event.name }}</span>
    <span v-if="event.date" class="event-date">· {{ event.date }}</span>
    <span v-if="event.hashtag" class="event-hashtag">· {{ event.hashtag }}</span>
  </span>
</template>

<style scoped>
  .event-badge {
    display: inline-flex;
    gap: 0.4rem;
    align-items: baseline;
    padding: 0.25rem 0.75rem;
    background: var(--sap-brand-blue-pale);
    color: var(--sap-brand-blue-dark);
    border-radius: var(--sap-radius-button);
    font-size: 0.9rem;
  }
  .event-name {
    font-weight: 600;
  }
  .event-date,
  .event-hashtag {
    opacity: 0.8;
  }
</style>
