// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { forEachMutualEdge } from "./base.js";

/**
 * Compute the asymmetric dyads: pairs of members with a one-way relationship.
 *
 * An asymmetric dyad is an unordered pair `[a, b]` such that exactly one of
 * `a → b` and `b → a` exists. `createSnaNetwork` marks every directed edge with
 * `isMutual` when its reverse edge exists, so each non-mutual, non-loop edge
 * represents exactly one asymmetric dyad.
 *
 * @param {import("graphology").DirectedGraph} graph - The likes graph built by
 *   `createSnaNetwork`.
 * @returns {{ structures: string[][] }} The dyads, each an `[a, b]` pair.
 */
export const computeAsymmetricDyads = (graph) => {
  const dyads = [];

  graph.forEachDirectedEdge((_edge, attributes, source, target) => {
    if (source !== target && !attributes.isMutual) {
      dyads.push([source, target]);
    }
  });

  return { structures: dyads };
};

/**
 * Compute the symmetric dyads: pairs of members with a bidirectional
 * relationship.
 *
 * A symmetric dyad is an unordered pair `[a, b]` such that both `a → b` and
 * `b → a` exist. `createSnaNetwork` flags every reciprocal edge with `isMutual`,
 * so a directed edge contributes a dyad when `isMutual` is set. Keeping only the
 * edge whose source sorts before its target guarantees each pair is emitted
 * exactly once, with a deterministic member order.
 *
 * @param {import("graphology").DirectedGraph} graph - The likes graph built by
 *   `createSnaNetwork`.
 * @returns {{ structures: string[][] }} The dyads, each an `[a, b]` pair.
 */
export const computeSymmetricDyads = (graph) => {
  const dyads = [];

  forEachMutualEdge(graph, (source, target) => {
    // Source must sort before target to emit each pair exactly once.
    if (source < target) {
      dyads.push([source, target]);
    }
  });

  return { structures: dyads };
};
