import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 2000,
  },
  plugins: [tsconfigPaths(), react()],
  server: {
    port: "5173",
    host: "0.0.0.0",
    strictPort: false,
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.VITE_API_PORT || 5000}`,
        changeOrigin: true,
        secure: false,
        ws: false
      },
      '/api-docs': {
        target: `http://localhost:${process.env.VITE_API_PORT || 5000}`,
        changeOrigin: true,
        secure: false
      }
    }
  }
});