import {
  SNAPSHOT_CHECKS,
  MEMBER_CHECKS,
  CROSS_MEMBER_CHECKS,
  invalid,
} from "@/composables/sociogram/archiveValidationFunctions";

/**
 * Validate a decoded, parsed sociogram archive snapshot for import.
 *
 * Thin composable over the rules in `archiveValidation`. The public shape
 * ({ valid, error, data }) stays stable — the import step relies on it.
 */
export function useSociogramValidateArchiveImport() {
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

    for (const check of CROSS_MEMBER_CHECKS) {
      const error = check(parsed);
      if (error) return invalid(error);
    }

    return { valid: true, error: null, data: parsed };
  }

  return { validate };
}
