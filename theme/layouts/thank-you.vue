<!-- theme/layouts/thank-you.vue -->
<script setup lang="ts">
  import { computed } from 'vue'
  import AnvilGridDecoration from '../components/decorations/AnvilGridDecoration.vue'
  import SapTaglineLockup from '../components/SapTaglineLockup.vue'
  import LegalNotice from '../components/LegalNotice.vue'
  import QRCode from '../components/QRCode.vue'
  import ClassificationFooter from '../components/ClassificationFooter.vue'
  import { resolvePresenter } from '../setup/data'

  type Variant = 'a' | 'b'

  const props = defineProps<{ frontmatter?: Record<string, unknown> }>()
  const fm = computed(() => props.frontmatter ?? {})
  // Default 'b' to preserve v0.3 backward-compat (per spec §5.3 fix)
  const variant = computed<Variant>(() => {
    const raw = ((fm.value.variant as string) ?? 'b').toLowerCase()
    return raw === 'a' ? 'a' : 'b'
  })

  const presenter = computed(() => fm.value.presenter as string | undefined)
  const presenterData = computed(() => (presenter.value ? resolvePresenter(presenter.value) : null))
  const qrUrl = computed(() => fm.value.qrUrl as string | undefined)
  const legalNotice = computed(() => fm.value.legalNotice as string | undefined)
  const classification = computed(() => fm.value.classification as string | null | undefined)
</script>

<template>
  <!-- Variant A: minimal white close -->
  <div v-if="variant === 'a'" class="thank-you thank-you--a">
    <div class="thanks-a-content">
      <span class="thanks-a-label">Contact information:</span>
      <slot />
    </div>
    <SapTaglineLockup class="thanks-a-tagline" />
    <LegalNotice class="thanks-a-legal" :override="legalNotice" />
    <ClassificationFooter :level="classification" />
  </div>

  <!-- Variant B: substantial close with anvil band + contact card -->
  <div v-else class="thank-you thank-you--b">
    <div class="thanks-band">
      <AnvilGridDecoration bg="var(--sap-blue-10)" color="var(--sap-blue-6)" />
    </div>
    <h1 class="thanks-headline">Thank you.</h1>
    <div v-if="presenterData" class="thanks-contact">
      <div class="thanks-contact__name">{{ presenterData.name }}</div>
      <div class="thanks-contact__title">{{ presenterData.title }}</div>
      <div v-if="presenterData.address" class="thanks-contact__line">
        {{ presenterData.address }}
      </div>
      <div v-if="presenterData.city" class="thanks-contact__line">
        {{ presenterData.city }}
      </div>
      <div v-if="presenterData.email" class="thanks-contact__line">
        {{ presenterData.email }}
      </div>
    </div>
    <QRCode v-if="qrUrl" :url="qrUrl" :size="110" class="thanks-qr" />
    <SapTaglineLockup class="thanks-b-tagline" />
    <LegalNotice class="thanks-b-legal" :override="legalNotice" />
    <ClassificationFooter :level="classification" />
  </div>
</template>

<style scoped>
  .thank-you {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-family: var(--sap-font-family);
    background: #ffffff;
  }

  /* === VARIANT A: minimal white close === */
  .thanks-a-content {
    position: absolute;
    /* "Contact information:" label per POTX y=464/1080 ≈ 43% from top */
    top: 43%;
    left: 4.2%;
    right: 4.2%;
    color: var(--sap-text-primary, #000);
  }
  .thanks-a-label {
    font-size: 1rem;
    font-weight: 500;
  }
  .thanks-a-tagline {
    position: absolute;
    /* POTX y=944-999 ≈ 87.4% from top, bottom-right */
    bottom: 7.5%;
    right: 4.2%;
  }
  .thanks-a-legal {
    position: absolute;
    /* POTX y=1034-1046 ≈ bottom-center */
    bottom: 3%;
    left: 50%;
    transform: translateX(-50%);
  }

  /* === VARIANT B: substantial close === */
  /* Anvil header band: top 50% per POTX y=0-541 */
  .thanks-band {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 50%;
    z-index: 1;
  }
  .thanks-headline {
    position: absolute;
    /* POTX y=647-751/1080 ≈ 59.9% from top */
    top: 60%;
    left: 4.2%;
    margin: 0;
    font-family: var(--sap-font-family-bold, var(--sap-font-major));
    font-weight: 700;
    /* POTX height 105px on 1080-tall slide ≈ 9.7% — use rem-equivalent */
    font-size: 5rem;
    line-height: 1;
    color: var(--sap-text-primary, #000);
    z-index: 2;
  }
  .thanks-contact {
    position: absolute;
    /* Center-right of bottom half, leaves room for QR on the right */
    top: 65%;
    right: 22%;
    color: var(--sap-text-primary, #000);
    font-size: 1rem;
    line-height: 1.4;
    z-index: 2;
  }
  .thanks-contact__name {
    font-family: var(--sap-font-family-bold, var(--sap-font-major));
    font-weight: 700;
    margin-bottom: 0.25rem;
  }
  .thanks-contact__title,
  .thanks-contact__line {
    font-weight: 400;
  }
  .thanks-qr {
    position: absolute;
    /* POTX QR at far right ~7% of slide width on 1920-wide → ~110px */
    top: 65%;
    right: 4.2%;
    width: 110px;
    height: 110px;
    z-index: 2;
  }
  .thanks-b-tagline {
    position: absolute;
    bottom: 7%;
    right: 18%;
    z-index: 2;
  }
  .thanks-b-legal {
    position: absolute;
    bottom: 4%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
  }
  .thank-you::after {
    content: none !important;
  }
</style>
