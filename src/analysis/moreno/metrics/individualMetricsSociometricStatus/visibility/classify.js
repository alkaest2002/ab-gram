// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

// ============================================================================
// VISIBILITY CLASSIFICATION
// Visibility takes precedence over impact and balance when assigning status.
// ============================================================================

/**
 * Determine which members are isolated (no opinions received or given) or
 * ignored (no opinions received but some given).
 *
 * @param {import("numpy-ts").NDArray} impact - Opinions received (rp + rr).
 * @param {import("numpy-ts").NDArray} expressivity - Opinions given (gp + gr).
 * @returns {{ isolated: import("numpy-ts").NDArray, ignored: import("numpy-ts").NDArray }}
 */
export const classifyVisibility = (impact, expressivity) => {
    const hasNoOpinionsReceived = impact.equal(0);
    const hasNoOpinionsGiven = expressivity.equal(0);
    return {
        isolated: hasNoOpinionsReceived.logical_and(hasNoOpinionsGiven),
        ignored: hasNoOpinionsReceived.logical_and(
            hasNoOpinionsGiven.logical_not(),
        ),
    };
};
