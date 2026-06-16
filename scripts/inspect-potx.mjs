#!/usr/bin/env node
/**
 * inspect-potx.mjs — list slide layouts and dump the XML of one to stdout
 * for measuring exact anvil shape geometry.
 *
 * Usage:
 *   node scripts/inspect-potx.mjs <potx>            # lists masters + layouts
 *   node scripts/inspect-potx.mjs <potx> <innerPath> # dumps that XML file
 */

import { extractPotxToTemp } from './lib/unzip-potx.mjs'
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const potxPath = process.argv[2]
const inner = process.argv[3]
if (!potxPath) {
  console.error('usage: inspect-potx.mjs <path.potx> [innerPath]')
  process.exit(1)
}

const dir = await extractPotxToTemp(potxPath)
console.log(`# extracted to ${dir}`)

if (inner) {
  const xml = await readFile(join(dir, inner), 'utf8')
  console.log(xml)
  process.exit(0)
}

// List masters + layouts
async function walk(rel) {
  const full = join(dir, rel)
  let entries
  try {
    entries = await readdir(full, { withFileTypes: true })
  } catch {
    return
  }
  for (const e of entries) {
    const p = join(rel, e.name).replaceAll('\\', '/')
    if (e.isDirectory()) await walk(p)
    else console.log(p)
  }
}

await walk('ppt')
