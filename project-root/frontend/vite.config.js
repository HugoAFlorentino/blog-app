import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
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
