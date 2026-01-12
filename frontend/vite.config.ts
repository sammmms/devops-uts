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

  optimizeDeps: {
    include: [
      "axios",

      // 🔥 force Radix internals to be resolved
      "@radix-ui/react-checkbox",
      "@radix-ui/react-dialog",
      "@radix-ui/react-label",
      "@radix-ui/react-select",

      // 🔒 radix internal utilities (the real offenders)
      "@radix-ui/react-use-previous",
      "@radix-ui/react-use-layout-effect",
      "@radix-ui/react-compose-refs",
    ],
  },

  build: {
    rollupOptions: {
      external: [],
    },
  },
});
