// Vite plugin that merges the SAP theme's bundled `public/` assets into the
// consuming deck's served + built output. See vite-plugin.d.ts for types and
// the full prose explanation.

import { existsSync, cpSync, statSync, readdirSync, createReadStream } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const themeRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const themePublic = join(themeRoot, 'public')

function listFilesRel(dir, base = dir) {
  if (!existsSync(dir)) return []
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...listFilesRel(full, base))
    } else {
      out.push(relative(base, full).split('\\').join('/'))
    }
  }
  return out
}

export function sapThemeAssets() {
  let themeFileList = null
  const getThemeFiles = () => (themeFileList ??= listFilesRel(themePublic))

  return {
    name: 'slidev-theme-sap:public-assets',

    // --- DEV: serve theme assets when the deck's public dir doesn't have them.
    configureServer(server) {
      const deckPublic = server.config.publicDir
      return () => {
        server.middlewares.use((req, res, next) => {
          const url = (req.url ?? '').split('?')[0]
          if (!url || url === '/') return next()
          const rel = url.replace(/^\/+/, '')
          if (rel.startsWith('@') || rel.startsWith('node_modules/')) return next()

          // Deck wins.
          if (deckPublic && existsSync(join(deckPublic, rel))) return next()

          const themeFile = join(themePublic, rel)
          if (!existsSync(themeFile)) return next()
          const st = statSync(themeFile)
          if (!st.isFile()) return next()

          res.setHeader('Cache-Control', 'no-cache')
          const ext = themeFile.slice(themeFile.lastIndexOf('.')).toLowerCase()
          const types = {
            '.svg': 'image/svg+xml',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.webp': 'image/webp',
            '.yaml': 'application/yaml',
            '.yml': 'application/yaml',
            '.json': 'application/json',
            '.css': 'text/css',
            '.woff': 'font/woff',
            '.woff2': 'font/woff2',
            '.ttf': 'font/ttf'
          }
          if (types[ext]) res.setHeader('Content-Type', types[ext])
          createReadStream(themeFile).pipe(res)
        })
      }
    },

    // --- BUILD: after Vite writes dist/, copy any missing theme assets in.
    closeBundle() {
      const outDir = resolve('dist')
      if (!existsSync(themePublic)) return
      for (const rel of getThemeFiles()) {
        const target = join(outDir, rel)
        if (existsSync(target)) continue
        cpSync(join(themePublic, rel), target, { recursive: false })
      }
    }
  }
}
