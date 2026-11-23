// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { computed, toValue } from "vue";

/**
 * Split items in reading order for side-by-side, print-safe layout.
 * Without sizes (or with an empty array), balance two columns, left one first.
 * Explicit sizes may leave empty columns; leftover items form one extra column.
 *
 * @template T
 * @param {import('vue').MaybeRefOrGetter<readonly T[]>} items
 * @param {import('vue').MaybeRefOrGetter<readonly number[]>} [columnSizes] Non-negative integers.
 * @returns {import('vue').ComputedRef<T[][]>}
 */
export function useColumns(items, columnSizes) {
  return computed(() => {
    const list = toValue(items) ?? [];
    const sizes = toValue(columnSizes);
    if (!sizes?.length) {
      const half = Math.ceil(list.length / 2);
      return [list.slice(0, half), list.slice(half)];
    }

    let offset = 0;
    const columns = sizes.map((size) => {
      if (!Number.isSafeInteger(size) || size < 0) {
        throw new RangeError("Column sizes must be non-negative integers.");
      }
      const column = list.slice(offset, offset + size);
      offset += column.length;
      return column;
    });
    if (offset < list.length) columns.push(list.slice(offset));
    return columns;
  });
}
