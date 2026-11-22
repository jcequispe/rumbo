import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// La raíz solo redirige a /rumbo/conversion/. La app anterior registró un service
// worker en /rumbo/; este se desinstala solo y limpia su caché en quien ya lo tenía.
export default defineConfig({
  base: '/rumbo/',
  plugins: [VitePWA({ selfDestroying: true, manifest: false })],
})
