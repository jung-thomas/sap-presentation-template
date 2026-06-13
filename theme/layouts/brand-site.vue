<template>
  <div class="layout brand-site">
    <h1>SAP Brand Resources</h1>
    <p class="intro">Official public resources for SAP brand guidelines and assets.</p>
    <ul class="links">
      <li>
        <a href="https://brand.sap.com" target="_blank" rel="noopener">
          <strong>brand.sap.com</strong>
          <span>SAP Brand Portal — logos, colors, fonts, and usage guidelines</span>
        </a>
      </li>
      <li>
        <a href="https://experience.sap.com" target="_blank" rel="noopener">
          <strong>experience.sap.com</strong>
          <span>SAP Fiori Design Guidelines — UX patterns and components</span>
        </a>
      </li>
      <li>
        <a href="https://news.sap.com" target="_blank" rel="noopener">
          <strong>news.sap.com</strong>
          <span>SAP News — press releases, product announcements</span>
        </a>
      </li>
      <li>
        <a href="https://help.sap.com" target="_blank" rel="noopener">
          <strong>help.sap.com</strong>
          <span>SAP Help Portal — official product documentation</span>
        </a>
      </li>
      <li>
        <a href="https://developers.sap.com" target="_blank" rel="noopener">
          <strong>developers.sap.com</strong>
          <span>SAP Developer Portal — tutorials, missions, and community</span>
        </a>
      </li>
    </ul>
    <slot />
  </div>
</template>

<style scoped>
  .brand-site {
    padding: 3rem 4rem;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .brand-site h1 {
    font-size: 2.5rem;
    color: var(--sap-brand-blue-darker);
    margin-bottom: 0.5rem;
  }
  .intro {
    font-size: 1.1rem;
    color: var(--sapContent_LabelColor);
    margin-bottom: 1.5rem;
  }
  .links {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .links li a {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    text-decoration: none;
    padding: 0.75rem 1rem;
    border-radius: var(--sap-radius-card);
    border: 1px solid var(--sap-brand-blue-pale);
    transition: background 0.15s;
  }
  .links li a:hover {
    background: var(--sap-brand-blue-pale);
  }
  .links li a strong {
    color: var(--sap-brand-blue);
    font-size: 1.1rem;
  }
  .links li a span {
    font-size: 0.95rem;
    color: var(--sapContent_LabelColor);
  }
</style>
