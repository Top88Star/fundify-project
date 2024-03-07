import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: "globalThis",
    "process.env": {},
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@tests": path.resolve(__dirname, "./tests")
    }
  },
  build: {
    rollupOptions: {
      external: [
        "vue/server-renderer", 
        "vue", 
        "@safe-globalThis/safe-ethers-adapters", 
        "@safe-globalThis/safe-core-sdk",
        "@safe-globalThis/safe-ethers-lib"
      ]
    }
  }
});