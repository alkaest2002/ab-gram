// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { computed, reactive, watch } from "vue";

/**
 * @typedef {"all-on"|"all-off"|"min-in-degree"|"custom"} EmphasisFilter
 */

// ── Pure emphasis transitions ────────────────────────────────────────────────
// These are the single source of truth for how an emphasis object changes. They
// return a *new* object (never mutate their input), so the emphasis tab can call
// them directly and emit the result as `update:modelValue`, while the stateful
// `useNodeEmphasis` composable below wraps them for committed plot state.

/**
 * Resolve the emphasized node set for a named filter preset. `"custom"` has no
 * preset, so it must be built by `toggleEmphasizedNode` instead.
 *
 * @param {Array<{id: string, inDegree: number}>} nodeInfo
 * @param {Exclude<EmphasisFilter, "custom">} filter
 * @param {number} minInDegree
 * @returns {Set<string>}
 */
function resolveEmphasizedNodes(nodeInfo, filter, minInDegree) {
  switch (filter) {
    case "all-on":
      return new Set(nodeInfo.map((n) => n.id));
    case "all-off":
      return new Set();
    case "min-in-degree":
      return new Set(nodeInfo.filter((n) => n.inDegree >= minInDegree).map((n) => n.id));
    default:
      return new Set();
  }
}

/**
 * Apply a named filter preset.
 *
 * @param {Array<{id: string, inDegree: number}>} nodeInfo
 * @param {{activeFilter: EmphasisFilter, minInDegree: number, emphasizedNodes: Set<string>}} emphasis
 * @param {EmphasisFilter} filter
 * @returns {{activeFilter: EmphasisFilter, minInDegree: number, emphasizedNodes: Set<string>}}
 */
export function applyEmphasisFilter(nodeInfo, emphasis, filter) {
  const emphasizedNodes =
    filter === "custom"
      ? new Set(emphasis.emphasizedNodes)
      : resolveEmphasizedNodes(nodeInfo, filter, emphasis.minInDegree);

  return {
    activeFilter: filter,
    minInDegree: emphasis.minInDegree,
    emphasizedNodes,
  };
}

/**
 * Toggle a single node's emphasis and switch to `"custom"` mode.
 *
 * @param {{activeFilter: EmphasisFilter, minInDegree: number, emphasizedNodes: Set<string>}} emphasis
 * @param {string} id
 * @returns {{activeFilter: EmphasisFilter, minInDegree: number, emphasizedNodes: Set<string>}}
 */
export function toggleEmphasizedNode(emphasis, id) {
  const emphasizedNodes = new Set(emphasis.emphasizedNodes);
  if (emphasizedNodes.has(id)) {
    emphasizedNodes.delete(id);
  } else {
    emphasizedNodes.add(id);
  }

  return {
    activeFilter: "custom",
    minInDegree: emphasis.minInDegree,
    emphasizedNodes,
  };
}

/**
 * Update the min-in-degree threshold. When the `"min-in-degree"` filter is
 * active the emphasized set is recomputed, otherwise it is left untouched.
 *
 * @param {Array<{id: string, inDegree: number}>} nodeInfo
 * @param {{activeFilter: EmphasisFilter, minInDegree: number, emphasizedNodes: Set<string>}} emphasis
 * @param {number} minInDegree
 * @returns {{activeFilter: EmphasisFilter, minInDegree: number, emphasizedNodes: Set<string>}}
 */
export function setEmphasisMinInDegree(nodeInfo, emphasis, minInDegree) {
  const emphasizedNodes =
    emphasis.activeFilter === "min-in-degree"
      ? resolveEmphasizedNodes(nodeInfo, "min-in-degree", minInDegree)
      : new Set(emphasis.emphasizedNodes);

  return {
    activeFilter: emphasis.activeFilter,
    minInDegree,
    emphasizedNodes,
  };
}

/**
 * Return a plain copy of an emphasis object (fresh `Set`), safe to pass across
 * component boundaries.
 *
 * @param {{activeFilter: EmphasisFilter, minInDegree: number, emphasizedNodes: Set<string>}} emphasis
 * @returns {{activeFilter: EmphasisFilter, minInDegree: number, emphasizedNodes: Set<string>}}
 */
export function cloneEmphasis(emphasis) {
  return {
    activeFilter: emphasis.activeFilter,
    minInDegree: emphasis.minInDegree,
    emphasizedNodes: new Set(emphasis.emphasizedNodes),
  };
}

// ── Stateful composable ──────────────────────────────────────────────────────

/**
 * Reactive emphasis state for the committed SNA plot configuration.
 *
 * Owns the `emphasis` slice of the `{ emphasis, layout }` config and derives
 * `dimmedNodes` (the complement of the emphasized set) in a single place.
 *
 * @param {import("vue").Ref<Array<{id: string, hasMutualEdge: boolean, inDegree: number}>>} nodeInfo
 *   Reactive array of per-node metadata (from the report store).
 * @returns {{
 *   emphasis: {activeFilter: EmphasisFilter, minInDegree: number, emphasizedNodes: Set<string>},
 *   dimmedNodes: import("vue").ComputedRef<Set<string>>,
 *   setState: (state: {activeFilter: EmphasisFilter, minInDegree: number, emphasizedNodes: Set<string>}) => void,
 * }}
 */
export function useNodeEmphasis(nodeInfo) {
  /** The emphasis slice of the plot configuration. */
  const emphasis = reactive({
    activeFilter: "all-on",
    minInDegree: 0,
    emphasizedNodes: new Set(),
  });

  const allNodeIds = computed(() => nodeInfo.value.map((n) => n.id));

  /** Nodes *not* in the emphasized set — the ones to dim. */
  const dimmedNodes = computed(
    () => new Set(allNodeIds.value.filter((id) => !emphasis.emphasizedNodes.has(id))),
  );

  /**
   * Replace the emphasis state with a snapshot.
   *
   * @param {{activeFilter: EmphasisFilter, minInDegree: number, emphasizedNodes: Set<string>}} state
   */
  function setState(state) {
    emphasis.activeFilter = state.activeFilter;
    emphasis.minInDegree = state.minInDegree;
    emphasis.emphasizedNodes = new Set(state.emphasizedNodes);
  }

  // Initialize with all nodes emphasized.
  watch(
    nodeInfo,
    () => {
      if (emphasis.activeFilter === "all-on") {
        emphasis.emphasizedNodes = new Set(allNodeIds.value);
      }
    },
    { immediate: true },
  );

  return { emphasis, dimmedNodes, setState };
}
