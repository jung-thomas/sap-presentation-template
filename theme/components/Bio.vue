<script setup lang="ts">
  import { computed, watchEffect } from 'vue'
  import AnvilGridDecoration from './decorations/AnvilGridDecoration.vue'
  import QRCode from './QRCode.vue'
  import SocialIcon from './SocialIcon.vue'
  import { resolvePresenter } from '../setup/data'
  import { assetUrl } from '../setup/assets'

  type Person = { name: string; role?: string; photo?: string; qr?: string }

  const props = defineProps<{
    /** v0.3 team-composition API (POTX slide-14). Spec §5: exactly 4 people expected. */
    people?: Array<Person>
    /** v0.2 single-presenter API (backward-compat). */
    presenter?: string
    compact?: boolean
  }>()

  const isTeamMode = computed(() => Array.isArray(props.people) && props.people.length > 0)
  const presenterData = computed(() => (props.presenter ? resolvePresenter(props.presenter) : null))

  // Dev-mode warnings per spec §5.3.
  watchEffect(() => {
    if (isTeamMode.value && props.presenter) {
      console.warn(
        '[Bio] `people` and `presenter` props are mutually exclusive — team mode wins, presenter ignored.'
      )
    }
    if (isTeamMode.value && props.people && props.people.length !== 4) {
      console.warn(
        `[Bio] team mode expected 4 people, got ${props.people.length}. POTX slide 14 is a 4-card layout; the rendering may not match.`
      )
    }
  })
</script>

<template>
  <!-- v0.4.1 team-composition mode (POTX slide 14) -->
  <div v-if="isTeamMode" class="bio bio--team">
    <AnvilGridDecoration class="bio-band" bg="var(--sap-blue-10)" color="var(--sap-blue-6)" />
    <div class="bio-cards">
      <article v-for="p in props.people" :key="p.name" class="bio-card">
        <div class="bio-card__photo">
          <img v-if="p.photo" :src="assetUrl(p.photo)" :alt="p.name" />
        </div>
        <div class="bio-card__body">
          <h3 class="bio-card__name">{{ p.name }}</h3>
          <p v-if="p.role" class="bio-card__role">{{ p.role }}</p>
          <QRCode v-if="p.qr" :url="p.qr" :size="64" class="bio-card__qr" />
        </div>
      </article>
    </div>
  </div>

  <!-- v0.2 single-presenter mode (backward-compat, unchanged) -->
  <ui5-card v-else-if="presenterData" :class="['bio', 'bio--single', { compact }]">
    <!-- eslint-disable vue/no-deprecated-slot-attribute -->
    <ui5-card-header
      slot="header"
      :title-text="presenterData.name"
      :subtitle-text="presenterData.title"
    >
      <ui5-avatar slot="avatar" :initials="presenterData.initials" size="M" shape="Circle">
        <img v-if="presenterData.photo" :src="presenterData.photo" :alt="presenterData.name" />
      </ui5-avatar>
    </ui5-card-header>
    <!-- eslint-enable vue/no-deprecated-slot-attribute -->
    <div v-if="!compact && presenterData.bio" class="bio-body">
      {{ presenterData.bio }}
    </div>
    <div class="bio-socials">
      <SocialIcon
        v-for="s in presenterData.socials"
        :key="`${s.platform}-${s.handle}`"
        v-bind="s"
      />
    </div>
  </ui5-card>
</template>

<style scoped>
  /* === v0.4.1 team-composition mode (POTX slide 14) === */
  .bio--team {
    position: relative;
    width: 100%;
    height: 100%;
    font-family: var(--sap-font-family);
  }
  /* Anvil header band: top 0% → 50% per POTX slide-14 measurement.
     The band uses AnvilGridDecoration which is position:absolute; inset:0 by
     default — override to a top-half band. */
  .bio-band {
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 50% !important;
  }
  /* Card grid: 4 columns, anchored top:24.4% bottom:12% so cards intrude
     into the band by 25.6% of slide height (POTX-measured). */
  .bio--team .bio-cards {
    position: absolute;
    top: 24.4%;
    bottom: 12%;
    /* POTX outer margin: 80px / 1920 = 4.17% on each side */
    left: 4.2%;
    right: 4.2%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    /* POTX gap: 47px / 1920 = 2.45% */
    column-gap: 2.45%;
    z-index: 2;
  }
  .bio-card {
    background: #ffffff;
    /* POTX cards have a subtle shadow (no measured value yet — tune in Stage D). */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .bio-card__photo {
    /* 4:5 portrait aspect; wide source photos crop. */
    aspect-ratio: 4 / 5;
    background: #f0f3f5;
    overflow: hidden;
  }
  .bio-card__photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .bio-card__body {
    padding: 8% 8% 6%;
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 0.4rem;
  }
  .bio-card__name {
    font-family: var(--sap-font-family-bold, var(--sap-font-major));
    font-weight: 700;
    font-size: 1.1rem;
    line-height: 1.2;
    color: var(--sap-text-primary, #000);
    margin: 0;
  }
  .bio-card__role {
    color: var(--sap-text-secondary, #5b738b);
    font-size: 0.85rem;
    line-height: 1.3;
    margin: 0;
  }
  .bio-card__qr {
    margin-top: auto;
    width: 64px;
    height: 64px;
    align-self: flex-end;
  }

  /* === v0.2 single-presenter mode (unchanged, backward-compat) === */
  .bio--single {
    width: 100%;
    max-width: 28rem;
  }
  .bio--single .bio-body {
    padding: 0.75rem 1rem 0.5rem;
    font-size: 1rem;
    line-height: 1.5;
    color: var(--sapTextColor);
  }
  .bio--single .bio-socials {
    padding: 0 1rem 1rem;
  }
  .bio--single.compact .bio-body {
    display: none;
  }
</style>
