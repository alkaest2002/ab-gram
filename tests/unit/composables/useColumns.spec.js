// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { describe, expect, it } from "vite-plus/test";
import { ref } from "vue";
import { useColumns } from "@/composables/report/useColumns";

describe("useColumns", () => {
  it("balances two columns by default, with the extra item on the left", () => {
    expect(useColumns([]).value).toEqual([[], []]);
    expect(useColumns([1, 2, 3]).value).toEqual([[1, 2], [3]]);
  });

  it("applies reactive column sizes without losing items or empty columns", () => {
    const items = ref([1, 2, 3, 4]);
    const sizes = ref([1, 0, 2]);
    const columns = useColumns(items, sizes);
    expect(columns.value).toEqual([[1], [], [2, 3], [4]]);
    sizes.value = [3, 1];
    expect(columns.value).toEqual([[1, 2, 3], [4]]);
    items.value = [1, 2];
    expect(columns.value).toEqual([[1, 2], []]);
    sizes.value = [];
    expect(columns.value).toEqual([[1], [2]]);
  });

  it("rejects invalid column sizes", () => {
    expect(() => useColumns([1], [-1]).value).toThrow(RangeError);
  });
});
