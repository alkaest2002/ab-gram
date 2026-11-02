// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import {
    CONFIG,
    NO_SPLIT,
} from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/constants.js";

// Head/tail breaks (Jiang). It repeatedly splits the heavy-tailed "head"
// (values above the mean) off the bulk until the classical stop condition: the
// head is no longer a small minority (>= maxHeadShare of the current values),
// or there is nothing left to split. Each mean is a break; the breaks partition
// the data into classes, the first class being the lowest values and the last
// class the highest values.
const headTailBreaks = (sorted) => {
    const breaks = [];
    let current = sorted;
    while (current.length > 0) {
        const n = current.length;
        const mean = current.reduce((s, v) => s + v, 0) / n;
        const head = current.filter((v) => v > mean);
        if (head.length === 0) break; // no split possible (all values equal)
        breaks.push(mean);
        if (head.length / n >= CONFIG.headTail.maxHeadShare) break; // classical stop
        current = head;
    }
    return breaks;
};

export const headTailStrategy = ({ sorted }) => {
    // No split if there are not enough visible members
    if (sorted.length < CONFIG.minVisibleForTails) return NO_SPLIT;

    // Compute the breaks for the head/tail strategy
    const breaks = headTailBreaks(sorted);

    // No split if no breaks were found
    if (breaks.length === 0) return NO_SPLIT;

    // Low = upper bound of the first (lowest) class.
    let low = -Infinity;
    for (const v of sorted) {
        if (v <= breaks[0]) low = v;
        else break;
    }

    // High = lower bound of the last (highest) class.
    let high = Infinity;
    const lastBreak = breaks[breaks.length - 1];
    for (let i = sorted.length - 1; i >= 0; i -= 1) {
        if (sorted[i] > lastBreak) high = sorted[i];
        else break;
    }

    return { low, high };
};
