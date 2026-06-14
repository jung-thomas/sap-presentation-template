const KEEP = new Set(['SP_AGENDA'])

export function parseTagXml(xml) {
  const out = []
  const re = /<p:tag\s+name="([^"]+)"\s+val="([^"]*)"/g
  for (const m of xml.matchAll(re)) {
    if (KEEP.has(m[1])) out.push({ name: m[1], value: m[2] })
  }
  return out
}

/** Walk every ppt/tags/*.xml and return all kept tags merged. */
export async function parseAllTags(potxTmp) {
  const { readFile, readdir } = await import('node:fs/promises')
  const { join } = await import('node:path')
  const dir = join(potxTmp, 'ppt', 'tags')
  let files
  try { files = await readdir(dir) } catch { return [] }
  const out = []
  for (const f of files) {
    if (!f.endsWith('.xml')) continue
    const xml = await readFile(join(dir, f), 'utf-8')
    out.push(...parseTagXml(xml))
  }
  return out
}
