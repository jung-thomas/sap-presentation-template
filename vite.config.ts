import { defineConfig } from 'vite'
import yaml from '@rollup/plugin-yaml'

// Slidev reads vite.config.ts at the project root and merges it with its own.
export default defineConfig({
  plugins: [yaml()]
})
