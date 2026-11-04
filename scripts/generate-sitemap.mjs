#!/usr/bin/env node
// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

/**
 * Regenerates `public/sitemap.xml` from the app's routes and the Markdown docs.
 *
 * Doc URLs are derived the same way `src/docs/navigation.js` does: the section
 * order below is authoritative, and each page's position inside a section comes
 * from its frontmatter `order`. `<lastmod>` is the file's last-modified date,
 * so newly added or edited pages are picked up automatically.
 *
 * Run with:
 *   pnpm generate:sitemap
 */

import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = "https://ab-gram.com";
const MDS_DIR = fileURLToPath(new URL("../src/docs/mds", import.meta.url));
const OUT = fileURLToPath(new URL("../public/sitemap.xml", import.meta.url));

// Non-doc routes, in sitemap order. `source` is the file whose mtime becomes
// `<lastmod>`; it is resolved relative to this script.
const staticRoutes = [
  {
    path: "/",
    changefreq: "weekly",
    priority: "1.0",
    source: "../src/components/views/home/Home.vue",
  },
  {
    path: "/sociogram",
    changefreq: "weekly",
    priority: "0.9",
    source: "../src/components/views/sociogram/Sociogram.vue",
  },
  {
    path: "/docs",
    changefreq: "weekly",
    priority: "0.8",
    source: "../src/components/views/docs/Docs.vue",
  },
];

const footerRoutes = [
  {
    path: "/about",
    changefreq: "monthly",
    priority: "0.5",
    source: "../src/components/views/About.vue",
  },
  {
    path: "/privacy",
    changefreq: "yearly",
    priority: "0.3",
    source: "../src/components/views/privacy/Privacy.vue",
  },
];

// Same authoritative section order as `src/docs/navigation.js`.
const sectionOrder = [
  "introduzione",
  "come-usare-l-app",
  "interpretare-il-report",
  "risoluzione-dei-problemi",
];

function listMarkdown(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listMarkdown(full);
    return entry.name.endsWith(".md") ? [full] : [];
  });
}

function lastModified(file) {
  const date = statSync(file).mtime;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function frontmatterOrder(file) {
  const raw = readFileSync(file, "utf8");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return 0;

  for (const line of match[1].split(/\r?\n/)) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    if (key === "order") return Number(line.slice(colon + 1).trim());
  }
  return 0;
}

function resolveSource(source) {
  return fileURLToPath(new URL(source, import.meta.url));
}

function staticEntries(routes) {
  return routes.map(({ path: route, changefreq, priority, source }) => ({
    path: route,
    changefreq,
    priority,
    lastmod: lastModified(resolveSource(source)),
  }));
}

function docEntries() {
  const files = listMarkdown(MDS_DIR);

  return sectionOrder.flatMap((folder) =>
    files
      .filter((file) => file.includes(`${path.sep}mds${path.sep}${folder}${path.sep}`))
      .map((file) => ({
        path: `/docs/${folder}/${path.basename(file, ".md")}`,
        order: frontmatterOrder(file),
        lastmod: lastModified(file),
      }))
      .sort((a, b) => a.order - b.order)
      .map(({ order: _order, ...entry }) => ({ ...entry, changefreq: "monthly", priority: "0.6" })),
  );
}

const entries = [...staticEntries(staticRoutes), ...docEntries(), ...staticEntries(footerRoutes)];

const urls = entries
  .map(
    (entry) =>
      `  <url>\n` +
      `    <loc>${SITE}${entry.path}</loc>\n` +
      `    <lastmod>${entry.lastmod}</lastmod>\n` +
      `    <changefreq>${entry.changefreq}</changefreq>\n` +
      `    <priority>${entry.priority}</priority>\n` +
      `  </url>`,
  )
  .join("\n");

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  `${urls}\n` +
  `</urlset>\n`;

writeFileSync(OUT, xml);
console.log(`Wrote ${entries.length} URLs to ${OUT}`);
