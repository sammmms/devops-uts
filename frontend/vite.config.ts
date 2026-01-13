import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    // 🔥 THIS IS THE KEY
    conditions: ["browser", "module", "default"],
  },

  optimizeDeps: {
    include: ["axios", "@radix-ui/number", "@radix-ui/react-select"],
  },

  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
});
