<script setup lang="ts">
  import { computed } from 'vue'
  import { resolveTeam } from '../setup/data'
  import { assetUrl } from '../setup/assets'
  import QRCode from './QRCode.vue'

  /**
   * Dense roster grid for medium-sized teams (8–24 people).
   *
   * Unlike the 4-card POTX-slide-14 layout in <Bio :people>, this component
   * tiles every member of a team file as a photo-prominent card. Best paired
   * with the `team-roster` slide layout, which places it on a full-bleed slide
   * with just a title bar.
   *
   * The grid is auto-fit: it picks the smallest column count that keeps card
   * width >= MIN_CARD_PX, so 17 members → 6 cols × 3 rows on a 1920-wide slide,
   * and a 10-member team falls back to 5×2 automatically. `columns` overrides.
   */
  const props = defineProps<{
    team: string
    /** Force a specific column count. Default = auto-fit. */
    columns?: number
    /** Show QR alongside each card. Default true. */
    showQr?: boolean
  }>()

  const t = computed(() => resolveTeam(props.team))
  // Render first name only on the card itself; full name goes in the tooltip.
  // Most attendees only need to recognise + scan, not read the full name twice.
  const cards = computed(() =>
    t.value.presenters.map((p) => ({
      slug: p.slug,
      // "Witalij Rudnicki" → "Witalij"; "DJ Adams" → "DJ"; "von Thenen" stays whole-name in tooltip
      firstName: p.name.split(' ')[0],
      lastName: p.name.split(' ').slice(1).join(' '),
      fullName: p.name,
      photo: p.photo,
      qr: p.qr
    }))
  )

  const gridStyle = computed(() => {
    if (props.columns) return { gridTemplateColumns: `repeat(${props.columns}, 1fr)` }
    // Auto-fit: cards never narrower than ~280px on a 1920-wide slide
    return { gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 14rem), 1fr))' }
  })
</script>

<template>
  <div class="team-roster">
    <header v-if="t.tagline" class="team-roster__tagline">
      {{ t.tagline }}
    </header>
    <div class="team-roster__grid" :style="gridStyle">
      <article
        v-for="c in cards"
        :key="c.slug"
        class="roster-card"
        :title="c.fullName"
      >
        <div class="roster-card__photo">
          <img v-if="c.photo" :src="assetUrl(c.photo)" :alt="c.fullName" />
          <span v-else class="roster-card__placeholder">{{ c.firstName.charAt(0) }}{{ c.lastName.charAt(0) }}</span>
        </div>
        <div class="roster-card__meta">
          <div class="roster-card__name">
            <span class="roster-card__first">{{ c.firstName }}</span>
            <span v-if="c.lastName" class="roster-card__last">{{ c.lastName }}</span>
          </div>
          <QRCode v-if="showQr !== false && c.qr" :url="c.qr" :size="48" class="roster-card__qr" />
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
  .team-roster {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .team-roster__tagline {
    font-size: 1.1rem;
    color: var(--sap-brand-blue-dark, #1e3a5f);
    font-weight: 500;
  }
  .team-roster__grid {
    flex: 1;
    display: grid;
    /* gridTemplateColumns set inline by gridStyle */
    grid-auto-rows: 1fr;
    gap: 0.75rem;
    min-height: 0; /* let cards shrink so the grid itself fits the slot */
  }
  .roster-card {
    /* Each card is a flex row: photo on the left, name+QR on the right.
       This keeps cards short vertically so 3+ rows fit on a 1080-tall slide. */
    display: flex;
    background: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    min-height: 0;
  }
  .roster-card__photo {
    /* Square thumbnail, fixed-ratio so layout doesn't jitter when photos differ. */
    flex: 0 0 38%;
    aspect-ratio: 1 / 1;
    background: var(--sap-blue-1, #f0f3f5);
    overflow: hidden;
  }
  .roster-card__photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .roster-card__placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--sap-blue-7, #1e3a5f);
    font-family: var(--sap-font-family-bold, var(--sap-font-major));
    font-weight: 700;
    font-size: 1.5rem;
  }
  .roster-card__meta {
    flex: 1;
    min-width: 0;
    padding: 0.55rem 0.65rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 0.35rem;
  }
  .roster-card__name {
    display: flex;
    flex-direction: column;
    line-height: 1.15;
    min-width: 0;
  }
  .roster-card__first {
    font-family: var(--sap-font-family-bold, var(--sap-font-major));
    font-weight: 700;
    font-size: 0.95rem;
    color: var(--sap-text-primary, #000);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .roster-card__last {
    font-size: 0.8rem;
    color: var(--sap-text-secondary, #5b738b);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .roster-card__qr {
    align-self: flex-end;
    width: 48px;
    height: 48px;
  }
  .roster-card__qr :deep(img) {
    width: 48px;
    height: 48px;
  }
</style>
