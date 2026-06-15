<!-- theme/components/cover/CoverDecoration.vue -->
<script setup lang="ts">
  import { computed } from 'vue'
  import type { CoverVariantConfig } from '../../setup/cover-variants'
  import AnvilGridDecoration from '../decorations/AnvilGridDecoration.vue'
  import FlatAnvil from '../decorations/FlatAnvil.vue'
  import PhotoFrame from '../decorations/PhotoFrame.vue'

  const props = defineProps<{
    spec: CoverVariantConfig
    /** Required when spec.hasPhoto is true. Validation happens upstream
     *  in cover.vue via validateVariant(). */
    image?: string
  }>()

  // R-half background: 'photo' means the photo fills it; otherwise it's a CSS color.
  const baseBg = computed(() => (props.spec.rBg === 'photo' ? 'transparent' : props.spec.rBg))

  const showPhoto = computed(() => props.spec.hasPhoto && !!props.image)
  const showAnvilGrid = computed(() => props.spec.rDecoration === 'anvil-grid')
  const showFlatAnvil = computed(() => props.spec.rDecoration === 'flat-anvil-single')
</script>

<template>
  <div class="cover-decoration" :style="{ background: baseBg }" aria-hidden="true">
    <!-- Photo behind the decoration (variants k, l). -->
    <PhotoFrame v-if="showPhoto" :image="image" placement="full" class="cover-photo" />

    <!-- Anvil-grid decoration (variants a, k). -->
    <AnvilGridDecoration
      v-if="showAnvilGrid"
      :color="spec.anvilColor"
      :bg="spec.rBg"
      class="cover-anvils"
    />

    <!-- Single large Flat Anvil shape behind photo (variant l only). -->
    <div v-if="showFlatAnvil" class="cover-flat-anvil">
      <FlatAnvil :color="spec.anvilColor" />
    </div>
  </div>
</template>

<style scoped>
  .cover-decoration {
    position: relative;
    width: 40%;
    height: 100%;
    overflow: hidden;
  }
  .cover-photo {
    position: absolute;
    inset: 0;
    z-index: 1;
  }
  /* Anvil grid sits ABOVE the photo so its tile pattern overlays (variant k).
     For variant a (no photo), the grid sits on the rBg color directly. */
  .cover-anvils {
    z-index: 2;
  }
  /* Flat-anvil shape sits BEHIND the photo (variant l) — the photo punches
     through it so the anvil reads as a backdrop frame. */
  .cover-flat-anvil {
    position: absolute;
    inset: 10% 15%;
    z-index: 0;
  }
</style>
