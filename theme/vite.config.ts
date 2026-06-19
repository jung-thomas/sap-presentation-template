import { defineConfig } from 'vite'
import yaml from '@rollup/plugin-yaml'

// Slidev loads `vite.config.ts` from every entry in its `roots` array
// (which includes both this theme directory and the deck's user-root, see
// node_modules/@slidev/cli/dist/chunk-YP37OZJY.js: `roots = uniq([...themeRoots,
// ...addonRoots, userRoot])`). Placing the yaml plugin here ensures it's
// active for any deck that uses this theme — both `slides.md` (project root)
// and `pages/all-layouts.md` (one level deeper).
//
// The project-root `vite.config.ts` ALSO declares `yaml()`, but that file is
// only auto-loaded when Slidev's userRoot equals the project root (i.e. for
// `slides.md`). For `pages/all-layouts.md` the userRoot is `pages/`, so the
// project-root config isn't picked up. Without this theme-side config, YAML
// imports would fail with "Failed to parse source for import analysis because
// the content contains invalid JS syntax" and every gallery slide that
// depends on presenter / event / program / team data would render Slidev's
// error fallback.
//
// See docs/superpowers/specs/2026-06-18-v0.4.4-vr-infrastructure-design.md §6.4.
export default defineConfig({
  plugins: [yaml()]
})
