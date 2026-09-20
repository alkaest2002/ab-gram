import { MEMBERS_INDICES } from "@/utils/sociogram/sociogramValidationFunctions";

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
 * @returns {Array<{ id: string, name: string, likes: string[], dislikes: string[], noLikes: boolean, noDislikes: boolean }>}
 */
export function buildMembers(names) {
  return names.map((name, index) => ({
    id: MEMBERS_INDICES[index],
    name,
    likes: [],
    dislikes: [],
    noLikes: false,
    noDislikes: false,
  }));
}

/**
 * Count name issues across the loaded members.
 *
 * Names are trimmed once before counting, so both figures below compare the
 * same value. Empty (blank) names and duplicated non-empty names are reported
 * separately: a group may legitimately contain two members with the same name,
 * but that must be reviewed before advancing.
 *
 * @param {Array<{ name?: string }>} members
 * @returns {{ emptyNamesCount: number, duplicateNamesCount: number }}
 */
/**
 * Whether a member has completed both preference categories: each must be
 * resolved by selecting at least one entry or by declaring "no answer" for it.
 *
 * @param {{ likes?: string[], dislikes?: string[], noLikes?: boolean, noDislikes?: boolean } | null} member
 * @returns {boolean}
 */
export function isMemberComplete(member) {
  if (!member) return false;

  const hasLikes = (member.likes?.length ?? 0) > 0 || Boolean(member.noLikes);
  const hasDislikes =
    (member.dislikes?.length ?? 0) > 0 || Boolean(member.noDislikes);

  return hasLikes && hasDislikes;
}

export function getMembersNameIssues(members) {
  const names = members.map((member) => String(member?.name ?? "").trim());
  const nonEmptyNames = names.filter(Boolean);

  return {
    emptyNamesCount: names.filter((name) => name === "").length,
    duplicateNamesCount: nonEmptyNames.length - new Set(nonEmptyNames).size,
  };
}
