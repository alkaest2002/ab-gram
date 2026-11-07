// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { computed, ref, watch } from "vue";

/**
 * @typedef {"all-on"|"all-off"|"min-in-degree"|"custom"} EmphasisFilter
 */

/**
 * Reactive emphasis state for SNA plot nodes.
 *
 * Provides filter presets (all on, all off, min in-degree) and
 * per-node toggling. The `dimmedNodes` computed is the complement of the
 * emphasized set — i.e. the nodes that should be visually de-emphasized.
 *
 * @param {import("vue").Ref<Array<{id: string, hasMutualEdge: boolean, inDegree: number}>>} nodeInfo
 *   Reactive array of per-node metadata (from the report store).
 * @returns {{
 *   activeFilter: import("vue").Ref<EmphasisFilter>,
 *   minInDegree: import("vue").Ref<number>,
 *   emphasizedNodes: import("vue").Ref<Set<string>>,
 *   dimmedNodes: import("vue").ComputedRef<Set<string>>,
 *   isAllOn: import("vue").ComputedRef<boolean>,
 *   isAllOff: import("vue").ComputedRef<boolean>,
 *   applyFilter: (filter: EmphasisFilter) => void,
 *   toggleNode: (id: string) => void,
 * }}
 */
export function useNodeEmphasis(nodeInfo) {
  /** Which filter last set the emphasis state. */
  const activeFilter = ref("all-on");

  /** Threshold for the "min-in-degree" filter. */
  const minInDegree = ref(0);

  /** The set of node ids currently emphasized (i.e. *not* dimmed). */
  const emphasizedNodes = ref(new Set());

  // ── Derived ────────────────────────────────────────────────────────────────

  const allNodeIds = computed(() => nodeInfo.value.map((n) => n.id));

  /** Nodes *not* in the emphasized set — the ones to dim. */
  const dimmedNodes = computed(
    () => new Set(allNodeIds.value.filter((id) => !emphasizedNodes.value.has(id))),
  );

  const isAllOn = computed(
    () => allNodeIds.value.length > 0 && emphasizedNodes.value.size === allNodeIds.value.length,
  );

  const isAllOff = computed(() => emphasizedNodes.value.size === 0);

  // ── Actions ────────────────────────────────────────────────────────────────

  /**
   * Apply a named filter preset, updating `emphasizedNodes` accordingly.
   *
   * @param {EmphasisFilter} filter
   */
  function applyFilter(filter) {
    activeFilter.value = filter;

    switch (filter) {
      case "all-on":
        emphasizedNodes.value = new Set(allNodeIds.value);
        break;
      case "all-off":
        emphasizedNodes.value = new Set();
        break;
      case "min-in-degree":
        emphasizedNodes.value = new Set(
          nodeInfo.value.filter((n) => n.inDegree >= minInDegree.value).map((n) => n.id),
        );
        break;
      // "custom" is set only by toggleNode; no preset to apply.
    }
  }

  /**
   * Toggle a single node's emphasis and switch to "custom" mode.
   *
   * @param {string} id - The node id.
   */
  function toggleNode(id) {
    activeFilter.value = "custom";
    const next = new Set(emphasizedNodes.value);
    next.has(id) ? next.delete(id) : next.add(id);
    emphasizedNodes.value = next;
  }

  // ── Watchers ───────────────────────────────────────────────────────────────

  // When the threshold changes while the min-in-degree filter is active,
  // recompute the emphasized set automatically.
  watch(minInDegree, () => {
    if (activeFilter.value === "min-in-degree") {
      applyFilter("min-in-degree");
    }
  });

  // Initialize with all nodes emphasized.
  watch(
    nodeInfo,
    () => {
      if (activeFilter.value === "all-on") {
        emphasizedNodes.value = new Set(allNodeIds.value);
      }
    },
    { immediate: true },
  );

  return {
    activeFilter,
    minInDegree,
    emphasizedNodes,
    dimmedNodes,
    isAllOn,
    isAllOff,
    applyFilter,
    toggleNode,
  };
}
