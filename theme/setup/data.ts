import type { Presenter, Team, Program, Event, Disclaimers } from '../types'

import {
  presenters as _presenters,
  teams as _teams,
  programs as _programs,
  event as _event
} from './_dataSources'

const presenters = _presenters as Record<string, Presenter>
const teams = _teams as Record<string, Team>
const programs = _programs as Record<string, Program>
const event = _event as Event

export function getEvent(): Event {
  return event
}

export function resolvePresenter(slug?: string): Presenter {
  const s = slug ?? event.defaultPresenter
  const p = presenters[s]
  if (!p) throw new Error(`presenter "${s}" not found in /presenters/`)
  return p
}

export function resolvePresenters(slugs: string[]): Presenter[] {
  return slugs.map((s) => resolvePresenter(s))
}

export function resolveTeam(slug: string): Team & { presenters: Presenter[] } {
  const t = teams[slug]
  if (!t) throw new Error(`team "${slug}" not found in /teams/`)
  return { ...t, presenters: resolvePresenters(t.members) }
}

export function resolveProgram(slug: string): Program {
  const p = programs[slug]
  if (!p) throw new Error(`program "${slug}" not found in /programs/`)
  return p
}

export function resolveDisclaimers(): Disclaimers {
  // Disclaimers live in programs/disclaimers.yaml as a flat object.
  const d = programs['disclaimers'] as unknown as Disclaimers
  if (!d) throw new Error(`programs/disclaimers.yaml is missing`)
  return d
}
