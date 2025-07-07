import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import { visualizer } from "rollup-plugin-visualizer";

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
});
