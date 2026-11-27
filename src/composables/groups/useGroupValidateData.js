// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import {
  SNAPSHOT_CHECKS,
  MEMBER_CHECKS,
  CROSS_MEMBER_CHECKS,
  COMPLETE_SNAPSHOT_CHECKS,
  COMPLETE_MEMBER_CHECKS,
} from "@/utils/group/validationHelpers";

/**
 * Validate a decoded, parsed group archive snapshot for import.
 *
 * Returns the original snapshot as `data` on success, or `null` with distinct
 * error messages in discovery order on failure.
 *
 * @param {boolean} [dataIsComplete=false] Apply the completeness rules on top
 *   of the default structural checks.
 * @returns {{ validate: (parsed: unknown) => {
 *   isValid: boolean,
 *   errors: string[],
 *   data: object | null,
 * } }}
 */
export function useGroupValidateData(dataIsComplete = false) {
  /**
   * Report the first snapshot error and the first error for each member when
   * `members` is an array. Only if those checks pass, report the first
   * cross-member error.
   *
   * @param {unknown} parsed
   * @returns {{ isValid: boolean, errors: string[], data: object | null }}
   */
  function validate(parsed) {
    /** @type {string[]} */
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
