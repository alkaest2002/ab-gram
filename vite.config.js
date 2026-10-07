import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import tailwindcss from "@tailwindcss/vite";
import Markdown from "unplugin-vue-markdown/vite";

// Slug for heading ids: lowercase, spaces to dashes, punctuation dropped.
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Adds an `id` to every heading so `#hash` links (and the docs TOC) resolve.
function headingAnchor(md) {
  md.core.ruler.push("heading_anchor", (state) => {
    const counts = {};

    for (let i = 0; i < state.tokens.length; i++) {
      const token = state.tokens[i];
      if (token.type !== "heading_open") continue;

      const inline = state.tokens[i + 1];
      const text =
        inline && inline.type === "inline" && inline.children
          ? inline.children.map((child) => child.content || "").join("")
          : "";

      const base = slugify(text);
      counts[base] = (counts[base] || 0) + 1;
      token.attrSet("id", counts[base] > 1 ? `${base}-${counts[base]}` : base);
    }
  });
}

export default defineConfig({
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    vueDevTools(),
    tailwindcss(),
    Markdown({
      markdownSetup(md) {
        headingAnchor(md);
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
