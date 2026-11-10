// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { describe, it, expect } from "vite-plus/test";
import { ref } from "vue";
import { useNodeEmphasis } from "@/composables/report/useNodeEmphasis";

describe("useNodeEmphasis", () => {
  const makeNodeInfo = () =>
    ref([
      { id: "a", hasMutualEdge: true, inDegree: 2 },
      { id: "b", hasMutualEdge: true, inDegree: 1 },
      { id: "c", hasMutualEdge: false, inDegree: 0 },
      { id: "d", hasMutualEdge: false, inDegree: 3 },
    ]);

  it("starts with all nodes emphasized", () => {
    const e = useNodeEmphasis(makeNodeInfo());
    expect(e.emphasizedNodes.value).toEqual(new Set(["a", "b", "c", "d"]));
    expect(e.dimmedNodes.value.size).toBe(0);
  });

  it("all-off dims every node", () => {
    const e = useNodeEmphasis(makeNodeInfo());
    e.applyFilter("all-off");
    expect(e.emphasizedNodes.value.size).toBe(0);
    expect(e.dimmedNodes.value).toEqual(new Set(["a", "b", "c", "d"]));
  });

  it("all-on restores every node", () => {
    const e = useNodeEmphasis(makeNodeInfo());
    e.applyFilter("all-off");
    e.applyFilter("all-on");
    expect(e.emphasizedNodes.value).toEqual(new Set(["a", "b", "c", "d"]));
    expect(e.dimmedNodes.value.size).toBe(0);
  });

  it("toggleNode switches to custom mode", () => {
    const e = useNodeEmphasis(makeNodeInfo());
    e.toggleNode("a");
    expect(e.activeFilter.value).toBe("custom");
    expect(e.emphasizedNodes.value.has("a")).toBe(false);
  });

  it("min-in-degree filters by threshold", () => {
    const e = useNodeEmphasis(makeNodeInfo());
    e.minInDegree.value = 1;
    e.applyFilter("min-in-degree");
    // nodes with inDegree >= 1 qualify → a(2), b(1), d(3); c(0) does not
    expect(e.emphasizedNodes.value).toEqual(new Set(["a", "b", "d"]));
    expect(e.dimmedNodes.value).toEqual(new Set(["c"]));
  });

  it("snapshot/setState round-trips the emphasis state", () => {
    const source = useNodeEmphasis(makeNodeInfo());
    source.toggleNode("a");
    const snapshot = source.snapshot();

    const target = useNodeEmphasis(makeNodeInfo());
    target.setState(snapshot);

    expect(target.activeFilter.value).toBe(snapshot.activeFilter);
    expect(target.minInDegree.value).toBe(snapshot.minInDegree);
    expect(target.emphasizedNodes.value).toEqual(snapshot.emphasizedNodes);
  });
});
