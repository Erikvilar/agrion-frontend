import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as path from "path"

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {

    proxy: {
      '/v1/agrion/ws': {
        target: 'http://localhost:8081',
        ws: true,
      },
    }
  }
})