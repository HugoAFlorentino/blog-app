import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      react: resolve(__dirname, 'node_modules/react'),
      'react-dom': resolve(__dirname, 'node_modules/react-dom'),
    },
  },
  build: {
    chunkSizeWarningLimit: 600, // Increase chunk size warning limit to 600 KB
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react-vendor';
            if (id.includes('@reduxjs')) return 'redux-vendor';
            if (id.includes('framer-motion')) return 'framer-motion';
            if (id.includes('react-router-dom')) return 'router-vendor';
            if (id.includes('react-icons')) return 'icons-vendor';
            if (id.includes('axios')) return 'axios-vendor';
            return 'vendor';
          }
        },
      },
    },
  },
});
