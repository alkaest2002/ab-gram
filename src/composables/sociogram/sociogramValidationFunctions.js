/**
 * Validation rules for an archived sociogram snapshot.
 *
 * An archived file is the base64-encoded JSON of the sociogram store state
 * (produced by `useSociogramDownloadArchive`). Once decoded and parsed, the payload is
 * a plain object mirroring that state — a snapshot:
 *
 *   {
 *     members: [
 *       { id, name, likes, dislikes, noLikes, noDislikes },
 *       ...
 *     ]
 *   }
 *
 * Checks are grouped into three ordered lists so new rules can be added without
 * touching the `validate` orchestration in `useSociogramValidateData`:
 *
 *   - SNAPSHOT_CHECKS: run once against the whole snapshot.
 *   - MEMBER_CHECKS: run against every member.
 *   - CROSS_MEMBER_CHECKS: run once after members are validated, for rules
 *     that compare members against each other.
 */

/** Shared id sequence used to label members in order of addition. */
export const MEMBERS_INDICES = "ABCDEFGHIJKLMNOPQRSTUVWXYZ2468#@%$&".split("");

/** Member ids are single characters drawn from A–Z and 0–9. */
export const MEMBER_ID_PATTERN = /^[A-Z0-9]$/;

/** Maximum number of members (mirrors `maxMembersCount` in the store). */
export const MAX_MEMBERS_COUNT = 35;

/** Minimum number of members required for a complete sociogram. */
export const MIN_MEMBERS_COUNT = 5;

export function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function isIdList(value) {
  return (
    Array.isArray(value) &&
    value.every((id) => typeof id === "string" && MEMBER_ID_PATTERN.test(id))
  );
}

/** Collect every id referenced by `field` (e.g. "likes") across the members. */
export function collectReferencedIds(members, field) {
  const ids = new Set();
  for (const member of members) {
    for (const id of member[field]) {
      ids.add(id);
    }
  }
  return ids;
}

/** Build the "rejected" result for a failing check. */
export function invalid(error) {
  return { valid: false, error, data: null };
}

/**
 * @param {unknown} parsed
 * @returns {string | null} Error message, or null when the check passes.
 */
export function SnapshotShouldBeAnObject(parsed) {
  return isPlainObject(parsed)
    ? null
    : "Il file non contiene un dati sociometrici validi.";
}

/**
 * @param {unknown} parsed
 * @returns {string | null} Error message, or null when the check passes.
 */
export function SnapshotShouldHaveMembers(parsed) {
  return Array.isArray(parsed.members)
    ? null
    : "L'archivio non contiene un elenco di nomi valido.";
}

/**
 * @param {object} parsed
 * @returns {string | null} Error message, or null when the check passes.
 */
export function MembersShouldNotExceedMaxCount(parsed) {
  return parsed.members.length <= MAX_MEMBERS_COUNT
    ? null
    : `L'archivio non può contenere più di ${MAX_MEMBERS_COUNT} nomi.`;
}

/**
 * Complete-data rule: a finished sociogram needs at least `MIN_MEMBERS_COUNT`.
 *
 * @param {object} parsed
 * @returns {string | null} Error message, or null when the check passes.
 */
export function MembersShouldHaveAtLeastMinCount(parsed) {
  return parsed.members.length >= MIN_MEMBERS_COUNT
    ? null
    : `L'archivio deve contenere almeno ${MIN_MEMBERS_COUNT} nomi.`;
}

/**
 * @param {unknown} member
 * @returns {string | null} Error message, or null when the check passes.
 */
export function MemberShouldBeAnObject(member) {
  return isPlainObject(member)
    ? null
    : "I dati di un membro del gruppo non sono validi.";
}

/**
 * @param {object} member
 * @returns {string | null} Error message, or null when the check passes.
 */
export function MemberShouldHaveAnId(member) {
  return typeof member.id === "string" && member.id.length > 0
    ? null
    : "Ogni membro del gruppo deve possedere un identificativo valido.";
}

/**
 * @param {object} member
 * @returns {string | null} Error message, or null when the check passes.
 */
export function MemberShouldHaveAName(member) {
  return typeof member.name === "string"
    ? null
    : "Ogni membro del gruppo deve avere un nome.";
}

/**
 * @param {object} member
 * @returns {string | null} Error message, or null when the check passes.
 */
export function LikesShouldNotExceedMemberCount(member) {
  const exceeds =
    Array.isArray(member.likes) && member.likes.length > MAX_MEMBERS_COUNT;
  return exceeds ? "Un membro del gruppo ha espresso troppe scelte." : null;
}

/**
 * @param {object} member
 * @returns {string | null} Error message, or null when the check passes.
 */
export function DislikesShouldNotExceedMemberCount(member) {
  const exceeds =
    Array.isArray(member.dislikes) &&
    member.dislikes.length > MAX_MEMBERS_COUNT;
  return exceeds ? "Un membro del gruppo ha espresso troppi rifiuti." : null;
}

/**
 * @param {object} member
 * @returns {string | null} Error message, or null when the check passes.
 */
export function MemberShouldHaveValidLikes(member) {
  return isIdList(member.likes)
    ? null
    : "Le scelte di un membro del gruppo non sono valide.";
}

/**
 * @param {object} member
 * @returns {string | null} Error message, or null when the check passes.
 */
export function MemberShouldHaveValidDislikes(member) {
  return isIdList(member.dislikes)
    ? null
    : "I rifiuti di un membro del gruppo non sono validi.";
}

/**
 * @param {object} member
 * @returns {string | null} Error message, or null when the check passes.
 */
export function MemberShouldHaveANoLikesFlag(member) {
  return typeof member.noLikes === "boolean"
    ? null
    : "Il flag \"nessuna scelta\" di un membro del gruppo non è valido.";
}

/**
 * @param {object} member
 * @returns {string | null} Error message, or null when the check passes.
 */
export function MemberShouldHaveANoDislikesFlag(member) {
  return typeof member.noDislikes === "boolean"
    ? null
    : "Il flag \"nessun rifiuto\" di un membro del gruppo non è valido.";
}

/**
 * @param {object} member
 * @returns {string | null} Error message, or null when the check passes.
 */
export function MemberShouldNotLikeSelf(member) {
  return member.likes.includes(member.id)
    ? "Un membro del gruppo non può scegliere sé stesso."
    : null;
}

/**
 * @param {object} member
 * @returns {string | null} Error message, or null when the check passes.
 */
export function MemberShouldNotDislikeSelf(member) {
  return member.dislikes.includes(member.id)
    ? "Un membro del gruppo non può rifiutare sé stesso."
    : null;
}

/**
 * Complete-data rule: a member must record at least one like, unless they
 * declared they have none via the `noLikes` flag.
 *
 * @param {object} member
 * @returns {string | null} Error message, or null when the check passes.
 */
export function MemberShouldHaveLikesUnlessNoLikes(member) {
  return member.noLikes || member.likes.length > 0
    ? null
    : "Un membro del gruppo deve avere almeno una preferenza.";
}

/**
 * Complete-data rule: a member must record at least one dislike, unless they
 * declared they have none via the `noDislikes` flag.
 *
 * @param {object} member
 * @returns {string | null} Error message, or null when the check passes.
 */
export function MemberShouldHaveDislikesUnlessNoDislikes(member) {
  return member.noDislikes || member.dislikes.length > 0
    ? null
    : "Un membro deve avere almeno un rifiuto.";
}

/**
 * @param {object} parsed
 * @returns {string | null} Error message, or null when the check passes.
 */
export function MemberIdsShouldBeUnique(parsed) {
  const ids = parsed.members.map((member) => member.id);
  return new Set(ids).size === ids.length
    ? null
    : "Gli identificativi dei membri del gruppo devono essere univoci.";
}

/**
 * @param {object} parsed
 * @returns {string | null} Error message, or null when the check passes.
 */
export function LikesShouldReferenceExistingMembers(parsed) {
  const memberIds = new Set(parsed.members.map((member) => member.id));
  const likedIds = collectReferencedIds(parsed.members, "likes");

  for (const id of likedIds) {
    if (!memberIds.has(id)) {
      return "Tra le scelte espresse, almeno uno fa riferimento a un soggetto inesistente.";
    }
  }

  return null;
}

/**
 * @param {object} parsed
 * @returns {string | null} Error message, or null when the check passes.
 */
export function DislikesShouldReferenceExistingMembers(parsed) {
  const memberIds = new Set(parsed.members.map((member) => member.id));
  const dislikedIds = collectReferencedIds(parsed.members, "dislikes");

  for (const id of dislikedIds) {
    if (!memberIds.has(id)) {
      return "Tra i rifiuti espressi, almeno uno fa riferimento a un soggetto inesistente.";
    }
  }

  return null;
}

// Snapshot-level checks. Run in order; the first to return an error wins.
export const SNAPSHOT_CHECKS = [
  SnapshotShouldBeAnObject,
  SnapshotShouldHaveMembers,
  MembersShouldNotExceedMaxCount,
];

// Per-member checks. Run in order after `MemberShouldBeAnObject`; the field
// checks below rely on `member` already being a plain object.
export const MEMBER_CHECKS = [
  MemberShouldBeAnObject,
  MemberShouldHaveAnId,
  MemberShouldHaveAName,
  MemberShouldHaveValidLikes,
  MemberShouldHaveValidDislikes,
  MemberShouldHaveANoLikesFlag,
  MemberShouldHaveANoDislikesFlag,
  LikesShouldNotExceedMemberCount,
  DislikesShouldNotExceedMemberCount,
  MemberShouldNotLikeSelf,
  MemberShouldNotDislikeSelf,
];

// Cross-member checks. Run once after every member has passed MEMBER_CHECKS;
// they assume each member is structurally valid.
export const CROSS_MEMBER_CHECKS = [
  MemberIdsShouldBeUnique,
  LikesShouldReferenceExistingMembers,
  DislikesShouldReferenceExistingMembers,
];

// Complete-data checks. Applied on top of the default checks only when the
// importer declares the snapshot is a finished sociogram (`dataIsComplete`).
export const COMPLETE_SNAPSHOT_CHECKS = [
  MembersShouldHaveAtLeastMinCount,
];

export const COMPLETE_MEMBER_CHECKS = [
  MemberShouldHaveLikesUnlessNoLikes,
  MemberShouldHaveDislikesUnlessNoDislikes,
];
