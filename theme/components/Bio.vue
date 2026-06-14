<script setup lang="ts">
  import { computed } from 'vue'
  import AnvilGrid from './decorations/AnvilGrid.vue'
  import QRCode from './QRCode.vue'
  import SocialIcon from './SocialIcon.vue'
  import { resolvePresenter } from '../setup/data'
  import { assetUrl } from '../setup/assets'

  type Person = { name: string; role?: string; photo?: string; qr?: string }

  const props = defineProps<{
    // v0.3 team-composition API (POTX slide-14)
    people?: Array<Person>
    // v0.2 single-presenter API (backward-compat)
    presenter?: string
    compact?: boolean
  }>()

  const isTeamMode = computed(() => Array.isArray(props.people) && props.people.length > 0)
  const presenterData = computed(() => (props.presenter ? resolvePresenter(props.presenter) : null))
</script>

<template>
  <!-- v0.3 team-composition mode -->
  <div v-if="isTeamMode" class="bio bio--team">
    <AnvilGrid />
    <div class="bio-cards">
      <article v-for="p in props.people" :key="p.name" class="bio-card">
        <img v-if="p.photo" :src="assetUrl(p.photo)" :alt="p.name" class="bio-photo" />
        <h3 class="bio-name">{{ p.name }}</h3>
        <p v-if="p.role" class="bio-role">{{ p.role }}</p>
        <QRCode v-if="p.qr" :url="p.qr" :size="64" class="bio-qr" />
      </article>
    </div>
  </div>

  <!-- v0.2 single-presenter mode (backward-compat) -->
  <ui5-card v-else-if="presenterData" :class="['bio', 'bio--single', { compact }]">
    <!-- eslint-disable vue/no-deprecated-slot-attribute -- UI5 Web Components use native HTML slot attributes -->
    <ui5-card-header
      slot="header"
      :title-text="presenterData.name"
      :subtitle-text="presenterData.title"
    >
      <ui5-avatar slot="avatar" :initials="presenterData.initials" size="L" shape="Circle">
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
  /* === v0.3 team-composition mode === */
  .bio--team {
    position: relative;
    width: 100%;
    height: 100%;
    font-family: var(--sap-font-family);
  }
  .bio--team .bio-cards {
    position: absolute;
    top: 25%;
    left: 4.13%;
    right: 4.13%;
    bottom: 5%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1.5rem;
    z-index: 2;
  }
  .bio-card {
    background: #ffffff;
    border: 1px solid var(--sap-grey-2);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    padding: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .bio-photo {
    width: 100%;
    aspect-ratio: 4 / 5;
    object-fit: cover;
    display: block;
  }
  .bio-name {
    font-family: var(--sap-font-family-bold);
    font-size: 1.1rem;
    margin: 0.75rem 1rem 0.25rem;
    color: var(--sap-text-primary);
  }
  .bio-role {
    color: var(--sap-text-secondary);
    margin: 0 1rem 0.75rem;
    font-size: 0.9rem;
  }
  .bio-qr {
    margin: 0.5rem 1rem 1rem;
    width: 64px;
    height: 64px;
  }

  /* === v0.2 single-presenter mode (backward-compat) === */
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
