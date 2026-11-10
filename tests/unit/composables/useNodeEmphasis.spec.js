// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { describe, it, expect } from "vite-plus/test";
import { ref } from "vue";
import {
  applyEmphasisFilter,
  cloneEmphasis,
  setEmphasisMinInDegree,
  toggleEmphasizedNode,
  useNodeEmphasis,
} from "@/composables/report/useNodeEmphasis";

const NODES = [
  { id: "a", hasMutualEdge: true, inDegree: 2 },
  { id: "b", hasMutualEdge: true, inDegree: 1 },
  { id: "c", hasMutualEdge: false, inDegree: 0 },
  { id: "d", hasMutualEdge: false, inDegree: 3 },
];

const makeNodeInfo = () => ref(NODES);
const makeEmphasis = () => ({
  activeFilter: "all-on",
  minInDegree: 0,
  emphasizedNodes: new Set(["a", "b", "c", "d"]),
});

describe("useNodeEmphasis", () => {
  it("starts with all nodes emphasized", () => {
    const e = useNodeEmphasis(makeNodeInfo());
    expect(e.emphasis.emphasizedNodes).toEqual(new Set(["a", "b", "c", "d"]));
    expect(e.dimmedNodes.value.size).toBe(0);
  });

  it("setState replaces the emphasis state", () => {
    const e = useNodeEmphasis(makeNodeInfo());
    e.setState({ activeFilter: "custom", minInDegree: 1, emphasizedNodes: new Set(["a"]) });

    expect(e.emphasis.activeFilter).toBe("custom");
    expect(e.emphasis.minInDegree).toBe(1);
    expect(e.emphasis.emphasizedNodes).toEqual(new Set(["a"]));
    expect(e.dimmedNodes.value).toEqual(new Set(["b", "c", "d"]));
  });
});

describe("applyEmphasisFilter", () => {
  it("all-off dims every node", () => {
    const next = applyEmphasisFilter(NODES, makeEmphasis(), "all-off");
    expect(next.activeFilter).toBe("all-off");
    expect(next.emphasizedNodes.size).toBe(0);
  });

  it("all-on restores every node", () => {
    const next = applyEmphasisFilter(NODES, makeEmphasis(), "all-on");
    expect(next.emphasizedNodes).toEqual(new Set(["a", "b", "c", "d"]));
  });

  it("min-in-degree filters by threshold", () => {
    const emphasis = { ...makeEmphasis(), minInDegree: 1 };
    const next = applyEmphasisFilter(NODES, emphasis, "min-in-degree");
    // nodes with inDegree >= 1 qualify → a(2), b(1), d(3); c(0) does not
    expect(next.emphasizedNodes).toEqual(new Set(["a", "b", "d"]));
  });
});

describe("toggleEmphasizedNode", () => {
  it("switches to custom mode and toggles the node", () => {
    const next = toggleEmphasizedNode(makeEmphasis(), "a");
    expect(next.activeFilter).toBe("custom");
    expect(next.emphasizedNodes.has("a")).toBe(false);
    expect(next.emphasizedNodes.has("b")).toBe(true);
  });
});

describe("setEmphasisMinInDegree", () => {
  it("recomputes the emphasized set when the filter is active", () => {
    const emphasis = {
      activeFilter: "min-in-degree",
      minInDegree: 1,
      emphasizedNodes: new Set(["a", "b", "d"]),
    };
    const next = setEmphasisMinInDegree(NODES, emphasis, 3);
    expect(next.minInDegree).toBe(3);
    expect(next.emphasizedNodes).toEqual(new Set(["d"]));
  });

  it("leaves the emphasized set untouched for other filters", () => {
    const next = setEmphasisMinInDegree(NODES, makeEmphasis(), 2);
    expect(next.minInDegree).toBe(2);
    expect(next.emphasizedNodes).toEqual(new Set(["a", "b", "c", "d"]));
  });
});

describe("cloneEmphasis", () => {
  it("copies the emphasis state with a fresh emphasized set", () => {
    const source = makeEmphasis();
    const copy = cloneEmphasis(source);

    expect(copy).toEqual(source);
    expect(copy.emphasizedNodes).not.toBe(source.emphasizedNodes);
  });
});
