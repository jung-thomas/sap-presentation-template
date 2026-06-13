<template>
  <aside class="key-takeaway">
    <header>Key takeaway</header>
    <div class="content">
      <slot />
    </div>
  </aside>
</template>

<style scoped>
  .key-takeaway {
    border-left: 6px solid var(--sap-brand-blue);
    padding: 1.25rem 1.5rem;
    background: linear-gradient(90deg, var(--sap-brand-blue-pale), transparent);
    border-radius: 0 var(--sap-radius-card) var(--sap-radius-card) 0;
    max-width: 56rem;
    margin: 1.5rem 0;
  }
  .key-takeaway header {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--sap-brand-blue);
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  .key-takeaway .content {
    font-size: 1.5rem;
    line-height: 1.4;
    color: var(--sapTextColor);
  }
</style>
