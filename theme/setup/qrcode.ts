// Namespace import — most portable across Vite dev (which serves CJS as
// ESM with named exports) and Rollup production builds. The `qrcode`
// package is CJS with named exports (toDataURL, toCanvas, toString, create)
// and no `module.exports = {...}` default. `import * as QR` exposes all
// named exports as an ESM namespace object in both environments.
import * as QR from 'qrcode'

export async function makeQrDataUrl(url: string, size = 200): Promise<string> {
  return QR.toDataURL(url, { width: size, margin: 1 })
}
