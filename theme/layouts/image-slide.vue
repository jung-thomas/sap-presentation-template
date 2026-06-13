<script setup lang="ts">
  defineProps<{ src: string; alt?: string }>()
</script>

<template>
  <div class="layout image-slide">
    <img :src="src" :alt="alt ?? ''" />
  </div>
</template>

<style scoped>
  .image-slide {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
    padding: 0;
  }
  .image-slide img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  .image-slide::after {
    content: none !important;
  }
</style>
