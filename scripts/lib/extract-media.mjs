import { readdir, copyFile, readFile, access } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { join } from 'node:path'

export async function extractMedia(potxTmp, outDir) {
  const mediaDir = join(potxTmp, 'ppt', 'media')
  try {
    await access(mediaDir)
  } catch {
    return { count: 0, manifest: [] }
  }
  const files = await readdir(mediaDir)
  // Sort for deterministic manifest ordering across filesystems
  files.sort()
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

const FLAT_ANVIL_PATH = 'M0 0 0 297 307.459 297 605 0 0 0Z'

/**
 * Classify already-loaded media into semantic buckets.
 * Input: object mapping filename -> Buffer (PNG/JPEG) or string (SVG).
 * Output: { ripple, wordmark, flatAnvil, photos: [], icons: [{src,name,viewBox}], other: [] }.
 */
export async function classifyMedia(files) {
  const out = { ripple: null, wordmark: null, flatAnvil: null, photos: [], icons: [], other: [] }
  for (const [name, content] of Object.entries(files)) {
    const ext = name.split('.').pop().toLowerCase()
    if (ext === 'svg') {
      const text = typeof content === 'string' ? content : content.toString('utf-8')
      if (/id="Ripple_Pattern"/i.test(text)) {
        out.ripple = name
        continue
      }
      if (text.includes(FLAT_ANVIL_PATH)) {
        out.flatAnvil = out.flatAnvil ?? name
        continue
      }
      // Real POTX icon SVGs have a wrapper group with an id like
      // "Icons_900px_blue7" or "Icons_16px" containing an inner element
      // (either <g id="..."> or <path id="..."> ) with the per-icon
      // semantic name. Collect every group/path id, drop wrapper-style
      // ids that start with "Icons_", and pick the first remaining one.
      const viewBoxMatch = text.match(/<svg[^>]*viewBox="([^"]+)"/i)
      if (viewBoxMatch) {
        const groupIds = [...text.matchAll(/<g\s+[^>]*\bid="([A-Za-z][\w-]*)"/g)].map((m) => m[1])
        const pathIds = [...text.matchAll(/<path\s+[^>]*\bid="([A-Za-z][\w-]*)"/g)].map((m) => m[1])
        const candidates = [...groupIds, ...pathIds].filter((id) => !/^Icons?_/i.test(id))
        if (candidates.length > 0) {
          out.icons.push({ src: name, name: candidates[0], viewBox: viewBoxMatch[1] })
          continue
        }
      }
      out.other.push(name)
    } else if (ext === 'png' || ext === 'jpeg' || ext === 'jpg') {
      const buf = Buffer.isBuffer(content) ? content : Buffer.from(content)
      const dims = ext === 'png' ? readPngDims(buf) : null
      if (dims) {
        const aspect = dims.w / dims.h
        if (buf.length > 5000 && aspect > 2.8 && aspect < 4.0) {
          out.wordmark = out.wordmark ?? name
          continue
        }
        if (buf.length > 100_000 && aspect >= 0.5 && aspect <= 2.0) {
          out.photos.push(name)
          continue
        }
      }
      out.other.push(name)
    } else {
      out.other.push(name)
    }
  }
  return out
}

function readPngDims(buf) {
  if (buf.length < 24) return null
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) }
}
