import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['lucide-react']
  },
  resolve: {
    alias: [
      { find: /lucide-react\/dist\/esm\/icons\/fingerprint\.js$/, replacement: 'lucide-react/dist/esm/icons/lock.js' }
    ]
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
