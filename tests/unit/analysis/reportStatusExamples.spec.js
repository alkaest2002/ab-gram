// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { describe, expect, it } from "vite-plus/test";

import { createAdjacencyMatrices } from "@/analysis/common/adjacencyMatrices.js";
import { getIndividualLevelMetrics } from "@/analysis/moreno/metrics/morenoMetrics.js";

const zeros = [0, 0, 0, 0, 0, 0, 0];
const examples = [
  {
    field: "likes",
    nominations: [
      [2, 3, 4, 5, 6, 7],
      [1, 3, 4, 5, 6, 7],
      [1, 2, 4],
      [1, 2],
      [1, 2],
      [1, 2],
      [1, 2],
    ],
    expected: {
      rp: [6, 6, 2, 3, 2, 2, 2],
      rr: zeros,
      gp: [6, 6, 3, 2, 2, 2, 2],
      gr: zeros,
      ss: [4, 4, 2, 2, 2, 2, 2],
      bns: [210, 205, 68, 99, 64, 62, 60],
      mls: zeros,
    },
  },
  {
    field: "dislikes",
    nominations: [
      [4, 5, 2, 7],
      [4, 5, 3],
      [4, 5, 6],
      [5, 1],
      [4, 6],
      [4, 5],
      [4, 5],
    ],
    expected: {
      rp: zeros,
      rr: [1, 1, 1, 6, 6, 2, 1],
      gp: zeros,
      gr: [4, 3, 3, 2, 2, 2, 2],
      ss: [2, 2, 2, 6, 6, 2, 2],
      bns: zeros,
      mls: [34, 33, 33, 210, 205, 67, 32],
    },
  },
];

// Expected [low, high] cutoffs for the likes and dislikes examples, respectively.
const thresholds = [
  ["jenks", [2, 6], [1, 6]],
  ["largest gap", [-Infinity, Infinity], [-Infinity, Infinity]],
  ["head/tail", [-Infinity, 6], [-Infinity, 6]],
  ["inverted head/tail", [3, Infinity], [2, Infinity]],
  ["percentile", [-Infinity, Infinity], [-Infinity, Infinity]],
  ["tukey", [-Infinity, Infinity], [-Infinity, Infinity]],
  ["robust z-score", [-Infinity, 6], [-Infinity, 6]],
  ["binomial (GB)", [0, Infinity], [-Infinity, 6]],
  ["small group", [-Infinity, Infinity], [-Infinity, Infinity]],
];

describe.each(examples)(
  "chapter 07 seven-member $field example",
  ({ field, nominations, expected }) => {
    const members = nominations.map((list, index) => ({
      id: String(index + 1),
      likes: [],
      dislikes: [],
      [field]: list.map(String),
    }));
    const ids = members.map((member) => member.id);
    const { adjLikes, adjDislikes } = createAdjacencyMatrices(members);
    const result = getIndividualLevelMetrics(adjLikes, adjDislikes, ids, members);

    it("reproduces received/given counts, status codes and bonus/malus in member order", () => {
      expect(result.ids).toEqual(["1", "2", "3", "4", "5", "6", "7"]);
      for (const [metric, values] of Object.entries(expected)) {
        const column = result.metrics.indexOf(metric);
        expect(column, metric).toBeGreaterThanOrEqual(0);
        expect(
          result.rawValuesById.map((row) => row[column]),
          metric,
        ).toEqual(values);
      }
      expect(result.impactThresholds).toHaveLength(9);
    });

    it.each(thresholds)("reproduces the %s threshold pair", (strategy, likes, dislikes) => {
      const [low, high] = field === "likes" ? likes : dislikes;
      expect(result.impactThresholds.find((entry) => entry.strategy === strategy)).toEqual({
        strategy,
        thresholds: { low, high },
      });
    });
  },
);
