/**
 * Documentation navigation, derived from the Markdown files in `./mds`.
 *
 * The folder structure IS the doc structure: each section is a folder under
 * `mds/`, and each page is a `.md` file inside one of those folders. Section
 * titles and their order come from `sectionOrder` below, not from the filesystem.
 * Page titles and ordering come from each file's frontmatter.
 */

// Section order is authoritative; the `folder` key maps to a directory in `mds/`.
const sectionOrder = [
  { folder: "getting-started", title: "Getting Started" },
  { folder: "guide", title: "Guide" },
  { folder: "api", title: "API Reference" },
];

/**
 * @typedef {Object} NavItem
 * @property {string} title        Page title, from frontmatter.
 * @property {string} path         Absolute route path, e.g. `/docs/guide/overview`.
 * @property {number} order        Sort order within its section, from frontmatter.
 * @property {string} description  Short description, from frontmatter.
 */

/**
 * @typedef {Object} NavSection
 * @property {string} title   Section title, from `sectionOrder`.
 * @property {string} folder  Folder name under `mds/`, e.g. `guide`.
 * @property {NavItem[]} items Pages in this section, sorted by `order`.
 */

// Eager glob of raw files: we only need frontmatter here, not the rendered page.
const pages = import.meta.glob("./mds/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

// Extracts the `---` frontmatter block and returns it as a plain object.
// Values are returned as strings; callers coerce `order` to a number.
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    let value = line.slice(colon + 1).trim().replace(/^["']|["']$/g, "");
    data[key] = value;
  }
  return data;
}

function splitPath(path) {
  // "./mds/<folder>/<file>.md" -> { folder, slug }
  const parts = path.split("/");
  return {
    folder: parts[parts.length - 2],
    slug: parts[parts.length - 1].replace(/\.md$/, ""),
  };
}

const navigation = sectionOrder.map((section) => {
  const items = Object.entries(pages)
    .filter(([path]) => path.startsWith(`./mds/${section.folder}/`))
    .map(([path, raw]) => {
      const { slug } = splitPath(path);
      const { title, order, description } = parseFrontmatter(raw);
      return {
        title,
        order: Number(order),
        description,
        path: `/docs/${section.folder}/${slug}`,
      };
    })
    .sort((a, b) => a.order - b.order);

  return { ...section, items };
});

// Flat, ordered list across all sections — used for the prev/next pager.
const flatOrdered = navigation.flatMap((section) => section.items);

export { navigation, flatOrdered };
