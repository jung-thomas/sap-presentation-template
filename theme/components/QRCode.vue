<script setup lang="ts">
  import { ref, watchEffect } from 'vue'
  import { makeQrDataUrl } from '../setup/qrcode'

  const props = defineProps<{ url: string; caption?: string; size?: number }>()
  const dataUrl = ref<string>('')

  watchEffect(async () => {
    dataUrl.value = await makeQrDataUrl(props.url, props.size ?? 200)
  })
</script>

<template>
  <figure class="qrcode">
    <img v-if="dataUrl" :src="dataUrl" :alt="`QR code: ${url}`" :width="size ?? 200" />
    <figcaption v-if="caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
  .qrcode {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  .qrcode img {
    border-radius: var(--sap-radius-button);
  }
  .qrcode figcaption {
    font-size: 0.9rem;
    color: var(--sapContent_LabelColor);
  }
</style>
