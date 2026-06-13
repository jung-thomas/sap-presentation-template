// In a Vite-built context, import.meta.glob('/presenters/*.yaml', { eager: true })
// loads every YAML at build time and produces a record keyed by file path.
// This module is fully mocked in tests via vi.mock('./_dataSources', ...) so
// the glob calls here are never executed by Vitest.

const presenterModules = import.meta.glob('/presenters/*.yaml', {
  eager: true,
  import: 'default'
}) as Record<string, unknown>

const teamModules = import.meta.glob('/teams/*.yaml', {
  eager: true,
  import: 'default'
}) as Record<string, unknown>

const programModules = import.meta.glob('/programs/*.yaml', {
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

export const presenters = indexBySlug(presenterModules)
export const teams = indexBySlug(teamModules)
export const programs = indexBySlug(programModules)
export const event = eventData
