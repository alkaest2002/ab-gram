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

// Route internal doc links through Vue Router so they don't trigger a full page
// reload. markdown-exit emits a plain `<a href>` by default; for links that point
// to an app route we emit `<RouterLink>` instead, which Vue's SFC compiler resolves
// to the globally-registered vue-router component. External links get the usual
// new-tab safety attributes; `#hash` and relative links are left as native anchors.
function routerLinks(md) {
  function isExternal(href) {
    return /^(?:https?:)?\/\//i.test(href) || /^(?:mailto:|tel:)/i.test(href);
  }

  function isInternal(href) {
    return href.startsWith("/") && !href.startsWith("//");
  }

  function findMatchingOpenLink(tokens, idx) {
    let depth = 0;
    for (let i = idx - 1; i >= 0; i -= 1) {
      const token = tokens[i];
      if (token.type === "link_close") depth += 1;
      else if (token.type === "link_open") {
        if (depth === 0) return token;
        depth -= 1;
      }
    }
    return null;
  }

  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const href = token.attrGet("href") ?? "";

    if (isInternal(href)) {
      token._routerLink = true;
      const attrs = [`to="${md.utils.escapeHtml(href)}"`];
      const title = token.attrGet("title");
      if (title) attrs.push(`title="${md.utils.escapeHtml(title)}"`);
      return `<RouterLink ${attrs.join(" ")}>`;
    }

    if (isExternal(href)) {
      token.attrSet("target", "_blank");
      token.attrSet("rel", "noopener noreferrer");
    }

    return self.renderToken(tokens, idx, options, env);
  };

  md.renderer.rules.link_close = (tokens, idx, options, env, self) => {
    const open = findMatchingOpenLink(tokens, idx);
    if (open?._routerLink) return "</RouterLink>";
    return self.renderToken(tokens, idx, options, env);
  };
}

export default defineConfig({
  // GitHub Pages serves the site from /<repo>/ (https://alkaest2002.github.io/ab-gram/),
  // so assets and router history must be rooted there, not at the domain root.
  base: "/ab-gram/",
  plugins: [
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
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
