import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import { VitePWA } from "vite-plugin-pwa";
import { visualizer } from "rollup-plugin-visualizer";
import fs from "fs";

const manifest = JSON.parse(fs.readFileSync("./public/manifest.json", "utf-8"));

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./setupTests.js"],
  },

  plugins: [
    react(),
    visualizer({
      filename: "dist/stats.html", // output file
      open: true, // open in browser automatically
      gzipSize: true,
      brotliSize: true,
    }),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      manifest,
    }),
  ],
});
