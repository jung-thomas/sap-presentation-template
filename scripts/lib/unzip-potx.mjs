import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createReadStream } from 'node:fs'
import unzipper from 'unzipper'

/**
 * Extract a POTX (zip) file into a fresh tmp directory.
 * Returns the absolute path of the tmp dir.
 */
export async function extractPotxToTemp(potxPath) {
  const dir = await mkdtemp(join(tmpdir(), 'potx-'))
  await new Promise((resolve, reject) => {
    createReadStream(potxPath)
      .pipe(unzipper.Extract({ path: dir }))
      .on('close', resolve)
      .on('error', reject)
  })
  return dir
}

/**
 * Read a single file from a POTX without extracting the whole archive.
 * Returns the file contents as a UTF-8 string.
 */
export async function getPotxFile(potxPath, innerPath) {
  const directory = await unzipper.Open.file(potxPath)
  const file = directory.files.find((f) => f.path === innerPath)
  if (!file) throw new Error(`POTX entry not found: ${innerPath}`)
  const buf = await file.buffer()
  return buf.toString('utf-8')
}
