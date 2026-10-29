// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { forEachMutualEdge } from "./base.js";

/**
 * Compute the dyads: pairs of members with a bidirectional relationship.
 *
 * A dyad is an unordered pair `[a, b]` such that both `a → b` and `b → a`
 * exist. `createLikesGraph` flags every reciprocal edge with `isMutual`, so a
 * directed edge contributes a dyad when `isMutual` is set. Keeping only the
 * edge whose source sorts before its target guarantees each pair is emitted
 * exactly once, with a deterministic member order.
 *
 * @param {import("graphology").DirectedGraph} graph - The likes graph built by
 *   `createLikesGraph`.
 * @returns {string[][]} One `[a, b]` pair per reciprocal relationship.
 */
export const computeDyads = (graph) => {
  const dyads = [];

  forEachMutualEdge(graph, (source, target) => {
    // Source must sort before target to emit each pair exactly once.
    if (source < target) {
      dyads.push([source, target]);
    }
  });

  return dyads;
};
