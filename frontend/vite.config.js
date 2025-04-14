import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: process.env.NODE_ENV === 'development'
      ? {
          '/api': {
            target: 'http://localhost:5000', // Local backend
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '')
          }
        }
      : {}
  }
});
