// In a Vite-built context, import.meta.glob('/presenters/*.yaml', { eager: true })
// loads every YAML at build time and produces a record keyed by file path.

const presenterModules = (import.meta as any).glob?.('/presenters/*.yaml', {
  eager: true,
  import: 'default'
}) as Record<string, unknown> ?? {}

const teamModules = (import.meta as any).glob?.('/teams/*.yaml', {
  eager: true,
  import: 'default'
}) as Record<string, unknown> ?? {}

const programModules = (import.meta as any).glob?.('/programs/*.yaml', {
  eager: true,
  import: 'default'
}) as Record<string, unknown> ?? {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let eventData: unknown = {}
try {
  // Dynamic import of event.yaml; only works in Vite build context.
  // In Vitest this module is mocked via vi.mock('./_dataSources', ...).
  const mod = await import('/event.yaml').catch(() => ({ default: {} }))
  eventData = (mod as { default: unknown }).default
} catch {
  // Vitest environment: event will be provided via mock
}

function indexBySlug(modules: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [path, mod] of Object.entries(modules)) {
    const slug = path.split('/').pop()!.replace(/\.yaml$/, '')
    if (slug.startsWith('_')) continue // skip _example.yaml
    result[slug] = mod
  }
  return result
}

export const presenters = indexBySlug(presenterModules)
export const teams = indexBySlug(teamModules)
export const programs = indexBySlug(programModules)
export const event = eventData
