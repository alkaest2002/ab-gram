import { describe, it, expect } from "vitest";
import * as np from "numpy-ts";

import {
  getGroupLevelMetrics,
  getIndividualLevelMetrics,
} from "@/analysis/moreno/metrics/morenoMetrics.js";

const GROUP_COLUMNS = [
  "cohesion",
  "cohesionTypeII",
  "conflict",
  "conflictTypeII",
  "positiveReciprocity",
  "negativeReciprocity",
];

const INDIVIDUAL_COLUMNS = [
  "rp",
  "rr",
  "gp",
  "gr",
  "mp",
  "mr",
  "im",
  "bl",
  "ei",
  "or",
  "ai",
  "ii",
  "ss",
];

describe("getGroupLevelMetrics", () => {
  it("computes cohesion, conflict and reciprocity for a mixed group", () => {
    const adjLikes = np.array([
      [0, 1, 0],
      [1, 0, 0],
      [1, 0, 0],
    ]);
    const adjDislikes = np.array([
      [0, 0, 1],
      [0, 0, 0],
      [1, 0, 0],
    ]);

    const result = getGroupLevelMetrics(adjLikes, adjDislikes);

    expect(result.ids).toEqual(["group"]);
    expect(result.metrics).toEqual(GROUP_COLUMNS);
    // cohesion I = 1/3, cohesion II = 2/3, conflict I = 1/3, conflict II = 1,
    // positiveReciprocity = 1/3, negativeReciprocity = 1/2.
    expect(result.rawValuesById[0][0]).toBeCloseTo(1 / 3, 10);
    expect(result.rawValuesById[0][1]).toBeCloseTo(2 / 3, 10);
    expect(result.rawValuesById[0][2]).toBeCloseTo(1 / 3, 10);
    expect(result.rawValuesById[0][3]).toBeCloseTo(1, 10);
    expect(result.rawValuesById[0][4]).toBeCloseTo(1 / 3, 10);
    expect(result.rawValuesById[0][5]).toBeCloseTo(0.5, 10);
  });

  it("reports NaN reciprocity when there are no nominations", () => {
    const adjLikes = np.array([
      [0, 0],
      [0, 0],
    ]);
    const adjDislikes = np.array([
      [0, 0],
      [0, 0],
    ]);

    const result = getGroupLevelMetrics(adjLikes, adjDislikes);

    expect(result.rawValuesById[0][0]).toBe(0); // cohesion I
    expect(result.rawValuesById[0][1]).toBe(0); // cohesion II
    expect(result.rawValuesById[0][2]).toBe(0); // conflict I
    expect(result.rawValuesById[0][3]).toBe(0); // conflict II
    expect(result.rawValuesById[0][4]).toBeNaN(); // positiveReciprocity
    expect(result.rawValuesById[0][5]).toBeNaN(); // negativeReciprocity
  });
});

describe("getIndividualLevelMetrics", () => {
  it("computes every Moreno index for each member", () => {
    const adjLikes = np.array([
      [0, 1, 0],
      [1, 0, 0],
      [1, 0, 0],
    ]);
    const adjDislikes = np.array([
      [0, 0, 1],
      [0, 0, 0],
      [1, 0, 0],
    ]);

    const result = getIndividualLevelMetrics(adjLikes, adjDislikes, [
      "a",
      "b",
      "c",
    ]);

    expect(result.ids).toEqual(["a", "b", "c"]);
    expect(result.metrics).toEqual(INDIVIDUAL_COLUMNS);
    expect(result.rawValuesById).toEqual([
      [2, 1, 1, 1, 1, 1, 3, 1, 2, 0, 1, 3, 8],
      [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 2, 2, 2],
      [0, 1, 1, 1, 0, 1, 1, -1, 2, 0, -1, 0, 2],
    ]);
    // Ranks are column-wise, with the highest raw score ranked first (1).
    expect(result.rankedValuesById).toEqual([
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1],
      [2, 2, 1, 2, 1, 2, 2, 1, 2, 1, 1, 2, 2],
      [3, 1, 1, 1, 2, 1, 2, 2, 1, 2, 3, 3, 2],
    ]);
  });

  it("classifies members with no opinions as isolated", () => {
    const adjLikes = np.array([
      [0, 0],
      [0, 0],
    ]);
    const adjDislikes = np.array([
      [0, 0],
      [0, 0],
    ]);

    const result = getIndividualLevelMetrics(adjLikes, adjDislikes, [
      "a",
      "b",
    ]);

    const statusColumn = INDIVIDUAL_COLUMNS.indexOf("ss");
    expect(result.rawValuesById[0][statusColumn]).toBe(0);
    expect(result.rawValuesById[1][statusColumn]).toBe(0);
  });

  it("classifies members who give but receive no opinions as ignored", () => {
    const adjLikes = np.array([
      [0, 1],
      [0, 0],
    ]);
    const adjDislikes = np.array([
      [0, 0],
      [0, 0],
    ]);

    const result = getIndividualLevelMetrics(adjLikes, adjDislikes, [
      "a",
      "b",
    ]);

    // a gives a like but receives none (ignored); b receives a like and gives
    // none. With only one member receiving opinions there is no impact spread,
    // so b is appreciated (average impact, positive balance) rather than popular.
    expect(result.rawValuesById).toEqual([
      [0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 3],
    ]);
  });
});
