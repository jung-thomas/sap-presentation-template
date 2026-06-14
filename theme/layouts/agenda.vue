<script setup lang="ts">
  import { computed } from 'vue'
  import agendaDefaults from '../styles/_extracted/agenda-defaults.json'
  import ClassificationFooter from '../components/ClassificationFooter.vue'

  type AgendaConfig = {
    toc: boolean
    showSubsections: boolean
    dividers: boolean
    sectionNumbers: boolean
    slideNumbers: boolean
  }

  type AgendaItem = {
    title: string
    subsections?: string[]
  }

  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = computed(() => props.frontmatter ?? {})
  const classification = computed(() => fm.value.classification as string | null | undefined)

  const config = computed<AgendaConfig>(() => ({
    ...(agendaDefaults as AgendaConfig),
    ...((fm.value.agenda as Partial<AgendaConfig>) ?? {})
  }))

  const items = computed(() => (fm.value.items as AgendaItem[]) ?? [])
</script>

<template>
  <div class="layout agenda-layout">
    <h1>{{ fm.title ?? 'Agenda' }}</h1>
    <ol class="agenda-list">
      <li v-for="(item, i) in items" :key="i">
        <span v-if="config.sectionNumbers" class="num">{{ String(i + 1).padStart(2, '0') }}</span>
        <span class="text">{{ item.title }}</span>
        <ul v-if="config.showSubsections && item.subsections" class="subsections">
          <li v-for="(s, j) in item.subsections" :key="j">{{ s }}</li>
        </ul>
      </li>
    </ol>
    <slot />
    <ClassificationFooter :level="classification" />
  </div>
</template>

<style scoped>
  .agenda-layout {
    padding: 3rem 5rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  .agenda-layout h1 {
    font-size: var(--typography-content-title-size, 3rem);
    line-height: var(--typography-content-title-line-height, 1.1);
    color: var(--sap-brand-blue-darker);
    margin: 0;
  }
  .agenda-list {
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: var(--typography-content-body-size, 1.5rem);
  }
  .agenda-list > li {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid #e5e9ed;
    color: var(--sapTextColor);
    opacity: 0.6;
    line-height: var(--typography-content-body-line-height, 1.5);
  }
  .agenda-list > li .text {
    display: flex;
    gap: 1rem;
    align-items: baseline;
  }
  .num {
    font-family: var(--sap-font-major);
    font-weight: 700;
    color: var(--sap-brand-blue);
    min-width: 2.5rem;
  }
  .subsections {
    list-style: none;
    padding: 0 0 0 2.5rem;
    margin: 0.25rem 0 0 0;
    font-size: 0.9em;
    opacity: 0.75;
  }
  .subsections li {
    padding: 0.25rem 0;
  }
  .agenda-layout--b {
    background: var(--sap-brand-blue-pale);
  }
</style>
