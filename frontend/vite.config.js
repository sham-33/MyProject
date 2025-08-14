import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_APP_BACKEND_URL || 'http://localhost:3333',
        changeOrigin: true,
        secure: true,  // Set to true for HTTPS backends
      }
    }
  }
})
