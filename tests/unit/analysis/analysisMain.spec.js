import { describe, it, expect, vi } from "vitest";

// The full pipeline renders SVG at the end. Stub the plotting step (which needs
// a browser DOM) so the rest of the analysis can be exercised end-to-end.
vi.mock("@/analysis/snaPlots.js", () => ({
  getSnaPlots: (graphs) =>
    graphs.map(([graph, accentColor]) => ({
      typeOfPreference: graph.getAttribute("typeOfPreference"),
      accentColor,
      svg: "<svg/>",
    })),
}));

import { getSociogramAnalysis } from "@/analysis/analysisMain.js";

const makeMember = (id, likes = [], dislikes = []) => ({
  id,
  name: id,
  likes,
  dislikes,
});

describe("getSociogramAnalysis", () => {
  it("combines every analysis step into a single result", () => {
    const members = [
      makeMember("a", ["b"]),
      makeMember("b", ["a"]),
    ];

    const result = getSociogramAnalysis(members);

    expect(result).toHaveProperty("edgeTypes");
    expect(result).toHaveProperty("morenoGroupLevelMetrics");
    expect(result).toHaveProperty("morenoIndividualLevelMetrics");
    expect(result).toHaveProperty("snaLikesGroupLevelMetrics");
    expect(result).toHaveProperty("snaLikesComponents");
    expect(result).toHaveProperty("snaLikesIndividualLevelMetric");
    expect(result).toHaveProperty("snaDislikesGroupLevelMetrics");
    expect(result).toHaveProperty("snaDislikesComponents");
    expect(result).toHaveProperty("snaDislikesIndividualLevelMetric");
    expect(result).toHaveProperty("snaPlots");
  });

  it("classifies the mutual like between the two members", () => {
    const members = [
      makeMember("a", ["b"]),
      makeMember("b", ["a"]),
    ];

    const { edgeTypes } = getSociogramAnalysis(members);

    expect(edgeTypes.typeII).toEqual(
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

    expect(morenoGroupLevelMetrics.columnIndex).toEqual([
      "cohesion",
      "conflict",
      "positiveReciprocity",
      "negativeReciprocity",
    ]);
    const [cohesion, conflict, positiveReciprocity, negativeReciprocity] =
      morenoGroupLevelMetrics.values[0];

    expect(cohesion).toBe(1);
    expect(conflict).toBe(0);
    expect(positiveReciprocity).toBeCloseTo(0.5, 10);
    expect(negativeReciprocity).toBeNaN();
  });

  it("computes SNA group metrics for both preference graphs", () => {
    const members = [
      makeMember("a", ["b"]),
      makeMember("b", ["a"]),
    ];

    const { snaLikesGroupLevelMetrics, snaDislikesGroupLevelMetrics } =
      getSociogramAnalysis(members);

    expect(snaLikesGroupLevelMetrics.values[0]).toEqual([2, 2, 2, 1, 0, 1, 0]);
    expect(snaDislikesGroupLevelMetrics.values[0]).toEqual([2, 0, 0, 0, 0, 0, 0]);
  });

  it("produces a plot for each preference type", () => {
    const members = [
      makeMember("a", ["b"]),
      makeMember("b", ["a"]),
    ];

    const { snaPlots } = getSociogramAnalysis(members);

    expect(snaPlots.map((plot) => plot.typeOfPreference)).toEqual([
      "likes",
      "dislikes",
    ]);
    expect(snaPlots.map((plot) => plot.accentColor)).toEqual([
      "#0000FF",
      "#FF0000",
    ]);
  });
});
