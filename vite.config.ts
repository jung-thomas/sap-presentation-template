import { defineConfig } from 'vite'
import yaml from '@rollup/plugin-yaml'
import { sapThemeAssets } from './theme/setup/vite-plugin.js'

// Slidev reads vite.config.ts at the project root and merges it with its own Vite config.
// The `slidev.vue` key is forwarded to Slidev's internal Vue plugin (see
// @slidev/cli createVuePlugin), which honours the user-supplied isCustomElement
// alongside its built-in set of custom elements (KaTeX math tags, etc.).
export default defineConfig({
  plugins: [yaml(), sapThemeAssets()],
  // @ts-expect-error – `slidev` is a Slidev-specific extension key not in Vite's types
  slidev: {
    vue: {
      template: {
        compilerOptions: {
          isCustomElement: (tag: string) => tag.startsWith('ui5-')
        }
      }
    }
  }
})
