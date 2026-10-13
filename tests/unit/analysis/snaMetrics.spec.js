import { describe, it, expect } from "vitest";

import { createLikesGraph } from "@/analysis/sna/snaBase.js";
import {
  getGroupLevelMetrics,
  getIndividualLevelMetrics,
} from "@/analysis/sna/metrics/snaMetrics.js";

const makeMember = (id, likes = []) => ({ id, name: id, likes, dislikes: [] });

const GROUP_COLUMNS = [
  "numberOfNodes",
  "numberOfEdges",
  "numberOfMutualEdges",
  "networkDensity",
  "networkCentralization",
  "networkReciprocity",
  "networkTransitivity",
];

const INDIVIDUAL_COLUMNS = [
  "inDegreeCentrality",
  "outDegreeCentrality",
  "degreeCentrality",
  "closenessCentrality",
  "betweennessCentrality",
  "PageRank",
  "hitsAuthority",
  "hitsHub",
];

describe("getGroupLevelMetrics", () => {
  it("computes every metric for a complete mutual triangle", () => {
    const graph = createLikesGraph(
      [
        makeMember("a", ["b", "c"]),
        makeMember("b", ["a", "c"]),
        makeMember("c", ["a", "b"]),
      ],
      "likes",
    );

    const result = getGroupLevelMetrics(graph);

    expect(result.rowIndex).toEqual(["likes"]);
    expect(result.columnIndex).toEqual(GROUP_COLUMNS);
    expect(result.rawValues[0]).toEqual([3, 6, 6, 1, 0, 1, 1]);
    // A single group row means every metric column ranks itself as 1.
    expect(result.rankedValues).toEqual([[1, 1, 1, 1, 1, 1, 1]]);
  });

  it("computes density and centralization for a star graph", () => {
    const graph = createLikesGraph(
      [
        makeMember("a", []),
        makeMember("b", ["a"]),
        makeMember("c", ["a"]),
        makeMember("d", ["a"]),
      ],
      "likes",
    );

    const result = getGroupLevelMetrics(graph);

    const values = result.rawValues[0];
    const byName = Object.fromEntries(
      GROUP_COLUMNS.map((key, i) => [key, values[i]]),
    );

    expect(byName.numberOfNodes).toBe(4);
    expect(byName.numberOfEdges).toBe(3);
    expect(byName.numberOfMutualEdges).toBe(0);
    expect(byName.networkDensity).toBeCloseTo(0.25, 10);
    expect(byName.networkCentralization).toBeCloseTo(1, 10);
    expect(byName.networkReciprocity).toBe(0);
    expect(byName.networkTransitivity).toBe(0);
  });

  it("handles a single-node graph without dividing by zero", () => {
    const graph = createLikesGraph([makeMember("a")], "likes");

    const result = getGroupLevelMetrics(graph);

    expect(result.rawValues[0]).toEqual([1, 0, 0, 0, 0, 0, 0]);
  });
});

describe("getIndividualLevelMetrics", () => {
  it("returns degree centralities for a star graph", () => {
    const graph = createLikesGraph(
      [
        makeMember("a", []),
        makeMember("b", ["a"]),
        makeMember("c", ["a"]),
        makeMember("d", ["a"]),
      ],
      "likes",
    );

    const result = getIndividualLevelMetrics(graph);

    expect(result.rowIndex).toEqual(["a", "b", "c", "d"]);
    expect(result.columnIndex).toEqual(INDIVIDUAL_COLUMNS);

    const column = (name) => INDIVIDUAL_COLUMNS.indexOf(name);
    const inDegree = column("inDegreeCentrality");
    const outDegree = column("outDegreeCentrality");
    const degree = column("degreeCentrality");

    // Central node a: in-degree 3, out-degree 0, degree 3 (order - 1 = 3).
    expect(result.rawValues[0][inDegree]).toBe(1);
    expect(result.rawValues[0][outDegree]).toBe(0);
    expect(result.rawValues[0][degree]).toBe(1);

    // Leaf nodes: in-degree 0, out-degree 1, degree 1.
    for (const row of result.rawValues.slice(1)) {
      expect(row[inDegree]).toBe(0);
      expect(row[outDegree]).toBeCloseTo(1 / 3, 10);
      expect(row[degree]).toBeCloseTo(1 / 3, 10);
    }

    // Ranks are column-wise: in-degree raw [1, 0, 0, 0] ranks to [2, 1, 1, 1].
    expect(result.rankedValues.map((row) => row[inDegree])).toEqual([2, 1, 1, 1]);
  });

  it("reports zero rows for a degenerate single-node graph", () => {
    const graph = createLikesGraph([makeMember("a")], "likes");

    const result = getIndividualLevelMetrics(graph);

    expect(result.rowIndex).toEqual(["a"]);
    expect(result.rawValues).toEqual([INDIVIDUAL_COLUMNS.map(() => 0)]);
  });

  it("produces PageRank scores that sum to one", () => {
    const graph = createLikesGraph(
      [
        makeMember("a", ["b", "c"]),
        makeMember("b", ["a", "c"]),
        makeMember("c", ["a", "b"]),
      ],
      "likes",
    );

    const result = getIndividualLevelMetrics(graph);
    const pageRankColumn = INDIVIDUAL_COLUMNS.indexOf("PageRank");

    const total = result.rawValues.reduce(
      (sum, row) => sum + row[pageRankColumn],
      0,
    );

    expect(total).toBeCloseTo(1, 6);
  });
});
