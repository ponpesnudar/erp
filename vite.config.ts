import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';
import {compression} from 'vite-plugin-compression2';

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
              name: 'Absensi Satpam (HP)',
              short_name: 'Satpam',
              description: 'Absensi Mobile Keamanan & BK',
              url: '/?tab=bk',
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
          maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'],
          navigateFallbackDenylist: [/^\/api\//],
        },
        devOptions: {
          enabled: false,
        },
      }),
      compression({
        algorithms: ['gzip', 'brotliCompress'],
        threshold: 1024,
        exclude: [/\.(png|jpe?g|webp|ico|woff2?|mp4)$/i],
        deleteOriginalAssets: false,
      }),
    ],
    build: {
      sourcemap: false,
      minify: 'oxc',
      cssMinify: true,
      chunkSizeWarningLimit: 650,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('node_modules/three')) return 'vendor-three';
              if (id.includes('node_modules/pptxgenjs') || id.includes('node_modules/jszip')) return 'vendor-pptx';
              if (id.includes('node_modules/jspdf')) return 'vendor-pdf';
              if (id.includes('node_modules/html2canvas') || id.includes('node_modules/dompurify') || id.includes('node_modules/canvg')) return 'vendor-pdf-extras';
              if (id.includes('node_modules/xlsx') || id.includes('node_modules/codepage')) return 'vendor-xlsx';
              if (id.includes('node_modules/recharts') || id.includes('node_modules/d3-') || id.includes('node_modules/victory-vendor') || id.includes('node_modules/@reduxjs') || id.includes('node_modules/es-toolkit') || id.includes('node_modules/immer')) return 'vendor-charts';
              if (id.includes('node_modules/lucide-react')) return 'vendor-icons';
              if (id.includes('node_modules/@google/genai')) return 'vendor-genai';
              if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/zustand')) return 'vendor-react';
              return 'vendor-misc';
            }
            if (id.includes('/src/data/seed/')) return 'app-seed-data';
            if (id.includes('/src/lib/bahtsulMasailData')) return 'app-bahtsul-data';
            if (id.includes('/src/lib/store')) return 'app-store';
          },
        },
      },
    },
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

