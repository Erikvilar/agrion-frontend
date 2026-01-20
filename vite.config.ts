import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as path from "path"
import {isProd} from "./src/api/api.config";
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
  //dominio
    proxy: {
      '/v1/agrion/ws': {
        target: isProd ? "https://back.stackpanel.com.br" : "https://localhost:8081",
        ws: true,
      },
    }
  }
})