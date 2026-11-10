// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { describe, it, expect } from "vite-plus/test";
import { ref } from "vue";
import {
  cloneEmphasisFilter,
  resolveDimmedNodes,
  useNodeEmphasis,
} from "@/composables/report/useNodeEmphasis";

const NODES = [
  { id: "a", hasMutualEdge: true, inDegree: 2 },
  { id: "b", hasMutualEdge: true, inDegree: 1 },
  { id: "c", hasMutualEdge: false, inDegree: 0 },
  { id: "d", hasMutualEdge: false, inDegree: 3 },
];

const makeNodeInfo = () => ref(NODES);
const makeFilter = () => ({ typeOfFilter: "all-on", filterValue: null });

describe("useNodeEmphasis", () => {
  it("starts with every node emphasized", () => {
    const e = useNodeEmphasis(makeNodeInfo());
    expect(e.emphasis.typeOfFilter).toBe("all-on");
    expect(e.emphasis.filterValue).toBe(null);
    expect(e.dimmedNodes.value.size).toBe(0);
  });

  it("setState replaces the filter and derives the dimmed nodes", () => {
    const e = useNodeEmphasis(makeNodeInfo());
    e.setState({ typeOfFilter: "custom", filterValue: ["b", "c"] });

    expect(e.emphasis.typeOfFilter).toBe("custom");
    expect(e.emphasis.filterValue).toEqual(["b", "c"]);
    expect(e.dimmedNodes.value).toEqual(new Set(["b", "c"]));
  });
});

describe("resolveDimmedNodes", () => {
  it("all-on dims no nodes", () => {
    expect(resolveDimmedNodes(NODES, makeFilter())).toEqual(new Set());
  });

  it("all-off dims every node", () => {
    expect(resolveDimmedNodes(NODES, { typeOfFilter: "all-off", filterValue: null })).toEqual(
      new Set(["a", "b", "c", "d"]),
    );
  });

  it("minInDegree dims nodes below the threshold", () => {
    expect(resolveDimmedNodes(NODES, { typeOfFilter: "minInDegree", filterValue: 1 })).toEqual(
      new Set(["c"]),
    );
  });

  it("custom dims the explicitly listed nodes", () => {
    expect(resolveDimmedNodes(NODES, { typeOfFilter: "custom", filterValue: ["a", "d"] })).toEqual(
      new Set(["a", "d"]),
    );
  });
});

describe("cloneEmphasisFilter", () => {
  it("copies the filter with a fresh array for custom", () => {
    const source = { typeOfFilter: "custom", filterValue: ["a", "b"] };
    const copy = cloneEmphasisFilter(source);

    expect(copy).toEqual(source);
    expect(copy.filterValue).not.toBe(source.filterValue);
  });

  it("copies non-array filter values as-is", () => {
    expect(cloneEmphasisFilter({ typeOfFilter: "minInDegree", filterValue: 3 })).toEqual({
      typeOfFilter: "minInDegree",
      filterValue: 3,
    });
  });
});
