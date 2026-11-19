import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'assets/aistudio/preview__14__3b7f388f.webp'],
        manifest: {
          id: '/',
          name: 'ERP Pondok Pesantren NU Darussalam',
          short_name: 'ERP Darussalam',
          description: 'Sistem Informasi ERP Terpadu Pondok Pesantren NU Darussalam Karangdadap Pekalongan',
          theme_color: '#0B5D3B',
          background_color: '#F6F3EA',
          display: 'standalone',
          orientation: 'portrait-primary',
          start_url: '/',
          scope: '/',
          lang: 'id',
          categories: ['education', 'productivity'],
          icons: [
            {
              src: '/assets/aistudio/preview__14__3b7f388f.webp',
              sizes: '192x192',
              type: 'image/webp',
              purpose: 'any',
            },
            {
              src: '/assets/aistudio/preview__14__3b7f388f.webp',
              sizes: '512x512',
              type: 'image/webp',
              purpose: 'any',
            },
            {
              src: '/assets/aistudio/preview__14__3b7f388f.webp',
              sizes: '512x512',
              type: 'image/webp',
              purpose: 'maskable',
            },
          ],
          shortcuts: [
            {
              name: 'Imtihan',
              short_name: 'Imtihan',
              description: 'Modul Ujian & Soal Imtihan',
              url: '/?tab=imtihan',
              icons: [{ src: '/assets/aistudio/preview__14__3b7f388f.webp', sizes: '192x192' }],
            },
            {
              name: 'Transaksi Santri',
              short_name: 'Transaksi',
              description: 'Kartu Santri & Kantin POS',
              url: '/?tab=transaksi',
              icons: [{ src: '/assets/aistudio/preview__14__3b7f388f.webp', sizes: '192x192' }],
            },
            {
              name: 'Pendaftaran Santri',
              short_name: 'PSB',
              description: 'Penerimaan Santri Baru Online',
              url: '/?tab=psb',
              icons: [{ src: '/assets/aistudio/preview__14__3b7f388f.webp', sizes: '192x192' }],
            },
          ],
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 15 * 1024 * 1024,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'],
        },
        devOptions: {
          enabled: true,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

