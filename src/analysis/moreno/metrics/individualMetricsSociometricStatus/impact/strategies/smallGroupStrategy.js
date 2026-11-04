// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import * as np from "numpy-ts";

import { NO_SPLIT } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/constants.js";
import { finalizeSplit } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/sociometricStatusHelpers.js";

// Strategy parameters.
const MAX_MEMBERS = 4;
const MIN_GAP = 2; // A candidate gap must be at least this many received opinions.

// Dominance of the candidate gap relative to its competition.
const RUNNER_UP_FACTOR = 1.5; // Largest gap must be >= this × the runner-up gap.
const SPREAD_FACTOR = 0.5; // ...or >= this fraction of the group's spread.
/**
 * Small-group strategy: for groups of 2..MIN_MEMBERS-1 visible
 * members, find the largest gap between consecutive sorted impacts and flag
 * only the smaller side of that gap as the outlier tail. The bulk stays
 * average-impact so its balance can still decide status.
 *
 * @param {{ visibleSortedImpacts: number[], visibleGroupSize: number }} context - Sorted visible impacts and their count.
 * @returns {{ low: number, high: number }} Proposed cutoffs, or NO_SPLIT.
 */
export const smallGroupStrategy = ({ visibleSortedImpacts, visibleGroupSize }) => {
    // ========================================================================
    // VOTE ELIGIBILITY — abstain vote under this/these condition(s).
    // ========================================================================
    if (visibleGroupSize > MAX_MEMBERS) return NO_SPLIT;

    // Need at least two values to have a gap.
    if (visibleGroupSize < 2) return NO_SPLIT;

    // Convert to NumPy array for efficient gap calculations.
    const npValues = np.array(visibleSortedImpacts);

    // Gaps between consecutive sorted values: gaps[i] = values[i+1] - values[i].
    const gaps = npValues.diff();

    // Largest gap and where it sits (argmax returns the first occurrence,
    // matching the original strict ">" comparison).
    const split = gaps.argmax();
    const largestGap = gaps.get([split]);

    // All equal — nothing to separate.
    if (largestGap === 0) return NO_SPLIT;

    // Second-largest gap, for contrast. With sorted gaps, it's the 2nd from the
    // end (ties with the largest are preserved, same as excluding only `split`).
    const sortedGaps = gaps.sort();
    const secondGap = gaps.size > 1 ? sortedGaps.get([gaps.size - 2]) : 0;

    // The spread of values in the group.
    const spread = npValues.max() - npValues.min();

    // A candidate gap must be a real jump and dominate the field: at least
    // MIN_GAP received opinions, and either RUNNER_UP_FACTOR× the runner-up
    // gap or SPREAD_FACTOR of the group's spread.
    const isDominant =
        largestGap >= MIN_GAP &&
        (largestGap >= RUNNER_UP_FACTOR * secondGap ||
            largestGap >= SPREAD_FACTOR * spread);

    if (!isDominant) return NO_SPLIT;

    // ========================================================================
    // CLASSIFY + SEPARATION CHECK — flag only the smaller side of the gap; the
    // bulk stays average. Equal sides (n = 4, 2v2) is a genuine two-way split.
    // ========================================================================
    const leftCount = split + 1;
    const rightCount = visibleGroupSize - leftCount;

    // finalizeSplit still receives the original array, as before.
    if (leftCount < rightCount) {
        return finalizeSplit(visibleSortedImpacts, split, visibleSortedImpacts.length);
    }
    if (rightCount < leftCount) {
        return finalizeSplit(visibleSortedImpacts, -1, split + 1);
    }
    return finalizeSplit(visibleSortedImpacts, split, split + 1);
};
