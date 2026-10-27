// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import {
  SNAPSHOT_CHECKS,
  MEMBER_CHECKS,
  CROSS_MEMBER_CHECKS,
  COMPLETE_SNAPSHOT_CHECKS,
  COMPLETE_MEMBER_CHECKS,
  invalid,
} from "@/utils/sociogram/sociogramValidationFunctions";

/**
 * Validate a decoded, parsed sociogram archive snapshot for import.
 *
 * Thin composable over the rules in `archiveValidation`. The public shape
 * ({ valid, error, data }) stays stable — the import step relies on it.
 *
 * @param {boolean} [dataIsComplete=false] Apply the completeness rules on top
 *   of the default structural checks.
 */
export function useSociogramValidateData(dataIsComplete = false) {
  /**
   * Validate a decoded, parsed snapshot.
   *
   * @param {unknown} parsed
   * @returns {{ valid: boolean, error: string | null, data: object | null }}
   */
  function validate(parsed) {
    const snapshotChecks = dataIsComplete
      ? [...SNAPSHOT_CHECKS, ...COMPLETE_SNAPSHOT_CHECKS]
      : SNAPSHOT_CHECKS;
    const memberChecks = dataIsComplete
      ? [...MEMBER_CHECKS, ...COMPLETE_MEMBER_CHECKS]
      : MEMBER_CHECKS;

    for (const check of snapshotChecks) {
      const error = check(parsed);
      if (error) return invalid(error);
    }

    for (const member of parsed.members) {
      for (const check of memberChecks) {
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
