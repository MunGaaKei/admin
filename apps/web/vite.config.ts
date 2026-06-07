import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import vike from "vike/plugin";
import react from "@vitejs/plugin-react";
import pluginBabel from "@rolldown/plugin-babel";
import { lingui, linguiTransformerBabelPreset } from "@lingui/vite-plugin";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    pluginBabel({
      presets: [linguiTransformerBabelPreset()],
    }),
    lingui(),
    vike(),
  ],
  resolve: {
    alias: {
      "@web": resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
