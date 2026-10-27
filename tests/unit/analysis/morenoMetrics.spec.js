// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { describe, it, expect } from "vitest";
import * as np from "numpy-ts";

import {
  getGroupLevelMetrics,
  getIndividualLevelMetrics,
} from "@/analysis/moreno/metrics/morenoMetrics.js";
import { createAdjacencyMatrices } from "@/analysis/common/adjacencyMatrices.js";

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
    // none. With only one member receiving opinions there is no impact spread,
    // so b is appreciated (average impact, positive balance) rather than popular.
    expect(result.rawValuesById).toEqual([
      [0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0],
      [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 3, 35, 0],
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
