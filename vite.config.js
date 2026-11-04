import { fileURLToPath, URL } from "node:url";

import { defineConfig, lazyPlugins } from "vite-plus";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import tailwindcss from "@tailwindcss/vite";
import Markdown from "unplugin-vue-markdown/vite";

import { headingAnchor, routerLinks } from "./src/utils/vite/markdown.js";

export default defineConfig(({ command }) => ({
  fmt: {},
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
  base: command === "serve" ? "/" : "/",
  plugins: lazyPlugins(() => [
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    vueDevTools(),
    tailwindcss(),
    Markdown({
      markdownSetup(md) {
        headingAnchor(md);
        routerLinks(md);
      },
    }),
  ]),
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
}));
