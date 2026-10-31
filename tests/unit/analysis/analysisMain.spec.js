// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { describe, it, expect, vi } from "vitest";

// The full pipeline renders SVG at the end. Stub the plotting step (which needs
// a browser DOM) so the rest of the analysis can be exercised end-to-end.
vi.mock("@/analysis/sna/plots/snaPlots.js", () => ({
  getSnaPlot: (graph, accentColor) => [
    {
      typeOfPreference: graph.getAttribute("typeOfPreference"),
      accentColor,
      svg: "<svg/>",
    },
  ],
}));

import { getSociogramAnalysis } from "@/analysis/analysisMain.js";
import { getHogwartsMembers } from "../../fixtures/hogwarts.js";

const makeMember = (id, likes = [], dislikes = []) => ({
  id,
  name: id,
  likes,
  dislikes,
});

describe("getSociogramAnalysis", () => {
  it("combines every analysis step over the Hogwarts roster", () => {
    const result = getSociogramAnalysis(getHogwartsMembers());

    expect(result).toHaveProperty("edgeTypes");
    expect(result).toHaveProperty("morenoGroupLevelMetrics");
    expect(result).toHaveProperty("morenoIndividualLevelMetrics");
    expect(result).toHaveProperty("morenoEgoGraphs");
    expect(result).toHaveProperty("snaLikesComponents");
    expect(result).toHaveProperty("snaLikesGroupLevelMetrics");
    expect(result).toHaveProperty("snaLikesIndividualLevelMetric");
    expect(result).toHaveProperty("snaLikesPlots");
    expect(result).toHaveProperty("snaDislikesComponents");
    expect(result).toHaveProperty("snaDislikesGroupLevelMetrics");
    expect(result).toHaveProperty("snaDislikesIndividualLevelMetric");
    expect(result).toHaveProperty("snaDislikesPlots");

    // Eleven members flow through every step, and the roster contains both likes
    // and dislikes, so both SNA pipelines are populated.
    expect(result.snaLikesGroupLevelMetrics.rawValuesById[0][0]).toBe(11);
    expect(result.snaDislikesGroupLevelMetrics.ids).toEqual(["dislikes"]);
    expect(result.snaLikesIndividualLevelMetric.ids).toEqual([
      "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K",
    ]);
    expect(result.snaDislikesIndividualLevelMetric.ids).toEqual([
      "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K",
    ]);
    expect(result.morenoEgoGraphs).toHaveLength(11);
    expect(result.snaLikesPlots).toHaveLength(1);
    expect(result.snaLikesPlots[0].typeOfPreference).toBe("likes");
    expect(result.snaLikesPlots[0].accentColor).toBe("#0000FF");
    expect(result.snaDislikesPlots).toHaveLength(1);
    expect(result.snaDislikesPlots[0].typeOfPreference).toBe("dislikes");
    expect(result.snaDislikesPlots[0].accentColor).toBe("#FF0000");
  });

  it("classifies the mutual like between the two members", () => {
    const members = [
      makeMember("a", ["b"]),
      makeMember("b", ["a"]),
    ];

    const { edgeTypes } = getSociogramAnalysis(members);

    expect(edgeTypes.typeI).toEqual(
      expect.arrayContaining([
        ["a", "b"],
        ["b", "a"],
      ]),
    );
  });

  it("computes Moreno group metrics for a mutual-like group", () => {
    const members = [
      makeMember("a", ["b"]),
      makeMember("b", ["a"]),
    ];

    const { morenoGroupLevelMetrics } = getSociogramAnalysis(members);

    expect(morenoGroupLevelMetrics.metrics).toEqual([
      "cohesion",
      "cohesionTypeII",
      "conflict",
      "conflictTypeII",
      "positiveReciprocity",
      "negativeReciprocity",
    ]);
    const [
      cohesion,
      cohesionTypeII,
      conflict,
      conflictTypeII,
      positiveReciprocity,
      negativeReciprocity,
    ] = morenoGroupLevelMetrics.rawValuesById[0];

    expect(cohesion).toBe(1);
    expect(cohesionTypeII).toBe(1);
    expect(conflict).toBe(0);
    expect(conflictTypeII).toBe(0);
    expect(positiveReciprocity).toBeCloseTo(0.5, 10);
    expect(negativeReciprocity).toBeNaN();
  });

  it("computes SNA group metrics for the likes graph", () => {
    const members = [
      makeMember("a", ["b"]),
      makeMember("b", ["a"]),
    ];

    const { snaLikesGroupLevelMetrics } = getSociogramAnalysis(members);

    expect(snaLikesGroupLevelMetrics.ids).toEqual(["likes"]);
    expect(snaLikesGroupLevelMetrics.rawValuesById[0]).toEqual([2, 2, 2, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0]);
  });

  it("skips the dislikes SNA step when nobody dislikes anyone", () => {
    const members = [
      makeMember("a", ["b"]),
      makeMember("b", ["a"]),
    ];

    const {
      snaDislikesGroupLevelMetrics,
      snaDislikesComponents,
      snaDislikesIndividualLevelMetric,
      snaDislikesPlots,
    } = getSociogramAnalysis(members);

    expect(snaDislikesGroupLevelMetrics).toEqual({});
    expect(snaDislikesComponents).toEqual({});
    expect(snaDislikesIndividualLevelMetric).toEqual({});
    expect(snaDislikesPlots).toEqual([]);
  });

  it("computes dislikes SNA metrics, components and plots when dislikes exist", () => {
    const members = [
      makeMember("a", [], ["b"]),
      makeMember("b", [], ["a"]),
    ];

    const {
      snaLikesGroupLevelMetrics,
      snaDislikesGroupLevelMetrics,
      snaDislikesComponents,
      snaDislikesIndividualLevelMetric,
      snaDislikesPlots,
    } = getSociogramAnalysis(members);

    // The likes graph is empty, so only the node count is populated.
    expect(snaLikesGroupLevelMetrics.rawValuesById[0]).toEqual([2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    expect(snaDislikesGroupLevelMetrics.ids).toEqual(["dislikes"]);
    expect(snaDislikesGroupLevelMetrics.rawValuesById[0]).toEqual([2, 2, 2, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0]);

    expect(snaDislikesComponents.dyads).toEqual([["a", "b"]]);
    expect(snaDislikesComponents.cliques).toEqual([]);
    expect(snaDislikesComponents.strongComponentsWithReciprocalEdges).toEqual([]);
    expect(snaDislikesComponents.strongComponents).toEqual([]);
    expect(snaDislikesComponents.weakComponents).toEqual([]);
    expect(snaDislikesComponents.louvainCommunities.communities).toEqual([]);
    expect(snaDislikesComponents.louvainCommunities.q).toBeCloseTo(0, 10);
    expect(snaDislikesIndividualLevelMetric.ids).toEqual(["a", "b"]);
    expect(snaDislikesPlots).toHaveLength(1);
    expect(snaDislikesPlots[0].typeOfPreference).toBe("dislikes");
    expect(snaDislikesPlots[0].accentColor).toBe("#FF0000");
  });

  it("produces a likes plot with the blue accent color", () => {
    const members = [
      makeMember("a", ["b"]),
      makeMember("b", ["a"]),
    ];

    const { snaLikesPlots } = getSociogramAnalysis(members);

    expect(snaLikesPlots).toHaveLength(1);
    expect(snaLikesPlots[0].typeOfPreference).toBe("likes");
    expect(snaLikesPlots[0].accentColor).toBe("#0000FF");
  });

  it("always produces a likes plot, even when the likes graph is empty", () => {
    const members = [
      makeMember("a", [], ["b"]),
      makeMember("b", [], ["a"]),
    ];

    const { snaLikesPlots } = getSociogramAnalysis(members);

    expect(snaLikesPlots).toHaveLength(1);
    expect(snaLikesPlots[0].typeOfPreference).toBe("likes");
    expect(snaLikesPlots[0].accentColor).toBe("#0000FF");
  });
});
