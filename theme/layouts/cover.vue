<!-- theme/layouts/cover.vue -->
<script setup lang="ts">
  import { computed } from 'vue'
  import { getVariantSpec, validateVariant, type CoverLetter } from '../setup/cover-variants'
  import CoverContent from '../components/cover/CoverContent.vue'
  import CoverDecoration from '../components/cover/CoverDecoration.vue'
  import ClassificationFooter from '../components/ClassificationFooter.vue'

  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = computed(() => props.frontmatter ?? {})

  const variantInput = computed(() => (fm.value.variant as string | undefined) ?? 'a')
  const image = computed(() => fm.value.image as string | undefined)

  // validateVariant() throws on unimplemented variants and on variants k/l
  // missing image:. The throw surfaces in Slidev's dev-mode HMR overlay
  // and at build time, both of which are author-friendly failure modes.
  const variant = computed<CoverLetter>(() =>
    validateVariant(variantInput.value, { hasImage: !!image.value })
  )

  const spec = computed(() => getVariantSpec(variant.value))

  const title = computed(() => (fm.value.title as string | undefined) ?? '')
  // Covers support 1-N presenters via `presenters: [slug-a, slug-b]`. Other
  // single-byline layouts (thank-you, q-and-a) keep their `presenter:` field —
  // the cover is where co-presented talks need to declare authorship up front.
  const presenters = computed(() => (fm.value.presenters as string[] | undefined) ?? [])
  const date = computed(() => fm.value.date as string | undefined)
  const partnerLogo = computed(() => fm.value.partnerLogo as string | null | undefined)
  const classification = computed(() => fm.value.classification as string | null | undefined)
</script>

<template>
  <div :class="['cover', `cover--${variant}`]">
    <CoverContent
      :bg="spec.lBg"
      :text-on-l="spec.textOnL"
      :title="title"
      :presenters="presenters"
      :date="date"
      :partner-logo="partnerLogo"
    />
    <CoverDecoration :spec="spec" :image="image" />
    <ClassificationFooter :level="classification" />
  </div>
</template>

<style scoped>
  .cover {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex; /* enables 60/40 split via flex-basis on children */
    overflow: hidden;
  }
  /* Suppress the global slide-styles ::after accent — covers don't use it */
  .cover::after {
    content: none !important;
  }
</style>
