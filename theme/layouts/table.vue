<!-- theme/layouts/table.vue -->
<script setup lang="ts">
  import { computed } from 'vue'
  import ClassificationFooter from '../components/ClassificationFooter.vue'

  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = computed(() => props.frontmatter ?? {})
  const classification = computed(() => fm.value.classification as string | null | undefined)
</script>

<template>
  <div class="layout table-layout">
    <h1 v-if="fm.title" class="table-layout-title">{{ fm.title }}</h1>
    <div class="table-frame">
      <slot />
    </div>
    <ClassificationFooter :level="classification" />
  </div>
</template>

<style scoped>
  .table-layout {
    position: relative;
    width: 100%;
    height: 100%;
    background: #ffffff;
    color: var(--sap-text-primary, #000);
    font-family: var(--sap-font-family);
    padding: 4.2% 4.2% 0 4.2%;
    box-sizing: border-box;
  }
  .table-layout-title {
    font-family: var(--sap-font-family-bold, var(--sap-font-family));
    font-weight: 700;
    font-size: 1.5rem;
    line-height: 1.1;
    margin: 0 0 1.5rem;
  }
  .table-frame {
    width: 100%;
  }
  .table-frame :deep(table) {
    width: 100%;
    border-collapse: collapse;
    font-family: var(--sap-font-family);
  }
  .table-frame :deep(thead th) {
    background: var(--sap-blue-7);
    color: #ffffff;
    font-family: var(--sap-font-family-bold, var(--sap-font-family));
    font-weight: 600;
    font-size: 1.125rem; /* 18pt ≈ 1.125rem */
    text-align: center;
    padding: 0.5rem 0.875rem;
    border: 1px solid var(--sap-blue-7);
  }
  .table-frame :deep(tbody td) {
    font-size: 0.875rem; /* 14pt ≈ 0.875rem */
    text-align: center;
    padding: 0.5rem 0.875rem;
    border: 1px solid var(--sap-blue-4);
    color: var(--sap-text-primary, #000);
  }
  .table-layout::after {
    content: none !important;
  }
</style>
