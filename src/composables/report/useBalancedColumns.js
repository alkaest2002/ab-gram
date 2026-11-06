// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { computed, toValue } from "vue";

/**
 * Split a list into two balanced columns for side-by-side layout.
 *
 * Safari does not honour CSS multi-column layout (`columns-2`) when printing and
 * collapses it to a single column, so the two halves are laid out with flexbox
 * instead. The first half takes the extra item on odd counts, matching balanced
 * column fill.
 *
 * @template T
 * @param {import('vue').MaybeRefOrGetter<T[]>} items
 * @returns {import('vue').ComputedRef<[T[], T[]]>}
 */
export function useBalancedColumns(items) {
  return computed(() => {
    const list = toValue(items) ?? [];
    const half = Math.ceil(list.length / 2);
    return [list.slice(0, half), list.slice(half)];
  });
}
