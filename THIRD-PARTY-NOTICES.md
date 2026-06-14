# Third-Party Notices

This template bundles assets sourced from third parties. Each is listed with
its origin and license terms.

## SAP "72" Typeface

- **Source:** `@sap-theming/theming-base-content` npm package
- **License:** Apache License 2.0
- **Files:** `node_modules/@sap-theming/theming-base-content/content/Base/baseLib/baseTheme/fonts/72-*.woff2` (resolved at build time by Vite)
- **Notes:** Includes Regular, Italic, Bold, BoldItalic, Light, Black weights.

## SAP Brand Assets (extracted from `SAP_Corp.potx`)

The following media files are bundled in `public/sap/` and reused under SAP
brand-tools terms:

- `anvil-ripple.svg` — the SAP Anvil Ripple Pattern (POTX `image38.svg`)
- `flat-anvil.svg` — the canonical SAP Flat Anvil primitive (POTX `image11.svg` family)
- `wordmark.png` — the SAP wordmark/bookmark (POTX `image37.png`)
- `covers/cover-{1,2,3}.png` — brand-licensed stock cover photos (POTX `image40/41/86.png`)
- `icons/*.svg` — SAP-Fiori-icon-style glyphs (POTX `image28/30/32/34/...svg`)

These are SAP corporate brand assets, included for use in SAP-branded
presentations only. Authors creating non-SAP-branded presentations should
remove or replace these assets before publishing.

If you are an SAP brand-team contact and the bundling is in conflict with
brand-tools terms, please open an issue in this repository — the build
pipeline centralizes all paths in `theme/styles/_extracted/media/` and
swapping to authenticated `brand.sap.com` references is a single-PR change.
