// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

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

/**
 * Structurally valid member stored in a sociogram snapshot.
 *
 * @typedef {object} SociogramMember
 * @property {string} id
 * @property {string} name
 * @property {string[]} likes
 * @property {string[]} dislikes
 * @property {boolean} noLikes
 * @property {boolean} noDislikes
 */

/** @typedef {{ members: SociogramMember[] }} SociogramSnapshot */
/** @typedef {string | null} ValidationResult */
/** @typedef {(value: any) => ValidationResult} ValidationCheck */

/** Shared id sequence used to label members in order of addition. @type {string[]} */
export const MEMBERS_INDICES = "ABCDEFGHIJKLMNOPQRSTUVWXYZ2468#@%$&".split("");

/** Pattern matching one valid member id from `MEMBERS_INDICES`. @type {RegExp} */
export const MEMBER_ID_PATTERN = /^[A-Z2468#@%$&]$/;

/** Minimum number of members required for a complete sociogram. @type {number} */
export const MIN_MEMBERS_COUNT = 8;

/** Maximum number of members (mirrors `maxMembersCount` in the store). @type {number} */
export const MAX_MEMBERS_COUNT = MEMBERS_INDICES.length;

/** Maximum permitted length of a member name. @type {number} */
export const MAX_NAME_LENGTH = 150;

/**
 * Test whether a value is a non-null object.
 *
 * Despite its historical name, this predicate also accepts arrays; callers
 * that require a specific collection shape perform that check separately.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function isPlainObject(value) {
  return Boolean(value) && typeof value === "object";
}

/**
 * Test whether a value is an array containing only valid member ids.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function isIdList(value) {
  return (
    Array.isArray(value) &&
    value.every((id) => typeof id === "string" && MEMBER_ID_PATTERN.test(id))
  );
}

/**
 * Collect the unique member ids referenced by one preference field.
 *
 * @param {SociogramMember[]} members
 * @param {"likes" | "dislikes"} field
 * @returns {Set<string>}
 */
export function collectReferencedIds(members, field) {
  const ids = new Set();
  for (const member of members) {
    for (const id of member[field]) {
      ids.add(id);
    }
  }
  return ids;
}

/**
 * Require the decoded snapshot root to be an object.
 *
 * @param {unknown} parsed
 * @returns {ValidationResult} Error message, or `null` when valid.
 */
export function SnapshotShouldBeAnObject(parsed) {
  return isPlainObject(parsed) ? null : "Il progetto contiene dati sociometrici non validi.";
}

/**
 * Require the snapshot to expose a members array.
 *
 * @param {any} parsed
 * @returns {ValidationResult} Error message, or `null` when valid.
 */
export function SnapshotShouldHaveMembers(parsed) {
  return Array.isArray(parsed.members)
    ? null
    : "Il progetto non contiene un elenco di nomi valido.";
}

/**
 * Reject snapshots containing more members than the supported id sequence.
 *
 * @param {SociogramSnapshot} parsed
 * @returns {ValidationResult} Error message, or `null` when valid.
 */
export function MembersShouldNotExceedMaxCount(parsed) {
  return parsed.members.length <= MAX_MEMBERS_COUNT
    ? null
    : `Il progetto non può contenere più di ${MAX_MEMBERS_COUNT} nomi.`;
}

/**
 * Complete-data rule: a finished sociogram needs at least `MIN_MEMBERS_COUNT`.
 *
 * @param {SociogramSnapshot} parsed
 * @returns {ValidationResult} Error message, or `null` when valid.
 */
export function MembersShouldHaveAtLeastMinCount(parsed) {
  return parsed.members.length >= MIN_MEMBERS_COUNT
    ? null
    : `Il progetto deve contenere almeno ${MIN_MEMBERS_COUNT} nomi.`;
}

/**
 * Require each member entry to be an object before field-level checks run.
 *
 * @param {unknown} member
 * @returns {ValidationResult} Error message, or `null` when valid.
 */
export function MemberShouldBeAnObject(member) {
  return isPlainObject(member) ? null : "I dati di un membro del gruppo non sono validi.";
}

/**
 * Require a member to have a non-empty string id.
 * @param {Partial<SociogramMember>} member
 * @returns {ValidationResult} Error message, or `null` when valid.
 */
export function MemberShouldHaveAnId(member) {
  return typeof member.id === "string" && member.id.length > 0
    ? null
    : "Ogni membro del gruppo deve possedere un identificativo valido.";
}

/**
 * Require a member name to be a string.
 * @param {Partial<SociogramMember>} member
 * @returns {ValidationResult} Error message, or `null` when valid.
 */
export function MemberShouldHaveAName(member) {
  return typeof member.name === "string" ? null : "Ogni membro del gruppo deve avere un nome.";
}

/**
 * Require a member name not to exceed `MAX_NAME_LENGTH`.
 * @param {SociogramMember} member
 * @returns {ValidationResult} Error message, or `null` when valid.
 */
export function MemberNameShouldNotExceedMaxLength(member) {
  return member.name.length <= MAX_NAME_LENGTH
    ? null
    : `I nomi dei membro del gruppo non devono superare ${MAX_NAME_LENGTH} caratteri.`;
}

/**
 * Reject a likes list longer than the maximum possible group size.
 * @param {Partial<SociogramMember>} member
 * @returns {ValidationResult} Error message, or `null` when valid.
 */
export function LikesShouldNotExceedMemberCount(member) {
  const exceeds = Array.isArray(member.likes) && member.likes.length > MAX_MEMBERS_COUNT;
  return exceeds ? "Un membro del gruppo ha espresso troppe scelte." : null;
}

/**
 * Reject a dislikes list longer than the maximum possible group size.
 * @param {Partial<SociogramMember>} member
 * @returns {ValidationResult} Error message, or `null` when valid.
 */
export function DislikesShouldNotExceedMemberCount(member) {
  const exceeds = Array.isArray(member.dislikes) && member.dislikes.length > MAX_MEMBERS_COUNT;
  return exceeds ? "Un membro del gruppo ha espresso troppi rifiuti." : null;
}

/**
 * Require `likes` to contain only syntactically valid member ids.
 * @param {Partial<SociogramMember>} member
 * @returns {ValidationResult} Error message, or `null` when valid.
 */
export function MemberShouldHaveValidLikes(member) {
  return isIdList(member.likes)
    ? null
    : "Le scelte di un membro del gruppo contengono identificativi non validi.";
}

/**
 * Require `dislikes` to contain only syntactically valid member ids.
 * @param {Partial<SociogramMember>} member
 * @returns {ValidationResult} Error message, or `null` when valid.
 */
export function MemberShouldHaveValidDislikes(member) {
  return isIdList(member.dislikes)
    ? null
    : "I rifiuti di un membro del gruppo contengono identificativi non validi.";
}

/**
 * Require the no-likes declaration to be boolean.
 * @param {Partial<SociogramMember>} member
 * @returns {ValidationResult} Error message, or `null` when valid.
 */
export function MemberShouldHaveANoLikesFlag(member) {
  return typeof member.noLikes === "boolean"
    ? null
    : 'La spunta "nessuna scelta" di un membro del gruppo non è valida.';
}

/**
 * Require the no-dislikes declaration to be boolean.
 * @param {Partial<SociogramMember>} member
 * @returns {ValidationResult} Error message, or `null` when valid.
 */
export function MemberShouldHaveANoDislikesFlag(member) {
  return typeof member.noDislikes === "boolean"
    ? null
    : 'La spunta "nessun rifiuto" di un membro del gruppo non è valida.';
}

/**
 * Reject a member whose likes list references their own id.
 * @param {SociogramMember} member
 * @returns {ValidationResult} Error message, or `null` when valid.
 */
export function MemberShouldNotLikeSelf(member) {
  return member.likes.includes(member.id)
    ? "I membri del gruppo non possono scegliere sé stessi."
    : null;
}

/**
 * Reject a member whose dislikes list references their own id.
 * @param {SociogramMember} member
 * @returns {ValidationResult} Error message, or `null` when valid.
 */
export function MemberShouldNotDislikeSelf(member) {
  return member.dislikes.includes(member.id)
    ? "I membri del gruppo non possono rifiutare sé stessi."
    : null;
}

/**
 * Complete-data rule: a member must record at least one like, unless they
 * declared they have none via the `noLikes` flag.
 *
 * @param {SociogramMember} member
 * @returns {ValidationResult} Error message, or `null` when valid.
 */
export function MemberShouldHaveLikesUnlessNoLikes(member) {
  return member.noLikes || member.likes.length > 0
    ? null
    : "I membri del gruppo devono avere almeno una preferenza oppure deve avere la spunta 'non ha espresso scelte'.";
}

/**
 * Complete-data rule: a member must record at least one dislike, unless they
 * declared they have none via the `noDislikes` flag.
 *
 * @param {SociogramMember} member
 * @returns {ValidationResult} Error message, or `null` when valid.
 */
export function MemberShouldHaveDislikesUnlessNoDislikes(member) {
  return member.noDislikes || member.dislikes.length > 0
    ? null
    : "I membri del gruppo devono avere almeno un rifiuto oppure deve avere la spunta 'non ha espresso rifiuti'.";
}

/**
 * Require every member id in the snapshot to be unique.
 * @param {SociogramSnapshot} parsed
 * @returns {ValidationResult} Error message, or `null` when valid.
 */
export function MemberIdsShouldBeUnique(parsed) {
  const ids = parsed.members.map((member) => member.id);
  return new Set(ids).size === ids.length
    ? null
    : "Gli identificativi dei membri del gruppo devono essere univoci.";
}

/**
 * Require every liked id to reference a member in the same snapshot.
 * @param {SociogramSnapshot} parsed
 * @returns {ValidationResult} Error message, or `null` when valid.
 */
export function LikesShouldReferenceExistingMembers(parsed) {
  const memberIds = new Set(parsed.members.map((member) => member.id));
  const likedIds = collectReferencedIds(parsed.members, "likes");

  for (const id of likedIds) {
    if (!memberIds.has(id)) {
      return "Tra le scelte espresse, almeno una fa riferimento a un soggetto inesistente.";
    }
  }

  return null;
}

/**
 * Require every disliked id to reference a member in the same snapshot.
 * @param {SociogramSnapshot} parsed
 * @returns {ValidationResult} Error message, or `null` when valid.
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

/** Snapshot-level checks, evaluated in order until one fails. @type {ValidationCheck[]} */
export const SNAPSHOT_CHECKS = [
  SnapshotShouldBeAnObject,
  SnapshotShouldHaveMembers,
  MembersShouldNotExceedMaxCount,
];

/**
 * Per-member structural checks, evaluated in order.
 *
 * Field checks rely on `MemberShouldBeAnObject` succeeding first.
 * @type {ValidationCheck[]}
 */
export const MEMBER_CHECKS = [
  MemberShouldBeAnObject,
  MemberShouldHaveAnId,
  MemberShouldHaveAName,
  MemberNameShouldNotExceedMaxLength,
  MemberShouldHaveValidLikes,
  MemberShouldHaveValidDislikes,
  MemberShouldHaveANoLikesFlag,
  MemberShouldHaveANoDislikesFlag,
  LikesShouldNotExceedMemberCount,
  DislikesShouldNotExceedMemberCount,
  MemberShouldNotLikeSelf,
  MemberShouldNotDislikeSelf,
];

/**
 * Snapshot checks that compare structurally valid members with one another.
 * @type {ValidationCheck[]}
 */
export const CROSS_MEMBER_CHECKS = [
  MemberIdsShouldBeUnique,
  LikesShouldReferenceExistingMembers,
  DislikesShouldReferenceExistingMembers,
];

/**
 * Additional snapshot checks for imports declared to be complete sociograms.
 * @type {ValidationCheck[]}
 */
export const COMPLETE_SNAPSHOT_CHECKS = [MembersShouldHaveAtLeastMinCount];

/** Additional per-member checks for complete sociograms. @type {ValidationCheck[]} */
export const COMPLETE_MEMBER_CHECKS = [
  MemberShouldHaveLikesUnlessNoLikes,
  MemberShouldHaveDislikesUnlessNoDislikes,
];
