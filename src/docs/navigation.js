// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

/**
 * Documentation navigation, derived from the Markdown files in `./mds`.
 *
 * The folder structure IS the doc structure: each section is a folder under
 * `mds/`, and each page is a `.md` file inside one of those folders. Section
 * titles and their order come from `sectionOrder` below, not from the filesystem.
 * Page titles and ordering come from each file's frontmatter.
 */

/**
 * A documentation section declared by the application.
 * @typedef {object} SectionDefinition
 * @property {string} title - Display title used by documentation navigation.
 * @property {string} folder - Directory name below `mds`.
 */

/**
 * One Markdown page in the documentation navigation.
 * @typedef {object} NavItem
 * @property {string} title - Page title read from frontmatter.
 * @property {string} path - Absolute application route for the page.
 * @property {number} order - Sort position within the containing section.
 */

/**
 * A configured documentation section and its discovered pages.
 * @typedef {SectionDefinition & {items: NavItem[]}} NavSection
 */

/**
 * Authoritative section labels and ordering.
 *
 * Each `folder` must correspond to a directory below `mds`; directories not
 * listed here are excluded from navigation.
 *
 * @type {SectionDefinition[]}
 */
const sectionOrder = [
  { folder: "introduzione", title: "Introduzione" },
  { folder: "come-usare-l-app", title: "Come usare l'app" },
  { folder: "interpretare-il-report", title: "Interpretare il report" },
  { folder: "risoluzione-dei-problemi", title: "Risoluzione dei problemi" },
];

/**
 * Raw Markdown sources loaded eagerly for frontmatter extraction.
 *
 * Rendering uses a separate lazy glob in the documentation route module.
 *
 * @type {Record<string, string>}
 */
const pages = import.meta.glob("./mds/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

/**
 * Parse the first YAML-like frontmatter block from a Markdown source.
 *
 * This intentionally supports only the flat `key: value` fields used by the
 * docs. Values remain strings; consumers coerce fields such as `order`.
 *
 * @param {string} raw - Raw Markdown source.
 * @returns {Record<string, string>} Parsed fields, or an empty object when no block exists.
 */
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    let value = line
      .slice(colon + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    data[key] = value;
  }
  return data;
}

/**
 * Extract a section folder and page slug from a Markdown module path.
 *
 * @param {string} path - Path shaped as `./mds/<folder>/<file>.md`.
 * @returns {{folder: string, slug: string}} Parsed folder and extension-free slug.
 */
function splitPath(path) {
  const parts = path.split("/");
  return {
    folder: parts[parts.length - 2],
    slug: parts[parts.length - 1].replace(/\.md$/, ""),
  };
}

/**
 * Documentation sections with pages discovered from the Markdown glob.
 *
 * Pages are matched by configured folder and sorted by their numeric
 * frontmatter `order` value.
 *
 * @type {NavSection[]}
 */
const navigation = sectionOrder.map((section) => {
  const items = Object.entries(pages)
    .filter(([path]) => path.startsWith(`./mds/${section.folder}/`))
    .map(([path, raw]) => {
      const { slug } = splitPath(path);
      const { title, order } = parseFrontmatter(raw);
      return {
        title,
        order: Number(order),
        path: `/docs/${section.folder}/${slug}`,
      };
    })
    .sort((a, b) => a.order - b.order);

  return { ...section, items };
});

/**
 * All documentation pages in section/page order.
 *
 * Used by the previous/next pager and as the source of the default docs route.
 *
 * @type {NavItem[]}
 */
const flatOrdered = navigation.flatMap((section) => section.items);

export { navigation, flatOrdered };
