<script setup lang="ts">
  import { computed } from 'vue'
  import ClassificationFooter from '../components/ClassificationFooter.vue'
  import TeamRoster from '../components/TeamRoster.vue'

  /**
   * Slide layout for a full-bleed team roster.
   *
   * Frontmatter:
   *   layout: team-roster
   *   title: SAP Developer Advocates    # optional; falls back to team file's name
   *   team: dev-advocates                # required — must match a teams/<slug>.yaml
   *   columns: 6                         # optional; auto-fit if omitted
   *   showQr: true                       # optional; per-card QR codes (default true)
   *   classification: PUBLIC             # optional
   *
   * Markdown body (if present) renders ABOVE the grid as a kicker paragraph.
   */
  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = computed(() => props.frontmatter ?? {})
  const team = computed(() => fm.value.team as string)
  const title = computed(() => fm.value.title as string | undefined)
  const columns = computed(() => fm.value.columns as number | undefined)
  const showQr = computed(() => (fm.value.showQr === undefined ? true : !!fm.value.showQr))
  const classification = computed(() => fm.value.classification as string | null | undefined)
</script>

<template>
  <div class="layout team-roster-layout">
    <h1 v-if="title" class="team-roster-layout__title">
      {{ title }}
    </h1>
    <div v-if="$slots.default" class="team-roster-layout__kicker">
      <slot />
    </div>
    <div class="team-roster-layout__body">
      <TeamRoster :team="team" :columns="columns" :show-qr="showQr" />
    </div>
    <ClassificationFooter :level="classification" />
  </div>
</template>

<style scoped>
  .team-roster-layout {
    display: flex;
    flex-direction: column;
    /* Tight outer padding to maximise the roster grid area. */
    padding: 2.5rem 3.5rem 3rem;
    height: 100%;
    box-sizing: border-box;
  }
  .team-roster-layout__title {
    font-size: var(--typography-content-title-size, 2.5rem);
    line-height: 1.1;
    color: var(--sap-brand-blue-darker, #0a1a2f);
    margin: 0 0 0.5rem;
  }
  .team-roster-layout__kicker {
    color: var(--sap-text-secondary, #5b738b);
    font-size: 1rem;
    line-height: 1.4;
    margin-bottom: 1rem;
    max-width: 60rem;
  }
  /* Reserve all remaining height for the roster grid. */
  .team-roster-layout__body {
    flex: 1;
    min-height: 0;
  }
</style>
