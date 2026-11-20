// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { beforeAll, describe, expect, it } from "vite-plus/test";
import { createSSRApp } from "vue";
import { renderToString } from "vue/server-renderer";
import Privacy from "@/components/views/privacy/Privacy.vue";
import PrivacySidebar from "@/components/views/privacy/PrivacySidebar.vue";

const sectionIds = [
  "titolare",
  "dati-trattati",
  "base-giuridica",
  "servizi-terze-parti",
  "cloudflare",
  "discord",
  "stripe",
  "jsdelivr",
  "cookie",
  "conservazione",
  "diritti-interessato",
  "diritto-di-reclamo",
  "modifiche",
];

describe("Privacy", () => {
  let html;
  let sidebar;

  beforeAll(async () => {
    [html, sidebar] = await Promise.all([
      renderToString(createSSRApp(Privacy)),
      renderToString(createSSRApp(PrivacySidebar)),
    ]);
  });

  it("preserves policy anchors and keeps index wording in sync with headings", () => {
    const headings = Array.from(
      html.matchAll(/<h[23]\b[^>]*\bid="([^"]+)"[^>]*>([^<]+)<\/h[23]>/g),
      (match) => ({ id: match[1], label: match[2].trim() }),
    );

    expect(headings.map(({ id }) => id)).toEqual(sectionIds);
    for (const { label } of headings) {
      expect(sidebar).toContain(label);
    }

    const targets = Array.from(sidebar.matchAll(/href="#([^"]+)"/g), (match) => match[1]);
    expect(targets.length).toBeGreaterThan(0);
    for (const target of targets) {
      expect(headings.filter(({ id }) => id === target)).toHaveLength(1);
    }
  });

  it("links to the policies of all integrated external services", () => {
    for (const url of [
      "https://www.cloudflare.com/privacypolicy/",
      "https://discord.com/privacy",
      "https://stripe.com/it/privacy",
      "https://www.jsdelivr.com/terms/privacy-policy",
    ]) {
      expect(html).toContain(`href="${url}"`);
    }

    const externalLinks = Array.from(html.matchAll(/<a\b([^>]*href="https:\/\/[^>]*)>/g));
    for (const [, attributes] of externalLinks) {
      expect(attributes).toContain('target="_blank"');
      expect(attributes).toContain('rel="noopener noreferrer"');
    }
  });

  it("shows a machine-readable revision date and a privacy contact", () => {
    expect(html).toContain('<time datetime="2026-11-20">20 novembre 2026</time>');
    expect(html).toContain('href="mailto:info@ab-gram.com"');
  });
});
