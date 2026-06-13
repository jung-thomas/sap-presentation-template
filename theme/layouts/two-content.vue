<template>
  <TitleText2Col v-bind="$attrs"><slot /></TitleText2Col>
</template>

<script setup lang="ts">
  import TitleText2Col from './title-text-2col.vue'
  defineOptions({ inheritAttrs: false })
</script>
