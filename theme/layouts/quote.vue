<script setup lang="ts">
  import { computed } from 'vue'
  import FlatAnvil from '../components/decorations/FlatAnvil.vue'
  import ClassificationFooter from '../components/ClassificationFooter.vue'

  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = computed(() => props.frontmatter ?? {})
  const author = computed(() => fm.value.author as string | undefined)
  // company is the v0.4.2 field; source is the v0.3 alias
  const company = computed(
    () => (fm.value.company as string) ?? (fm.value.source as string | undefined)
  )
  const role = computed(() => fm.value.role as string | undefined)
  const classification = computed(() => fm.value.classification as string | null | undefined)
</script>

<template>
  <div class="layout quote">
    <FlatAnvil class="quote-highlight" color="var(--sap-blue-4)" />
    <span class="quote-eyebrow">Quote</span>
    <blockquote class="quote-text">
      <slot />
    </blockquote>
    <footer v-if="author" class="quote-attribution">
      <div class="quote-author">{{ author }}</div>
      <div v-if="company" class="quote-company">{{ company }}</div>
      <div v-if="role" class="quote-role">{{ role }}</div>
    </footer>
    <ClassificationFooter :level="classification" />
  </div>
</template>

<style scoped>
  .quote {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: var(--sap-blue-2);
    font-family: var(--sap-font-family);
  }

  /* Giant flat-anvil highlight behind the quote text. Sized at the canonical
     anvil 2.04:1 ratio so the silhouette never distorts (brand rule).
     Width 70% of slide ≈ 1344px → height ≈ 660px (61% of 1080). Centered
     vertically and slightly inset from the right so the diagonal apex stays
     well inside the slide's right edge. */
  .quote-highlight {
    position: absolute;
    width: 70%;
    aspect-ratio: 605 / 297;
    left: 12%;
    top: 50%;
    transform: translateY(-50%);
    z-index: 0;
  }

  .quote-eyebrow {
    position: absolute;
    top: 4%;
    left: 4.2%;
    font-family: var(--sap-font-family-bold, var(--sap-font-major));
    font-weight: 700;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--sap-text-primary, #000);
    z-index: 2;
  }

  .quote-text {
    position: relative;
    z-index: 1;
    margin: 0;
    padding: 0 8%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: var(--sap-text-primary, #000);
    font-size: 2.25rem;
    line-height: 1.3;
    font-weight: 500;
  }

  .quote-attribution {
    position: absolute;
    bottom: 4%;
    right: 4.2%;
    z-index: 2;
    text-align: right;
    color: var(--sap-grey-7, #5b738b);
    font-size: 0.95rem;
    line-height: 1.4;
  }

  .quote-author {
    font-family: var(--sap-font-family-bold, var(--sap-font-major));
    font-weight: 700;
    color: var(--sap-text-primary, #000);
  }

  .quote-company,
  .quote-role {
    font-weight: 400;
  }

  .quote::after {
    content: none !important;
  }
</style>
