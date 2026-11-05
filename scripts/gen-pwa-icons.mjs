import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')
mkdirSync(publicDir, { recursive: true })

// Icono estándar: mismo diseño que favicon.svg (fondo + compás), con
// esquinas redondeadas — para el ícono normal de la app instalada.
const standardSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 48 48">
  <rect width="48" height="48" rx="10" fill="#0a0a0a" />
  <circle cx="24" cy="24" r="16.5" stroke="#f4f3f1" stroke-width="1.4" fill="none" />
  <path d="M24 10 29.5 24 24 38 18.5 24 24 10Z" fill="#f4f3f1" />
  <circle cx="24" cy="24" r="1.6" fill="#0a0a0a" />
</svg>
`

// Icono maskable: mismo diseño pero SIN esquinas redondeadas — el SO
// recorta a su propia forma (círculo, squircle, etc), así que el fondo
// debe llegar hasta el borde sin su propio redondeo.
const maskableSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 48 48">
  <rect width="48" height="48" fill="#0a0a0a" />
  <circle cx="24" cy="24" r="16.5" stroke="#f4f3f1" stroke-width="1.4" fill="none" />
  <path d="M24 10 29.5 24 24 38 18.5 24 24 10Z" fill="#f4f3f1" />
  <circle cx="24" cy="24" r="1.6" fill="#0a0a0a" />
</svg>
`

const targets = [
  { name: 'pwa-192x192.png', svg: standardSvg, size: 192 },
  { name: 'pwa-512x512.png', svg: standardSvg, size: 512 },
  { name: 'apple-touch-icon.png', svg: standardSvg, size: 180 },
  { name: 'maskable-icon-512x512.png', svg: maskableSvg, size: 512 },
]

for (const t of targets) {
  await sharp(Buffer.from(t.svg)).resize(t.size, t.size).png().toFile(join(publicDir, t.name))
  console.log('wrote', t.name)
}
