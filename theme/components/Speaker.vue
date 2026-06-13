<script setup lang="ts">
  import { resolvePresenter, resolvePresenters } from '../setup/data'

  const props = defineProps<{ presenter?: string; presenters?: string[] }>()
  const list = props.presenters
    ? resolvePresenters(props.presenters)
    : [resolvePresenter(props.presenter)]
</script>

<template>
  <span class="speaker">
    <span v-for="(p, i) in list" :key="p.slug" class="speaker-item">
      <strong>{{ p.name }}</strong>
      <span class="speaker-title"> · {{ p.title }}</span>
      <span v-if="i < list.length - 1">, </span>
    </span>
  </span>
</template>

<style scoped>
  .speaker {
    font-size: 1rem;
    color: var(--sapContent_LabelColor);
  }
  .speaker-title {
    opacity: 0.85;
  }
</style>
