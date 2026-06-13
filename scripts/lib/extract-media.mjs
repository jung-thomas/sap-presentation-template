import { readdir, copyFile, readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { join } from 'node:path'

export async function extractMedia(potxTmp, outDir) {
  const mediaDir = join(potxTmp, 'ppt', 'media')
  const files = await readdir(mediaDir)
  const manifest = []
  for (const file of files) {
    const src = join(mediaDir, file)
    const dst = join(outDir, file)
    await copyFile(src, dst)
    const buf = await readFile(src)
    const sha256 = createHash('sha256').update(buf).digest('hex')
    manifest.push({ file, sha256 })
  }
  return { count: files.length, manifest }
}
