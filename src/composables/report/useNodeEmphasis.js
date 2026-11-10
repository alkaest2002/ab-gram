// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { computed, reactive } from "vue";

/**
 * @typedef {"all-on"|"all-off"|"minInDegree"|"custom"} EmphasisFilter
 * @typedef {{ typeOfFilter: EmphasisFilter, filterValue: (number|null|string[]) }} EmphasisFilterState
 */

/**
 * Resolve the set of node ids to dim for a filter intent.
 *
 * - `"all-on"`: dim nothing.
 * - `"all-off"`: dim every node.
 * - `"minInDegree"`: dim nodes whose in-degree is below the threshold.
 * - `"custom"`: dim the explicitly listed nodes.
 *
 * @param {Array<{id: string, inDegree: number}>} nodeInfo
 * @param {EmphasisFilterState} filter
 * @returns {Set<string>}
 */
export function resolveDimmedNodes(nodeInfo, filter) {
  switch (filter.typeOfFilter) {
    case "all-off":
      return new Set(nodeInfo.map((n) => n.id));
    case "minInDegree":
      return new Set(nodeInfo.filter((n) => n.inDegree < filter.filterValue).map((n) => n.id));
    case "custom":
      return new Set(filter.filterValue ?? []);
    case "all-on":
    default:
      return new Set();
  }
}

/**
 * Return a plain copy of a filter intent (fresh array for `"custom"`), safe to
 * pass across component boundaries.
 *
 * @param {EmphasisFilterState} filter
 * @returns {EmphasisFilterState}
 */
export function cloneEmphasisFilter(filter) {
  return {
    typeOfFilter: filter.typeOfFilter,
    filterValue: Array.isArray(filter.filterValue) ? [...filter.filterValue] : filter.filterValue,
  };
}

// ── Stateful composable ──────────────────────────────────────────────────────

/**
 * Reactive emphasis state for the committed SNA plot configuration.
 *
 * Owns the emphasis filter intent and derives `dimmedNodes` (the nodes to dim)
 * in a single place.
 *
 * @param {import("vue").Ref<Array<{id: string, hasMutualEdge: boolean, inDegree: number}>>} nodeInfo
 *   Reactive array of per-node metadata (from the report store).
 * @returns {{
 *   emphasis: EmphasisFilterState,
 *   dimmedNodes: import("vue").ComputedRef<Set<string>>,
 *   setState: (state: EmphasisFilterState) => void,
 * }}
 */
export function useNodeEmphasis(nodeInfo) {
  /** The emphasis filter intent of the plot configuration. */
  const emphasis = reactive({
    typeOfFilter: "all-on",
    filterValue: null,
  });

  /** Nodes to dim — derived from the filter intent and node metadata. */
  const dimmedNodes = computed(() => resolveDimmedNodes(nodeInfo.value, emphasis));

  /**
   * Replace the emphasis filter intent with a snapshot.
   *
   * @param {EmphasisFilterState} state
   */
  function setState(state) {
    emphasis.typeOfFilter = state.typeOfFilter;
    emphasis.filterValue = state.filterValue;
  }

  return { emphasis, dimmedNodes, setState };
}
