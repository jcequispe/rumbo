import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/rumbo/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Rumbo — tu agenda física',
        short_name: 'Rumbo',
        description: 'Diez minutos para soltar lo que tu cabeza no deja de cargar.',
        lang: 'es',
        theme_color: '#f2e9e4',
        background_color: '#f2e9e4',
        display: 'standalone',
        start_url: '/rumbo/',
        scope: '/rumbo/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // El video de mobile-hero pesa varios MB — no lo precacheamos
        // (Workbox tiene un límite por archivo), solo el shell de la app.
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        navigateFallbackDenylist: [/\/video\//],
      },
    }),
  ],
})
