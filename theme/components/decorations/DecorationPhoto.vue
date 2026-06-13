<script setup lang="ts">
  defineProps<{ image?: string; alt?: string }>()
</script>

<template>
  <div class="decoration-photo" aria-hidden="true">
    <img v-if="image" :src="image" :alt="alt ?? ''" class="decoration-photo__img" />
    <div v-else class="decoration-photo__fallback">
      <svg
        viewBox="0 0 600 720"
        preserveAspectRatio="xMidYMid slice"
        class="decoration-photo__wedges"
      >
        <polygon points="0,0 600,0 600,504 504,720 0,720" fill="var(--sap-brand-blue-darker)" />
        <polygon points="48,58 600,58 600,468 460,662 48,662" fill="var(--sap-brand-blue)" />
        <polygon
          points="120,144 600,144 600,432 432,576 120,576"
          fill="var(--sap-brand-blue-light, #89D1FF)"
        />
        <polygon
          points="210,252 600,252 600,396 388,468 210,468"
          fill="var(--sap-brand-blue-pale, #D1EFFF)"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>
  .decoration-photo {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background: #ffffff;
  }
  .decoration-photo__img,
  .decoration-photo__fallback {
    position: absolute;
    top: 0;
    left: var(--cover-photo-left, 48.95%);
    width: var(--cover-photo-width, 51.05%);
    height: 100%;
  }
  .decoration-photo__img {
    object-fit: cover;
    object-position: center;
  }
  .decoration-photo__wedges {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
