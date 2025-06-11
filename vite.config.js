import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Asegúrate de que esta importación esté al principio

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})