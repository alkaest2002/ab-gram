/**
 * Validation for an archived sociogram snapshot.
 *
 * An archived file is the base64-encoded JSON of the sociogram store state
 * (see the "Archivia i dati" export in `StepGenerateReport`). Once decoded and
 * parsed, the payload is a plain object mirroring that state — a snapshot.
 *
 * The snapshot must look like:
 *
 *   {
 *     members: [
 *       { id, name, likes, dislikes, noLikes, noDislikes },
 *       ...
 *     ]
 *   }
 *
 * Checks are grouped into two ordered lists so new rules can be added without
 * touching the `validate` orchestration:
 *
 *   - SNAPSHOT_CHECKS: run once against the whole snapshot.
 *   - MEMBER_CHECKS: run against every member.
 *
 * Keep the public shape ({ valid, error, data }) stable — the import step
 * relies on it.
 */

/** Member ids are single characters drawn from A–Z and 0–9. */
const MEMBER_ID_PATTERN = /^[A-Z0-9]$/;

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isIdList(value) {
  return (
    Array.isArray(value) &&
    value.every((id) => typeof id === "string" && MEMBER_ID_PATTERN.test(id))
  );
}

/** Build the "rejected" result for a failing check. */
function invalid(error) {
  return { valid: false, error, data: null };
}

/**
 * @param {unknown} parsed
 * @returns {string | null} Error message, or null when the check passes.
 */
function SnapshotShouldBeAnObject(parsed) {
  return isPlainObject(parsed)
    ? null
    : "Il file non contiene un archivio sociogramma valido.";
}

/**
 * @param {unknown} parsed
 * @returns {string | null} Error message, or null when the check passes.
 */
function SnapshotShouldHaveMembers(parsed) {
  return Array.isArray(parsed.members)
    ? null
    : "L'archivio non contiene un elenco di membri.";
}

/**
 * @param {unknown} member
 * @returns {string | null} Error message, or null when the check passes.
 */
function MemberShouldBeAnObject(member) {
  return isPlainObject(member)
    ? null
    : "L'archivio contiene un membro non valido.";
}

/**
 * @param {object} member
 * @returns {string | null} Error message, or null when the check passes.
 */
function MemberShouldHaveAnId(member) {
  return typeof member.id === "string" && member.id.length > 0
    ? null
    : "Ogni membro deve avere un identificativo valido.";
}

/**
 * @param {object} member
 * @returns {string | null} Error message, or null when the check passes.
 */
function MemberShouldHaveAName(member) {
  return typeof member.name === "string"
    ? null
    : "Ogni membro deve avere un nome.";
}

/**
 * @param {object} member
 * @returns {string | null} Error message, or null when the check passes.
 */
function MemberShouldHaveValidLikes(member) {
  return isIdList(member.likes)
    ? null
    : "Le preferenze di un membro non sono valide.";
}

/**
 * @param {object} member
 * @returns {string | null} Error message, or null when the check passes.
 */
function MemberShouldHaveValidDislikes(member) {
  return isIdList(member.dislikes)
    ? null
    : "I rifiuti di un membro non sono validi.";
}

/**
 * @param {object} member
 * @returns {string | null} Error message, or null when the check passes.
 */
function MemberShouldHaveANoLikesFlag(member) {
  return typeof member.noLikes === "boolean"
    ? null
    : "Il flag \"nessuna preferenza\" di un membro non è valido.";
}

/**
 * @param {object} member
 * @returns {string | null} Error message, or null when the check passes.
 */
function MemberShouldHaveANoDislikesFlag(member) {
  return typeof member.noDislikes === "boolean"
    ? null
    : "Il flag \"nessun rifiuto\" di un membro non è valido.";
}

/**
 * @param {object} member
 * @returns {string | null} Error message, or null when the check passes.
 */
function LikesShouldNotBeEmptyUnlessNoLikes(member) {
  return member.likes.length > 0 || member.noLikes
    ? null
    : "Un membro deve indicare almeno una preferenza o dichiarare di non averne.";
}

/**
 * @param {object} member
 * @returns {string | null} Error message, or null when the check passes.
 */
function DislikesShouldNotBeEmptyUnlessNoDislikes(member) {
  return member.dislikes.length > 0 || member.noDislikes
    ? null
    : "Un membro deve indicare almeno un rifiuto o dichiarare di non averne.";
}

/**
 * @param {object} member
 * @returns {string | null} Error message, or null when the check passes.
 */
function MemberShouldNotLikeSelf(member) {
  return member.likes.includes(member.id)
    ? "Un membro non può scegliere sé stesso."
    : null;
}

/**
 * @param {object} member
 * @returns {string | null} Error message, or null when the check passes.
 */
function MemberShouldNotDislikeSelf(member) {
  return member.dislikes.includes(member.id)
    ? "Un membro non può rifiutare sé stesso."
    : null;
}

// Snapshot-level checks. Run in order; the first to return an error wins.
const SNAPSHOT_CHECKS = [SnapshotShouldBeAnObject, SnapshotShouldHaveMembers];

// Per-member checks. Run in order after `MemberShouldBeAnObject`; the field
// checks below rely on `member` already being a plain object.
const MEMBER_CHECKS = [
  MemberShouldBeAnObject,
  MemberShouldHaveAnId,
  MemberShouldHaveAName,
  MemberShouldHaveValidLikes,
  MemberShouldHaveValidDislikes,
  MemberShouldHaveANoLikesFlag,
  MemberShouldHaveANoDislikesFlag,
  LikesShouldNotBeEmptyUnlessNoLikes,
  DislikesShouldNotBeEmptyUnlessNoDislikes,
  MemberShouldNotLikeSelf,
  MemberShouldNotDislikeSelf,
];

export function useSociogramArchiveValidation() {
  /**
   * Validate a decoded, parsed snapshot.
   *
   * @param {unknown} parsed
   * @returns {{ valid: boolean, error: string | null, data: object | null }}
   */
  function validate(parsed) {
    for (const check of SNAPSHOT_CHECKS) {
      const error = check(parsed);
      if (error) return invalid(error);
    }

    for (const member of parsed.members) {
      for (const check of MEMBER_CHECKS) {
        const error = check(member);
        if (error) return invalid(error);
      }
    }

    return { valid: true, error: null, data: parsed };
  }

  return { validate };
}
