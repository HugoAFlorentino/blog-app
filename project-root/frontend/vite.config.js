import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) {
              return 'vendor_react';
            }
            if (id.includes('redux') || id.includes('@reduxjs')) {
              return 'vendor_redux';
            }
            if (id.includes('framer-motion')) {
              return 'vendor_framer_motion';
            }
            return 'vendor_other';
          }
        },
      },
    },
  },
});
