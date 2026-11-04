// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

/**
 * Slugify a heading's text into a URL-friendly id.
 *
 * Lowercases, trims, strips punctuation, and collapses runs of whitespace to
 * single dashes.
 *
 * @param {string} text - The heading text.
 * @returns {string} The slug used as the heading's `id`.
 */
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Register a markdown-it core rule that adds an `id` to every heading, so
 * `#hash` links (and the docs table of contents) resolve. Duplicate ids are
 * disambiguated with a numeric suffix.
 *
 * @param {any} md - The markdown-it instance.
 * @returns {void}
 */
export function headingAnchor(md) {
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

/**
 * Register markdown-it renderer rules that route internal doc links through
 * Vue Router.
 *
 * markdown-it emits a plain `<a href>` by default. Links that point to an app
 * route become `<RouterLink>` (which Vue's SFC compiler resolves to the
 * globally-registered vue-router component). External links get new-tab safety
 * attributes; `#hash` and relative links stay native anchors.
 *
 * @param {any} md - The markdown-it instance.
 * @returns {void}
 */
export function routerLinks(md) {
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
