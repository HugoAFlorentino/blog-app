import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // temporarily comment out the custom chunk splitting
  /*
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
  */
});
