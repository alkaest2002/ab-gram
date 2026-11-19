// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { describe, it, expect } from "vite-plus/test";

import { createAdjacencyMatrices } from "@/analysis/common/adjacencyMatrices.js";
import {
  getGroupLevelMetrics as getMorenoGroupMetrics,
  getIndividualLevelMetrics as getMorenoIndividualMetrics,
} from "@/analysis/moreno/metrics/morenoMetrics.js";
import { createSnaNetwork } from "@/analysis/sna/snaBase.js";
import {
  getGroupLevelMetrics as getSnaGroupMetrics,
  getIndividualLevelMetrics as getSnaIndividualMetrics,
} from "@/analysis/sna/metrics/snaMetrics.js";

const makeMember = (id, likes, dislikes = []) => ({ id, name: id, likes, dislikes });
const columns = (result) =>
  Object.fromEntries(result.metrics.map((key, index) => [key, result.rawValuesByMetric[index]]));

// Chapters 05/06: preference lists follow the matrix rows from left to right.
const fourMembers = [
  makeMember("1", ["2", "3"], ["3"]),
  makeMember("2", ["1", "4"], ["1"]),
  makeMember("3", ["2", "4"], ["4"]),
  makeMember("4", ["1"], ["2"]),
];

const morenoIndividualMetrics = (members) => {
  const { adjLikes, adjDislikes } = createAdjacencyMatrices(members);
  return getMorenoIndividualMetrics(
    adjLikes,
    adjDislikes,
    members.map((member) => member.id),
    members,
  );
};

describe("report network examples: chapters 05/06", () => {
  it.each([
    ["likes", 7, 2, [1, 1.75, 2, 2, 2], 7 / 12, 1 / 9, 2 / 7, 1],
    ["dislikes", 4, 0, [1, 1, 1, 1, 1], 1 / 3, 0, 0, 0],
  ])(
    "reproduces %s group metrics and five-number summaries",
    (type, edges, mutual, summary, density, centralization, reciprocity, transitivity) => {
      const result = getSnaGroupMetrics(createSnaNetwork(fourMembers, type));
      const values = Object.fromEntries(
        result.metrics.map((key, index) => [key, result.rawValuesById[0][index]]),
      );

      expect(result.ids).toEqual([type]);
      expect(values.numberOfNodes).toBe(4);
      expect(values.numberOfEdges).toBe(edges);
      expect(values.numberOfMutualEdges).toBe(mutual);
      for (const direction of ["OutDegree", "InDegree"]) {
        expect(["min", "Q1", "median", "Q3", "max"].map((key) => values[key + direction])).toEqual(
          summary,
        );
        expect(values["IQR" + direction]).toBe(summary[3] - summary[1]);
      }
      expect(values.networkDensity).toBeCloseTo(density, 10);
      expect(values.networkCentralization).toBeCloseTo(centralization, 10);
      expect(values.networkReciprocity).toBeCloseTo(reciprocity, 10);
      expect(values.networkTransitivity).toBe(transitivity);
    },
  );

  it("reproduces cohesion, conflict and the distinct Moreno reciprocity indices", () => {
    const { adjLikes, adjDislikes } = createAdjacencyMatrices(fourMembers);
    const values = columns(getMorenoGroupMetrics(adjLikes, adjDislikes));

    expect(values.cohesion[0]).toBeCloseTo(1 / 6, 10);
    expect(values.cohesionTypeII[0]).toBeCloseTo(2 / 7, 10);
    expect(values.conflict).toEqual([0]);
    expect(values.conflictTypeII).toEqual([0]);
    expect(values.positiveReciprocity[0]).toBeCloseTo(1 / 7, 10);
    expect(values.negativeReciprocity).toEqual([0]);
  });

  it("reproduces every Moreno individual metric array", () => {
    const result = morenoIndividualMetrics(fourMembers);

    expect(result.ids).toEqual(["1", "2", "3", "4"]);
    expect(columns(result)).toEqual({
      rp: [2, 2, 1, 2],
      rr: [1, 1, 1, 1],
      gp: [2, 2, 2, 1],
      gr: [1, 1, 1, 1],
      mp: [1, 1, 0, 0],
      mr: [0, 0, 0, 0],
      im: [3, 3, 2, 3],
      bl: [1, 1, 0, 1],
      ei: [3, 3, 3, 2],
      or: [1, 1, 1, 0],
      ai: [2, 2, 1, 1],
      ii: [3, 3, 1, 2],
      ss: [7, 7, 7, 7],
      bns: [70, 70, 34, 68],
      mls: [35, 35, 35, 35],
    });
  });

  it("reproduces degree, incoming closeness and directed betweenness centralities", () => {
    const result = getSnaIndividualMetrics(createSnaNetwork(fourMembers, "likes"));

    expect(result.ids).toEqual(["1", "2", "3", "4"]);
    expect(columns(result)).toMatchObject({
      inDegreeCentrality: [2 / 3, 2 / 3, 1 / 3, 2 / 3],
      outDegreeCentrality: [2 / 3, 2 / 3, 2 / 3, 1 / 3],
      degreeCentrality: [4 / 3, 4 / 3, 1, 1],
      closenessCentrality: [3 / 4, 3 / 4, 3 / 5, 3 / 4],
      betweennessCentrality: [3 / 6, 1 / 6, 0.5 / 6, 0.5 / 6],
    });
  });

  it("reproduces PageRank and HITS to the documented three decimal places", () => {
    const values = columns(getSnaIndividualMetrics(createSnaNetwork(fourMembers, "likes")));
    const expected = {
      PageRank: [0.337, 0.258, 0.181, 0.224],
      hitsAuthority: [0.227, 0.305, 0.121, 0.347],
      hitsHub: [0.227, 0.305, 0.347, 0.121],
    };

    for (const [key, scores] of Object.entries(expected)) {
      expect(values[key]).toHaveLength(4);
      scores.forEach((score, index) => expect(values[key][index]).toBeCloseTo(score, 3));
      expect(values[key].reduce((sum, score) => sum + score, 0)).toBeCloseTo(1, 10);
    }
  });
});

describe("report network example: chapter 09", () => {
  it("reproduces received choices and betweenness for two reciprocal K4s joined through member 9", () => {
    const members = [
      makeMember("1", ["2", "3", "4"]),
      makeMember("2", ["1", "3", "4"]),
      makeMember("3", ["1", "2", "4"]),
      makeMember("4", ["1", "2", "3", "9"]),
      makeMember("5", ["6", "7", "8", "9"]),
      makeMember("6", ["5", "7", "8"]),
      makeMember("7", ["5", "6", "8"]),
      makeMember("8", ["5", "6", "7"]),
      makeMember("9", ["4", "5"]),
    ];
    const graph = createSnaNetwork(members, "likes");
    const moreno = morenoIndividualMetrics(members);
    const sna = getSnaIndividualMetrics(graph);

    expect(graph.order).toBe(9);
    expect(graph.size).toBe(28);
    expect(moreno.ids).toEqual(members.map((member) => member.id));
    expect(sna.ids).toEqual(moreno.ids);
    expect(columns(moreno).rp).toEqual([3, 3, 3, 4, 4, 3, 3, 3, 2]);
    const betweenness = columns(sna).betweennessCentrality;
    [0, 0, 0, 30 / 56, 30 / 56, 0, 0, 0, 32 / 56].forEach((score, index) =>
      expect(betweenness[index]).toBeCloseTo(score, 10),
    );
  });
});
