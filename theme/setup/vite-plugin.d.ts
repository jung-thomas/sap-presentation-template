import type { Plugin } from 'vite'

/**
 * Merges the SAP theme's bundled `public/` assets (logos, anvil decorations,
 * presenter photos, etc.) into the consuming deck's served + built output.
 *
 * Layering: the deck's own `public/` always wins. This plugin only fills in
 * the gaps — files the deck didn't ship are served from the theme.
 *
 * Usage in a deck's `vite.config.ts`:
 *
 *   import { defineConfig } from 'vite'
 *   import yaml from '@rollup/plugin-yaml'
 *   import { sapThemeAssets } from '@jungsap/slidev-theme-sap/vite-plugin'
 *
 *   export default defineConfig({
 *     plugins: [yaml(), sapThemeAssets()],
 *     // ...
 *   })
 */
export function sapThemeAssets(): Plugin
