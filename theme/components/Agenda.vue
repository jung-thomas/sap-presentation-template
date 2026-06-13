<script setup lang="ts">
  const props = defineProps<{
    items?: string[]
    current?: number // 1-based index of "you are here"
  }>()
  const list = props.items ?? []
</script>

<template>
  <ol class="agenda">
    <li
      v-for="(item, i) in list"
      :key="i"
      :class="{ active: current === i + 1, done: current && i + 1 < current }"
    >
      <span class="num">{{ String(i + 1).padStart(2, '0') }}</span>
      <span class="text">{{ item }}</span>
    </li>
  </ol>
</template>

<style scoped>
  .agenda {
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: var(--typography-content-body-size, 1.5rem);
  }
  .agenda li {
    display: flex;
    gap: 1rem;
    align-items: baseline;
    padding: 0.5rem 0;
    border-bottom: 1px solid #e5e9ed;
    color: var(--sapTextColor);
    opacity: 0.6;
    line-height: var(--typography-content-body-line-height, 1.5);
  }
  .agenda li.active {
    opacity: 1;
    color: var(--sap-brand-blue);
    font-weight: 600;
  }
  .agenda li.done {
    opacity: 0.35;
    text-decoration: line-through;
  }
  .num {
    font-family: var(--sap-font-major);
    font-weight: 700;
    color: var(--sap-brand-blue);
    min-width: 2.5rem;
  }
</style>
