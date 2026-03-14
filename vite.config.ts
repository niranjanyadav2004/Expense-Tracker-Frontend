import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Make sure environment variables are available
    __MODE__: JSON.stringify(process.env.NODE_ENV || 'development')
  },
  server: {
    // Proxy API calls during development
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      }
    }
  },
  build: {
    // Production build optimizations
    minify: 'terser',
    sourcemap: false,
    outDir: 'dist',
    emptyOutDir: true,
  }
})
