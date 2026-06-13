<template>
  <TitleContent v-bind="$attrs">
    <slot />
  </TitleContent>
</template>

<script setup lang="ts">
  import TitleContent from './title-content.vue'
  defineOptions({ inheritAttrs: false })
</script>
