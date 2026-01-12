import fs from "node:fs";
import gracefulFs from "graceful-fs";
gracefulFs.gracefulify(fs);

import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    viteReact(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  /**
   * 🔒 CI / Rollup stability
   * Prevents flaky "failed to resolve axios" in CI
   */
  optimizeDeps: {
    include: ["axios"],
  },

  build: {
    rollupOptions: {
      // explicitly keep deps bundled, not externalized
      external: [],
    },
  },
});
