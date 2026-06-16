<script setup lang="ts">
  import { computed } from 'vue'
  import FlatAnvilOutline from '../components/decorations/FlatAnvilOutline.vue'
  import Bio from '../components/Bio.vue'
  import ClassificationFooter from '../components/ClassificationFooter.vue'
  import { assetUrl } from '../setup/assets'

  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = computed(() => props.frontmatter ?? {})
  const title = computed(() => (fm.value.title as string) ?? 'Questions?')
  const eyebrow = computed(() => fm.value.eyebrow as string | undefined)
  const subtitle = computed(() => fm.value.subtitle as string | undefined)
  const image = computed(() => fm.value.image as string | undefined)
  const presenter = computed(() => fm.value.presenter as string | undefined)
  const classification = computed(() => fm.value.classification as string | null | undefined)
</script>

<template>
  <div class="layout qa">
    <div class="qa-content">
      <span v-if="eyebrow" class="qa-eyebrow">{{ eyebrow }}</span>
      <h1 class="qa-title">{{ title }}</h1>
      <p v-if="subtitle" class="qa-subtitle">{{ subtitle }}</p>
      <Bio v-if="presenter" :presenter="presenter" compact class="qa-bio" />
      <slot />
    </div>

    <!-- Right-half: outlined Flat Anvil shape with photo inside it -->
    <div class="qa-frame">
      <FlatAnvilOutline class="qa-anvil-frame" color="var(--sap-blue-6)" :stroke-width="6" />
      <div v-if="image" class="qa-photo">
        <img :src="assetUrl(image)" alt="" />
      </div>
    </div>

    <ClassificationFooter :level="classification" />
  </div>
</template>

<style scoped>
  .qa {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: var(--sap-blue-2);
    font-family: var(--sap-font-family);
    display: flex;
  }

  .qa-content {
    flex: 0 0 50%;
    padding: 8% 4.2%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    color: var(--sap-text-primary, #000);
    z-index: 2;
  }

  .qa-eyebrow {
    font-family: var(--sap-font-family-bold, var(--sap-font-major));
    font-weight: 700;
    font-size: 0.85rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin: 0;
  }

  .qa-title {
    font-family: var(--sap-font-family-bold, var(--sap-font-major));
    font-weight: 700;
    font-size: 4rem;
    line-height: 1.05;
    margin: 0;
  }

  .qa-subtitle {
    font-size: 1.5rem;
    line-height: 1.4;
    margin: 0;
    color: var(--sap-grey-7, #5b738b);
  }

  .qa-bio {
    margin-top: 1rem;
  }

  .qa-frame {
    position: relative;
    flex: 0 0 50%;
  }

  /* Anvil outline as photo frame on the right half. Sized at the canonical
     anvil 2.04:1 ratio so the silhouette never distorts (brand rule). The
     qa-frame is 50% × 100% of slide = 960×1080 px; an 84%-wide outline
     ≈ 806×395 px sits comfortably inside, vertically centered. */
  .qa-anvil-frame {
    position: absolute;
    width: 84%;
    aspect-ratio: 605 / 297;
    left: 8%;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
  }

  /* Photo nestles inside the anvil outline. Kept smaller than the anvil's
     bounding box so the trapezoid silhouette reads as a frame around it. */
  .qa-photo {
    position: absolute;
    width: 70%;
    aspect-ratio: 4 / 3;
    left: 15%;
    top: 50%;
    transform: translateY(-50%);
    overflow: hidden;
    z-index: 2;
  }

  .qa-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .qa::after {
    content: none !important;
  }
</style>
