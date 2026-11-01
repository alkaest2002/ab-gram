// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { describe, it, expect } from "vitest";
import * as np from "numpy-ts";

import {
  getGroupLevelMetrics,
  getIndividualLevelMetrics,
} from "@/analysis/moreno/metrics/morenoMetrics.js";
import { SOCIOMETRIC_STATUS } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus.js";
import { createAdjacencyMatrices } from "@/analysis/common/adjacencyMatrices.js";
import { getHogwartsMembers } from "../../fixtures/hogwarts.js";

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
  "bns",
  "mls",
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

    // Bonus/malus read the ordered preference lists, so the members must mirror
    // the adjacency matrices above: a -> [b], b -> [a], c -> [a] for likes and
    // a -> [c], c -> [a] for dislikes.
    const members = [
      { id: "a", likes: ["b"], dislikes: ["c"] },
      { id: "b", likes: ["a"], dislikes: [] },
      { id: "c", likes: ["a"], dislikes: ["a"] },
    ];

    const result = getIndividualLevelMetrics(adjLikes, adjDislikes, [
      "a",
      "b",
      "c",
    ], members);

    expect(result.ids).toEqual(["a", "b", "c"]);
    expect(result.metrics).toEqual(INDIVIDUAL_COLUMNS);
    // Sociometric status: percentile flags the two impact-1 members as low and
    // the impact-3 member as high, while gini flags only the top member; Tukey
    // and binomial abstain. The low/average tie on b and c resolves to low
    // (non-average beats average), so a is controversial (8), b marginal (2)
    // and c marginal (2).
    expect(result.rawValuesById).toEqual([
      [2, 1, 1, 1, 1, 1, 3, 1, 2, 0, 1, 3, 8, 70, 35],
      [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 2, 2, 2, 35, 0],
      [0, 1, 1, 1, 0, 1, 1, -1, 2, 0, -1, 0, 2, 0, 35],
    ]);
    // Ranks are column-wise, with the highest raw score ranked first (1).
    expect(result.rankedValuesById).toEqual([
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1],
      [2, 2, 1, 2, 1, 2, 2, 1, 2, 1, 1, 2, 2, 2, 2],
      [3, 1, 1, 1, 2, 1, 2, 2, 1, 2, 3, 3, 2, 3, 1],
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

    const members = [
      { id: "a", likes: [], dislikes: [] },
      { id: "b", likes: [], dislikes: [] },
    ];

    const result = getIndividualLevelMetrics(adjLikes, adjDislikes, [
      "a",
      "b",
    ], members);

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

    const members = [
      { id: "a", likes: ["b"], dislikes: [] },
      { id: "b", likes: [], dislikes: [] },
    ];

    const result = getIndividualLevelMetrics(adjLikes, adjDislikes, [
      "a",
      "b",
    ], members);

    // a gives a like but receives none (ignored); b receives a like and gives
    // none. With only one visible member there is no impact spread, so all four
    // strategies abstain and b is appreciated (average impact, positive balance)
    // rather than popular.
    expect(result.rawValuesById).toEqual([
      [0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0],
      [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 3, 35, 0],
    ]);
  });

  it("classifies the Hogwarts demo roster sensibly (status regression)", () => {
    // Regression for the impact-threshold majority vote. The sample-corrected
    // Gini (0.218) recognises the group's inequality (the population formula
    // read 0.198 < 0.2, flattening Harry into "appreciated"), and the vote of
    // the splitting strategies splits the group at (5, 8).
    const members = getHogwartsMembers();
    const { adjLikes, adjDislikes } = createAdjacencyMatrices(members);

    const result = getIndividualLevelMetrics(
      adjLikes,
      adjDislikes,
      members.map((member) => member.id),
      members,
    );

    const statusColumn = result.metrics.indexOf("ss");
    const statusByName = Object.fromEntries(
      members.map((member, i) => [
        member.name,
        result.rawValuesById[i][statusColumn],
      ]),
    );

    const S = SOCIOMETRIC_STATUS;
    expect(statusByName).toEqual({
      "Potter, Harry": S.POPULAR,
      "Granger, Hermione": S.POPULAR,
      "Weasley, Ron": S.APPRECIATED,
      "Longbottom, Neville": S.MARGINAL,
      "Lovegood, Luna": S.MARGINAL,
      "Malfoy, Draco": S.REJECTED,
      "Crabbe, Vincent": S.DISLIKED,
      "Goyle, Gregory": S.DISLIKED,
      "Diggory, Cedric": S.MARGINAL,
      "Weasley, Fred": S.MARGINAL,
      "Weasley, George": S.MARGINAL,
    });
  });

  it("classifies the likes-only example by the vote of the splitting strategies", () => {
    // Received likes [5, 5, 2, 3, 2, 2]: percentile and gini propose the same
    // (low <= 2, high >= 5) split, while Tukey and binomial abstain. The two
    // active strategies therefore decide: 5 -> high, 2 -> low, 3 -> average.
    const members = [
      { id: "1", likes: ["2", "3", "4", "5", "6"], dislikes: [] },
      { id: "2", likes: ["1", "3", "4", "5", "6"], dislikes: [] },
      { id: "3", likes: ["1", "2", "4"], dislikes: [] },
      { id: "4", likes: ["1", "2"], dislikes: [] },
      { id: "5", likes: ["1", "2"], dislikes: [] },
      { id: "6", likes: ["1", "2"], dislikes: [] },
    ];
    const { adjLikes, adjDislikes } = createAdjacencyMatrices(members);

    const result = getIndividualLevelMetrics(
      adjLikes,
      adjDislikes,
      members.map((member) => member.id),
      members,
    );

    const statusColumn = INDIVIDUAL_COLUMNS.indexOf("ss");
    expect(result.rawValuesById.map((row) => row[statusColumn])).toEqual([
      SOCIOMETRIC_STATUS.POPULAR,
      SOCIOMETRIC_STATUS.POPULAR,
      SOCIOMETRIC_STATUS.MARGINAL,
      SOCIOMETRIC_STATUS.APPRECIATED,
      SOCIOMETRIC_STATUS.MARGINAL,
      SOCIOMETRIC_STATUS.MARGINAL,
    ]);
  });

  it("lets the only splitting strategy decide when the others abstain", () => {
    // Received likes [1, 1, 2, 2, 2, 3]: percentile is the only strategy that
    // proposes a split, while gini, Tukey and binomial abstain. With a single
    // active strategy its classification is adopted, so 1 -> low and 2/3 ->
    // high.
    const members = [
      { id: "m0", likes: ["m5"], dislikes: [] },
      { id: "m1", likes: ["m5"], dislikes: [] },
      { id: "m2", likes: ["m4", "m5"], dislikes: [] },
      { id: "m3", likes: ["m2", "m4"], dislikes: [] },
      { id: "m4", likes: ["m2", "m3"], dislikes: [] },
      { id: "m5", likes: ["m0", "m1", "m3"], dislikes: [] },
    ];
    const { adjLikes, adjDislikes } = createAdjacencyMatrices(members);

    const result = getIndividualLevelMetrics(
      adjLikes,
      adjDislikes,
      members.map((member) => member.id),
      members,
    );

    const statusColumn = INDIVIDUAL_COLUMNS.indexOf("ss");
    expect(result.rawValuesById.map((row) => row[statusColumn])).toEqual([
      SOCIOMETRIC_STATUS.MARGINAL,
      SOCIOMETRIC_STATUS.MARGINAL,
      SOCIOMETRIC_STATUS.POPULAR,
      SOCIOMETRIC_STATUS.POPULAR,
      SOCIOMETRIC_STATUS.POPULAR,
      SOCIOMETRIC_STATUS.POPULAR,
    ]);
  });

  it("computes the order-weighted bonus from the documented example", () => {
    const members = [
      { id: "1", likes: ["2", "3", "4", "5", "6"], dislikes: [] },
      { id: "2", likes: ["1", "3", "4", "5", "6"], dislikes: [] },
      { id: "3", likes: ["1", "2", "4"], dislikes: [] },
      { id: "4", likes: ["1", "2"], dislikes: [] },
      { id: "5", likes: ["1", "2"], dislikes: [] },
      { id: "6", likes: ["1", "2"], dislikes: [] },
    ];
    const { adjLikes, adjDislikes } = createAdjacencyMatrices(members);

    const result = getIndividualLevelMetrics(
      adjLikes,
      adjDislikes,
      members.map((member) => member.id),
      members,
    );

    const bonusColumn = INDIVIDUAL_COLUMNS.indexOf("bns");
    const malusColumn = INDIVIDUAL_COLUMNS.indexOf("mls");

    expect(result.rawValuesById[0][bonusColumn]).toBe(175);
    expect(result.rawValuesById[1][bonusColumn]).toBe(171);
    expect(result.rawValuesById[3][bonusColumn]).toBe(99);
    expect(result.rawValuesById[0][malusColumn]).toBe(0);
  });

  it("computes the order-weighted malus from the documented example", () => {
    const members = [
      { id: "1", likes: [], dislikes: ["4", "5", "2"] },
      { id: "2", likes: [], dislikes: ["4", "5", "3"] },
      { id: "3", likes: [], dislikes: ["4", "5", "6"] },
      { id: "4", likes: [], dislikes: ["5", "1"] },
      { id: "5", likes: [], dislikes: ["4", "6"] },
      { id: "6", likes: [], dislikes: ["4", "5"] },
    ];
    const { adjLikes, adjDislikes } = createAdjacencyMatrices(members);

    const result = getIndividualLevelMetrics(
      adjLikes,
      adjDislikes,
      members.map((member) => member.id),
      members,
    );

    const bonusColumn = INDIVIDUAL_COLUMNS.indexOf("bns");
    const malusColumn = INDIVIDUAL_COLUMNS.indexOf("mls");

    expect(result.rawValuesById[3][malusColumn]).toBe(175);
    expect(result.rawValuesById[4][malusColumn]).toBe(171);
    expect(result.rawValuesById[5][malusColumn]).toBe(67);
    expect(result.rawValuesById[0][bonusColumn]).toBe(0);
  });
});
