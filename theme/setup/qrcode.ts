import QR from 'qrcode'

export async function makeQrDataUrl(url: string, size = 200): Promise<string> {
  return QR.toDataURL(url, { width: size, margin: 1 })
}
