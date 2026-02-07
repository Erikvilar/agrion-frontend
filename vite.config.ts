import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as path from "path"
import {isProd} from "./src/api/api.config";
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window',
  },
  base: '/front/agrion',

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/v1/agrion/ws': {

        target: isProd ? "https://webdataflux.cloud" : "http://localhost:8081",
        ws: true,
      },
    }
  }
})