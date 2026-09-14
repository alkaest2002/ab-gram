/**
 * Sociogram member helpers shared by the "load members" step.
 *
 * Kept as pure functions so both the file-reader component and the view can
 * normalise and parse names without duplicating logic.
 */

/**
 * Convert raw text rows into a clean list of member names.
 *
 * Each row is trimmed and empty rows are dropped. Duplicates are preserved on
 * purpose: a group may legitimately contain two members with the same name.
 *
 * @param {Iterable<string>} rows
 * @returns {string[]}
 */
export function normalizeNames(rows) {
  const names = [];

  for (const row of rows) {
    const name = String(row ?? "").trim();
    if (name) names.push(name);
  }

  return names;
}

/**
 * Build parsed sociogram members from a list of names.
 *
 * Ids are position-based for now; preferences are not collected until a later
 * step, so there is nothing to preserve across rebuilds yet.
 *
 * @param {string[]} names
 * @returns {Array<{ id: string, name: string, likes: string[], dislikes: string[] }>}
 */
export function buildMembers(names) {
  return names.map((name, index) => ({
    id: `member-${index + 1}`,
    name,
    likes: [],
    dislikes: [],
  }));
}
