import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    // Raise the warning threshold slightly (we'll still be well under after chunking)
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        manualChunks(id) {
          // ── Vendor: React core ──────────────────────────────────────────
          if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/react-router') ||
              id.includes('node_modules/scheduler/')) {
            return 'vendor-react';
          }

          // ── Vendor: Framer Motion (animation library) ───────────────────
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion';
          }

          // ── Vendor: Firebase ────────────────────────────────────────────
          if (id.includes('node_modules/firebase') ||
              id.includes('node_modules/@firebase')) {
            return 'vendor-firebase';
          }

          // ── Vendor: Supabase ────────────────────────────────────────────
          if (id.includes('node_modules/@supabase')) {
            return 'vendor-supabase';
          }

          // ── Vendor: canvas-confetti ─────────────────────────────────────
          if (id.includes('node_modules/canvas-confetti')) {
            return 'vendor-confetti';
          }

          // ── Vendor: html2canvas (heavy — only needed in export flow) ────
          if (id.includes('node_modules/html2canvas')) {
            return 'vendor-html2canvas';
          }

          // ── Vendor: lucide-react ────────────────────────────────────────
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-lucide';
          }

          // ── App Data: Template definitions (365 kB) ─────────────────────
          if (id.includes('src/data/templatesData')) {
            return 'data-templates';
          }

          // ── App Data: Music tracks (92 kB) ──────────────────────────────
          if (id.includes('src/data/musicTracksData')) {
            return 'data-music';
          }

          // ── App Data: Fonts + Languages (large, editor-only) ────────────
          if (id.includes('src/data/fontsData') ||
              id.includes('src/data/languagesData')) {
            return 'data-fonts';
          }

          // ── Editor components ────────────────────────────────────────────
          if (id.includes('src/components/editor/') ||
              id.includes('src/components/sharing/') ||
              id.includes('src/components/card-renderer/')) {
            return 'chunk-editor';
          }

          // ── Export engine + audio cutter ─────────────────────────────────
          if (id.includes('src/services/exportEngine') ||
              id.includes('src/services/audioCutterService')) {
            return 'chunk-export';
          }
        }
      }
    }
  }
})
