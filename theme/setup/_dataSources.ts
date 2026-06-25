// Two-layer data resolution:
//   1. Theme-bundled defaults — shipped with the npm package.
//      Globbed via paths relative to this file (../presenters/*.yaml).
//      Resolves from node_modules/@jungsap/slidev-theme-sap/presenters/ when the
//      theme is installed as a dependency, or from theme/presenters/ when
//      developed in-tree via the workspace.
//   2. Deck-level overrides — provided by the consuming project.
//      Globbed via project-root-relative paths (/presenters/*.yaml).
//      Vite resolves these against the Slidev project root; if the deck
//      has no /presenters/ folder, the glob is empty (no error).
//
// Merge order: theme defaults first, deck entries last (deck wins by slug).
// Adding presenters/<new-slug>.yaml to a deck creates a new entry. Editing
// presenters/<existing-slug>.yaml in a deck overrides the theme's version
// for that deck only.
//
// This module is fully mocked in tests via vi.mock('./_dataSources', ...) so
// the glob calls here are never executed by Vitest.

// --- Theme-bundled defaults (relative to this module) ---
const themePresenterModules = import.meta.glob('../presenters/*.yaml', {
  eager: true,
  import: 'default'
}) as Record<string, unknown>

const themeTeamModules = import.meta.glob('../teams/*.yaml', {
  eager: true,
  import: 'default'
}) as Record<string, unknown>

const themeProgramModules = import.meta.glob('../programs/*.yaml', {
  eager: true,
  import: 'default'
}) as Record<string, unknown>

// --- Deck-level overrides (relative to the Slidev project root) ---
const deckPresenterModules = import.meta.glob('/presenters/*.yaml', {
  eager: true,
  import: 'default'
}) as Record<string, unknown>

const deckTeamModules = import.meta.glob('/teams/*.yaml', {
  eager: true,
  import: 'default'
}) as Record<string, unknown>

const deckProgramModules = import.meta.glob('/programs/*.yaml', {
  eager: true,
  import: 'default'
}) as Record<string, unknown>

import eventData from '/event.yaml'

function indexBySlug(modules: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [path, mod] of Object.entries(modules)) {
    const slug = path
      .split('/')
      .pop()!
      .replace(/\.yaml$/, '')
    if (slug.startsWith('_')) continue // skip _example.yaml
    result[slug] = mod
  }
  return result
}

// Deck entries override theme entries for the same slug. Object spread later
// wins, which matches the documented merge semantics above.
function merge(
  themeModules: Record<string, unknown>,
  deckModules: Record<string, unknown>
): Record<string, unknown> {
  return { ...indexBySlug(themeModules), ...indexBySlug(deckModules) }
}

export const presenters = merge(themePresenterModules, deckPresenterModules)
export const teams = merge(themeTeamModules, deckTeamModules)
export const programs = merge(themeProgramModules, deckProgramModules)
export const event = eventData
