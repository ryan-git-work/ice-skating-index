import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  ssr: {
    noExternal: true,
  },
  build: {
    ssr: true,
    outDir: path.resolve(__dirname, "dist", "ssr"),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "client", "src", "entry-ssr.tsx"),
    },
  },
});
