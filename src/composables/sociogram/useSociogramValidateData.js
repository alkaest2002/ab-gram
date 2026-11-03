// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import {
  SNAPSHOT_CHECKS,
  MEMBER_CHECKS,
  CROSS_MEMBER_CHECKS,
  COMPLETE_SNAPSHOT_CHECKS,
  COMPLETE_MEMBER_CHECKS,
} from "@/utils/sociogram/sociogramValidationFunctions";

/**
 * Validate a decoded, parsed sociogram archive snapshot for import.
 *
 * Thin composable over the rules in `archiveValidation`. The public shape
 * ({ isValid, errors, data }) stays stable — the import step relies on it.
 *
 * @param {boolean} [dataIsComplete=false] Apply the completeness rules on top
 *   of the default structural checks.
 */
export function useSociogramValidateData(dataIsComplete = false) {
  /**
   * Validate a decoded, parsed snapshot, collecting every error the rules can
   * report instead of stopping at the first failure.
   *
   * @param {unknown} parsed
   * @returns {{ isValid: boolean, errors: string[], data: object | null }}
   */
  function validate(parsed) {
    const errors = [];

    const snapshotChecks = dataIsComplete
      ? [...SNAPSHOT_CHECKS, ...COMPLETE_SNAPSHOT_CHECKS]
      : SNAPSHOT_CHECKS;
    const memberChecks = dataIsComplete
      ? [...MEMBER_CHECKS, ...COMPLETE_MEMBER_CHECKS]
      : MEMBER_CHECKS;

    // Snapshot checks are ordered and each assumes the previous one passed
    // (e.g. `MembersShouldNotExceedMaxCount` reads `parsed.members.length`),
    // so stop this chain at the first failure.
    for (const check of snapshotChecks) {
      const error = check(parsed);
      if (error) {
        errors.push(error);
        break;
      }
    }

    // Per-member checks only make sense once `members` is an array. They share
    // the same "assume previous check passed" dependency, so each member stops
    // at its first failure while we keep scanning the remaining members.
    if (Array.isArray(parsed?.members)) {
      for (const member of parsed.members) {
        for (const check of memberChecks) {
          const error = check(member);
          if (error) {
            errors.push(error);
            break;
          }
        }
      }
    }

    // Cross-member checks read `likes`/`dislikes`/`id` on every member, so they
    // are only safe once every member has passed the per-member checks.
    if (errors.length === 0) {
      for (const check of CROSS_MEMBER_CHECKS) {
        const error = check(parsed);
        if (error) {
          errors.push(error);
          break;
        }
      }
    }

    // Keep only the first occurrence of each message, preserving order.
    const uniqueErrors = [...new Set(errors)];
    const hasErrors = uniqueErrors.length > 0;
    return {
      isValid: !hasErrors,
      errors: uniqueErrors,
      data: hasErrors ? null : parsed,
    };
  }

  return { validate };
}
