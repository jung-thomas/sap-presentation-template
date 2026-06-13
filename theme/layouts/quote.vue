<script setup lang="ts">
  defineProps<{ author?: string; source?: string }>()
</script>

<template>
  <div class="layout quote">
    <blockquote>
      <slot />
    </blockquote>
    <footer v-if="author">
      <span class="author">— {{ author }}</span>
      <span v-if="source" class="source">, {{ source }}</span>
    </footer>
  </div>
</template>

<style scoped>
  .quote {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 5rem;
    height: 100%;
  }
  blockquote {
    font-size: 2.75rem;
    line-height: 1.3;
    color: var(--sap-brand-blue-darker);
    margin: 0 0 2rem;
    font-weight: 500;
    position: relative;
  }
  blockquote::before {
    content: '\201C';
    position: absolute;
    top: -3rem;
    left: -1rem;
    font-size: 8rem;
    color: var(--sap-brand-blue-pale);
    line-height: 1;
  }
  footer {
    font-size: 1.25rem;
    color: var(--sapContent_LabelColor);
  }
  .author {
    font-weight: 600;
  }
</style>
