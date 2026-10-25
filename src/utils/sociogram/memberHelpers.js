import { MEMBERS_INDICES } from "@/utils/sociogram/sociogramValidationFunctions";

/**
 * Pure helpers for sociogram members, shared across the load-members step, the
 * preferences step, and the report's member pages.
 *
 * Kept free of component and store dependencies so the file-reader component,
 * the views, and the report can normalise names, build members, and derive
 * preference-based metrics without duplicating logic.
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
 * Order a list of names according to the requested mode.
 *
 * `"as-is"` returns the names in their current order, `"alphabetical"` sorts
 * them lexicographically, and `"shuffle"` randomizes them with a Fisher–Yates
 * shuffle. The input array is never mutated.
 *
 * @param {string[]} names
 * @param {"as-is" | "alphabetical" | "shuffle"} mode
 * @returns {string[]}
 */
export function orderNames(names, mode) {
  if (mode === "alphabetical") return [...names].sort();
  if (mode === "shuffle") return shuffleNames(names);
  return names;
}

/**
 * Return a new array with the names in random order (Fisher–Yates shuffle).
 *
 * @param {string[]} names
 * @returns {string[]}
 */
export function shuffleNames(names) {
  const result = [...names];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
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
 * Order member ids according to their position in the shared id sequence.
 *
 * The input array is never mutated. Ids that are not part of `MEMBERS_INDICES`
 * are pushed to the end while preserving their original relative order.
 *
 * @param {string[]} ids
 * @returns {string[]}
 */
export function orderMemberId(ids) {
  return [...ids].sort((a, b) => {
    const indexA = MEMBERS_INDICES.indexOf(a);
    const indexB = MEMBERS_INDICES.indexOf(b);
    return (
      (indexA === -1 ? MEMBERS_INDICES.length : indexA) -
      (indexB === -1 ? MEMBERS_INDICES.length : indexB)
    );
  });
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

/**
 * Weighted score for how early `memberId` is placed in other members' preference
 * lists. Used as the report's "bonus" (for `likes`) and "malus" (for `dislikes`):
 * a member chosen (or rejected) first weighs `maxMembersCount`, and each later
 * position weighs one less — the report's `M - p + 1` term with a 1-based
 * position `p`.
 *
 * @param {string} memberId - The member whose score is computed.
 * @param {Array<{ id: string, likes?: string[], dislikes?: string[] }>} members - All members.
 * @param {number} maxMembersCount - The maximum theoretical member count (`M`).
 * @param {"likes" | "dislikes"} field - Which preference list to score.
 * @returns {number} The weighted received-preference score.
 */
export function receivedPreferenceScore(memberId, members, maxMembersCount, field) {
  return members.reduce((total, member) => {
    if (member.id === memberId) return total;

    const preferences = member[field] ?? [];
    const index = preferences.indexOf(memberId);
    if (index === -1) return total;

    return total + (maxMembersCount - index);
  }, 0);
}
