import { describe, it, expect } from "vitest";
import * as np from "numpy-ts";

import {
  getGroupLevelMetrics,
  getIndividualLevelMetrics,
} from "@/analysis/morenoMetrics.js";

const GROUP_COLUMNS = [
  "cohesion",
  "conflict",
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

    expect(result.rowIndex).toEqual(["group"]);
    expect(result.columnIndex).toEqual(GROUP_COLUMNS);
    // cohesion = 1/3, conflict = 1/3, positiveReciprocity = 1/3, negativeReciprocity = 1/2.
    expect(result.values[0][0]).toBeCloseTo(1 / 3, 10);
    expect(result.values[0][1]).toBeCloseTo(1 / 3, 10);
    expect(result.values[0][2]).toBeCloseTo(1 / 3, 10);
    expect(result.values[0][3]).toBeCloseTo(0.5, 10);
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

    expect(result.values[0][0]).toBe(0);
    expect(result.values[0][1]).toBe(0);
    expect(result.values[0][2]).toBeNaN();
    expect(result.values[0][3]).toBeNaN();
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

    expect(result.rowIndex).toEqual(["a", "b", "c"]);
    expect(result.columnIndex).toEqual(INDIVIDUAL_COLUMNS);
    expect(result.values).toEqual([
      [2, 1, 1, 1, 1, 1, 3, 1, 2, 0, 1, 3, 8],
      [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 2, 2, 2],
      [0, 1, 1, 1, 0, 1, 1, -1, 2, 0, -1, 0, 2],
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
    expect(result.values[0][statusColumn]).toBe(0);
    expect(result.values[1][statusColumn]).toBe(0);
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
    // none (popular).
    expect(result.values).toEqual([
      [0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 4],
    ]);
  });
});
