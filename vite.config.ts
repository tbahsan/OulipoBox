import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: process.env.PAGES_BASE_PATH || '/',
  server: {
    host: '0.0.0.0',
    port: 5174,
    allowedHosts: process.env.DEV_ALLOW_ALL_HOSTS === 'true' ? true : undefined,
  },
  preview: {
    host: '0.0.0.0',
    port: 4174,
    allowedHosts: process.env.DEV_ALLOW_ALL_HOSTS === 'true' ? true : undefined,
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.svg', 'icons/*.png'],
      manifest: {
        name: 'OulipoBox — Constrained Writing Playground',
        short_name: 'OulipoBox',
        description: 'Constrained creative writing playground for lipograms, univocalics, and formal literary constraints.',
        theme_color: '#1e293b',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'any',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webmanifest,json}'],
        navigateFallback: 'index.html',
      },
    }),
  ],
});
