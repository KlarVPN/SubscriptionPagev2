import { renderSVG } from 'uqr'

const QR_CODE_OPTIONS = {
  whiteColor: '#ffffff',
  blackColor: '#000000',
} as const

export function createQrCodeDataUrl(content: string): string {
  if (!content) return ''

  const svg = renderSVG(content, QR_CODE_OPTIONS)

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
