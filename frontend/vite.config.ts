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
    conditions: ["browser", "module", "import", "default"],
  },

  optimizeDeps: {
    include: [
      "axios",
      "react",
      "react-dom",
      "react/jsx-runtime",

      "@radix-ui/react-checkbox",
      "@radix-ui/react-dialog",
      "@radix-ui/react-icons",
      "@radix-ui/react-label",
      "@radix-ui/react-select",

      "@tanstack/react-query",
      "@tanstack/react-router",
    ],
    exclude: ["axios/lib/helpers/formDataToStream"],
  },

  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "axios"],
          ui: [
            "@radix-ui/react-checkbox",
            "@radix-ui/react-dialog",
            "@radix-ui/react-label",
            "@radix-ui/react-select",
            "lucide-react",
            "motion/react",
            "sonner",
          ],
          tanstack: ["@tanstack/react-query", "@tanstack/react-router"],
        },
      },
    },
  },
});
