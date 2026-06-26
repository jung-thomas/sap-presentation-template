#!/usr/bin/env node
/**
 * scripts/sync-advocates.mjs
 *
 * Resync `theme/teams/dev-advocates.yaml` from the SAP Tutorials API.
 * Specifically: rewrite each member's `qr:` field to the SapCommunity
 * profile URL returned by the API. Skip members where the API has no
 * SapCommunity link (rare; preserve the existing entry untouched).
 *
 * Scope is intentionally narrow:
 *  - presenter files (`theme/presenters/<slug>.yaml`) are NOT rewritten.
 *    They contain hand-curated bios, internal-GHE `url:` overrides on
 *    socials, locally chosen photos, and other context the API doesn't
 *    carry. An earlier broader sync was reverted after it silently
 *    dropped Nora's `github.tools.sap` URL override.
 *  - team membership (list of slugs) is taken from the API. New slugs
 *    in the API that don't have a local presenter file are reported
 *    as an error so missing files get scaffolded before re-running.
 *
 * Run via:    npm run sync-advocates           # writes file
 *             npm run sync-advocates -- --dry  # prints diff, writes nothing
 */

import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import yaml from 'js-yaml'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const TEAM_FILE = resolve(ROOT, 'theme/teams/dev-advocates.yaml')
const PRESENTERS_DIR = resolve(ROOT, 'theme/presenters')
const API_URL =
  'https://tutorial-system-dev-tutorials-approuter.cfapps.eu10-005.hana.ondemand.com/api/advocates'

const DRY_RUN = process.argv.includes('--dry') || process.argv.includes('--dry-run')

function communityUrl(advocate) {
  const link = (advocate.links || []).find((l) => l.kind === 'SapCommunity')
  return link?.url || null
}

async function main() {
  console.log(`Fetching ${API_URL}`)
  const res = await fetch(API_URL)
  if (!res.ok) {
    console.error(`API returned ${res.status} ${res.statusText}`)
    process.exit(1)
  }
  const payload = await res.json()
  const advocates = payload.advocates || payload // tolerate either shape

  if (!Array.isArray(advocates)) {
    console.error('Expected an array of advocates; got:', Object.keys(payload))
    process.exit(1)
  }
  console.log(`API returned ${advocates.length} advocates`)

  // Validate every API slug has a local presenter file — surface gaps loudly
  // instead of scaffolding incomplete files (no photo, no initials).
  const missingPresenters = []
  for (const a of advocates) {
    const file = join(PRESENTERS_DIR, `${a.slug}.yaml`)
    if (!existsSync(file)) missingPresenters.push(a.slug)
  }
  if (missingPresenters.length) {
    console.error('\nMissing presenter files for slugs in API:')
    missingPresenters.forEach((s) => console.error(`  - ${s} (expected ${s}.yaml)`))
    console.error(
      '\nEach advocate needs a hand-curated photo + initials. Add those files manually, then re-run.'
    )
    process.exit(1)
  }

  // Build the new members list, keeping advocates with no SapCommunity link
  // as-is from the existing yaml (preserves any old qr value as fallback).
  const teamYaml = yaml.load(await readFile(TEAM_FILE, 'utf-8'))
  const existingBySlug = new Map((teamYaml.members ?? []).map((m) => [m.slug, m]))
  const skippedNoCommunity = []
  const newMembers = []
  for (const a of advocates) {
    const qr = communityUrl(a)
    if (!qr) {
      skippedNoCommunity.push(a.slug)
      const existing = existingBySlug.get(a.slug)
      if (existing) newMembers.push(existing)
      continue
    }
    newMembers.push({ slug: a.slug, qr })
  }

  // Diff report
  console.log('\n=== Team roster file ===')
  const changes = []
  for (const m of newMembers) {
    const prev = existingBySlug.get(m.slug)
    if (!prev) changes.push({ slug: m.slug, old: '(new)', neu: m.qr })
    else if (prev.qr !== m.qr) changes.push({ slug: m.slug, old: prev.qr, neu: m.qr })
  }
  const removedSlugs = [...existingBySlug.keys()].filter((s) => !newMembers.find((m) => m.slug === s))
  if (changes.length === 0 && removedSlugs.length === 0) {
    console.log('  no changes')
  } else {
    if (changes.length) {
      console.log(`  ${changes.length} QR URL(s) will change:`)
      for (const c of changes) {
        console.log(`    ${c.slug}:`)
        console.log(`      old: ${c.old}`)
        console.log(`      new: ${c.neu}`)
      }
    }
    if (removedSlugs.length) {
      console.log(`  Removed (no longer in API): ${removedSlugs.join(', ')}`)
    }
  }
  if (skippedNoCommunity.length) {
    console.log(`  Skipped (no SapCommunity link in API): ${skippedNoCommunity.join(', ')}`)
  }

  teamYaml.members = newMembers
  const yamlOut = yaml.dump(teamYaml, { lineWidth: -1, quotingType: '"' })

  if (DRY_RUN) {
    console.log('\n(--dry: no files written)')
    return
  }
  await writeFile(TEAM_FILE, yamlOut)
  console.log('\nWrote: theme/teams/dev-advocates.yaml')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
