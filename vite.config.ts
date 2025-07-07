import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import type { InlineConfig } from "vitest";
import type { UserConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

interface VitestConfigExport extends UserConfig {
  test: InlineConfig;
}

// https://vitejs.dev/config/
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
  ],
} as VitestConfigExport);
