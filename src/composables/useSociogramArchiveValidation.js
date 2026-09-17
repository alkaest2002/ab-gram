/**
 * Validation for an archived sociogram snapshot.
 *
 * An archived file is the base64-encoded JSON of the sociogram store state
 * (see the "Archivia i dati" export in `StepGenerateReport`). Once decoded and
 * parsed, the payload is a plain object mirroring that state — a snapshot.
 *
 * NOTE: the checks below are intentionally a stub. The real rules for what a
 * valid snapshot looks like are still to be decided, so keep the public shape
 * ({ valid, error, data }) stable and fill in the logic later without touching
 * the caller.
 */

export function useSociogramArchiveValidation() {
  /**
   * Validate a decoded, parsed snapshot.
   *
   * @param {unknown} parsed
   * @returns {{ valid: boolean, error: string | null, data: object | null }}
   */
  function validate(parsed) {
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {
        valid: false,
        error: "Il file non contiene un archivio sociogramma valido.",
        data: null,
      };
    }

    if (!Array.isArray(parsed.members)) {
      return {
        valid: false,
        error: "L'archivio non contiene un elenco di membri.",
        data: null,
      };
    }

    // Stub: accept the snapshot as-is for now. Replace this with the real
    // per-member rules once the archive format is finalised.
    return { valid: true, error: null, data: parsed };
  }

  return { validate };
}
