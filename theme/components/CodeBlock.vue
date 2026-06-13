<script setup lang="ts">
  defineProps<{
    lang?: string
    filename?: string
    caption?: string
    highlight?: string
  }>()
</script>

<template>
  <figure class="codeblock">
    <header v-if="filename || lang" class="codeblock-header">
      <span v-if="filename" class="filename">{{ filename }}</span>
      <span v-if="lang" class="lang">{{ lang }}</span>
    </header>
    <div class="codeblock-body">
      <slot />
    </div>
    <figcaption v-if="caption">
      {{ caption }}
    </figcaption>
  </figure>
</template>

<style scoped>
  .codeblock {
    margin: 0;
    border-radius: var(--sap-radius-card);
    overflow: hidden;
    border: 1px solid #e5e9ed;
    box-shadow: var(--sap-shadow-card);
    background: #fff;
  }
  .codeblock-header {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    background: var(--sap-brand-blue-darker);
    color: #fff;
    font-size: 0.85rem;
  }
  .filename {
    font-family: monospace;
  }
  .lang {
    opacity: 0.8;
    text-transform: uppercase;
  }
  .codeblock-body :deep(pre) {
    margin: 0;
    padding: 1rem;
  }
  .codeblock figcaption {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    color: var(--sapContent_LabelColor);
    background: #fafbfc;
  }
</style>
