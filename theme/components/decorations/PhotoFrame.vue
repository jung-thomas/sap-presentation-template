<script setup lang="ts">
  import { computed } from 'vue'
  import { assetUrl } from '../../setup/assets'

  const props = defineProps<{
    image?: string
    placement?: 'right-half' | 'right-third' | 'left-half' | 'full'
  }>()

  const src = computed(() => assetUrl(props.image))
</script>

<template>
  <div class="photo-frame" :class="`frame-${placement ?? 'right-half'}`">
    <img v-if="src" :src="src" alt="" />
  </div>
</template>

<style scoped>
  .photo-frame {
    position: absolute;
    overflow: hidden;
  }
  .photo-frame img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .frame-right-half {
    top: 0;
    bottom: 0;
    right: 0;
    width: 50%;
  }
  .frame-right-third {
    top: 0;
    bottom: 0;
    right: 0;
    width: 33.3%;
  }
  .frame-left-half {
    top: 0;
    bottom: 0;
    left: 0;
    width: 50%;
  }
  .frame-full {
    inset: 0;
  }
</style>
