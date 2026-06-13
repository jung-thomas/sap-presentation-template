/**
 * Resolve an absolute deck asset path to a URL with the correct base.
 *
 * Slidev's build sets a base path (e.g. `/sap-presentation-template/`) when
 * deployed to GitHub Pages under `username.github.io/<repo>/`. Inline
 * `<img src="/foo">` references in Vue templates bypass Slidev's automatic
 * base-path rewriting because they're string literals, not Vite asset
 * imports. Use this helper everywhere an absolute deck path is rendered.
 *
 *   assetUrl('/logos/logo-sap-primary.svg')
 *     // local dev:  '/logos/logo-sap-primary.svg'
 *     // GH Pages:   '/sap-presentation-template/logos/logo-sap-primary.svg'
 *
 * Pass-through for non-absolute paths (relative URLs, http(s):, data:).
 */
export function assetUrl(path: string | undefined): string | undefined {
  if (!path) return path
  if (!path.startsWith('/')) return path
  // import.meta.env.BASE_URL always ends with '/' (e.g. '/' or '/repo-name/')
  const base = import.meta.env.BASE_URL ?? '/'
  return base.replace(/\/$/, '') + path
}
