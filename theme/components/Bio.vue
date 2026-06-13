<script setup lang="ts">
  import { resolvePresenter } from '../setup/data'
  import SocialIcon from './SocialIcon.vue'

  const props = defineProps<{ presenter?: string; compact?: boolean }>()
  const p = resolvePresenter(props.presenter)
</script>

<template>
  <ui5-card :class="['bio', { compact }]">
    <ui5-card-header slot="header" :title-text="p.name" :subtitle-text="p.title">
      <ui5-avatar slot="avatar" :initials="p.initials" size="L" shape="Circle">
        <img v-if="p.photo" :src="p.photo" :alt="p.name" />
      </ui5-avatar>
    </ui5-card-header>
    <div v-if="!compact && p.bio" class="bio-body">
      {{ p.bio }}
    </div>
    <div class="bio-socials">
      <SocialIcon v-for="s in p.socials" :key="`${s.platform}-${s.handle}`" v-bind="s" />
    </div>
  </ui5-card>
</template>

<style scoped>
  .bio {
    width: 100%;
    max-width: 28rem;
  }
  .bio-body {
    padding: 0.75rem 1rem 0.5rem;
    font-size: 1rem;
    line-height: 1.5;
    color: var(--sapTextColor);
  }
  .bio-socials {
    padding: 0 1rem 1rem;
  }
  .bio.compact .bio-body {
    display: none;
  }
</style>
