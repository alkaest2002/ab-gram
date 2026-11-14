// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { ref } from "vue";
import { defineStore } from "pinia";

/** @typedef {"idle" | "generating" | "generated" | "error"} ReportStatus */
/** @typedef {ReturnType<typeof import("@/analysis/analysisMain.js").getSociogramAnalysis>} SociogramAnalysis */
/** @typedef {{typeOfPreference: "likes" | "dislikes", accentColor: string, svg: string}} SnaPlot */

/**
 * Analysis results and lifecycle state for the currently generated report.
 */
export const useReportStore = defineStore("report", () => {
  /** @type {import("vue").Ref<ReportStatus>} Current report generation status. */
  const status = ref("idle");

  /** @type {import("vue").Ref<object>} Classified directed preference edges. */
  const edgeTypes = ref({});

  /** @type {import("vue").Ref<object>} Group-level Moreno metrics. */
  const morenoGroupLevelMetrics = ref({});

  /** @type {import("vue").Ref<object>} Individual-level Moreno metrics. */
  const morenoIndividualLevelMetrics = ref({});

  /** @type {import("vue").Ref<Array<{memberId: string, svg: string}>>} Moreno ego plots. */
  const morenoEgoGraphs = ref([]);

  /** @type {import("vue").Ref<object>} Group-level SNA metrics for likes. */
  const snaLikesGroupLevelMetrics = ref({});

  /** @type {import("vue").Ref<object>} SNA structures for likes. */
  const snaLikesStructures = ref({});

  /** @type {import("vue").Ref<object>} Individual-level SNA metrics for likes. */
  const snaLikesIndividualLevelMetric = ref({});

  /** @type {import("vue").Ref<object>} Group-level SNA metrics for dislikes. */
  const snaDislikesGroupLevelMetrics = ref({});

  /** @type {import("vue").Ref<object>} SNA structures for dislikes. */
  const snaDislikesStructures = ref({});

  /** @type {import("vue").Ref<object>} Individual-level SNA metrics for dislikes. */
  const snaDislikesIndividualLevelMetric = ref({});

  /** @type {import("vue").Ref<SnaPlot[]>} SNA likes plots. */
  const snaLikesPlots = ref([]);

  /** @type {import("vue").Ref<SnaPlot[]>} SNA dislikes plots. */
  const snaDislikesPlots = ref([]);

  /** @type {import("vue").Ref<Array<{id: string, hasMutualEdge: boolean, inDegree: number}>>} Per-node metadata for likes emphasis UI. */
  const snaLikesNodeInfo = ref([]);

  /** @type {import("vue").Ref<Array<{id: string, hasMutualEdge: boolean, inDegree: number}>>} Per-node metadata for dislikes emphasis UI. */
  const snaDislikesNodeInfo = ref([]);

  /** @type {import("vue").Ref<import("graphology").DirectedGraph | Record<string, never>>} Directed graph for likes preferences. */
  const snaLikesNetwork = ref({});

  /** @type {import("vue").Ref<import("graphology").DirectedGraph | Record<string, never>>} Directed graph for dislikes preferences. */
  const snaDislikesNetwork = ref({});

  /**
   * Set the report generation lifecycle state.
   * @param {ReportStatus} value
   * @returns {void}
   */
  function setStatus(value) {
    status.value = value;
  }

  /**
   * Replace all stored analysis sections with a newly generated result.
   *
   * Missing sections fall back to their initial empty representation.
   * @param {Partial<SociogramAnalysis>} value - Result produced by `getSociogramAnalysis`.
   * @returns {void}
   */
  function setAnalysis(value) {
    edgeTypes.value = value.edgeTypes ?? {};
    morenoGroupLevelMetrics.value = value.morenoGroupLevelMetrics ?? {};
    morenoIndividualLevelMetrics.value = value.morenoIndividualLevelMetrics ?? {};
    morenoEgoGraphs.value = value.morenoEgoGraphs ?? [];
    snaLikesGroupLevelMetrics.value = value.snaLikesGroupLevelMetrics ?? {};
    snaLikesStructures.value = value.snaLikesStructures ?? {};
    snaLikesIndividualLevelMetric.value = value.snaLikesIndividualLevelMetric ?? {};
    snaDislikesGroupLevelMetrics.value = value.snaDislikesGroupLevelMetrics ?? {};
    snaDislikesStructures.value = value.snaDislikesStructures ?? {};
    snaDislikesIndividualLevelMetric.value = value.snaDislikesIndividualLevelMetric ?? {};
    snaLikesPlots.value = value.snaLikesPlots ?? [];
    snaDislikesPlots.value = value.snaDislikesPlots ?? [];
    snaLikesNodeInfo.value = value.snaLikesNodeInfo ?? [];
    snaDislikesNodeInfo.value = value.snaDislikesNodeInfo ?? [];
    snaLikesNetwork.value = value.snaLikesNetwork ?? {};
    snaDislikesNetwork.value = value.snaDislikesNetwork ?? {};
  }

  /**
   * Replace the SNA plot for one preference type.
   * @param {SnaPlot} plot - Regenerated plot and its rendering metadata.
   * @returns {void}
   */
  function setSnaPlot(plot) {
    if (plot.typeOfPreference === "likes") {
      snaLikesPlots.value = [plot];
    } else if (plot.typeOfPreference === "dislikes") {
      snaDislikesPlots.value = [plot];
    }
  }

  /** Reset report status and all analysis sections to their initial state. @returns {void} */
  function reset() {
    status.value = "idle";
    edgeTypes.value = {};
    morenoGroupLevelMetrics.value = {};
    morenoIndividualLevelMetrics.value = {};
    morenoEgoGraphs.value = [];
    snaLikesGroupLevelMetrics.value = {};
    snaLikesStructures.value = {};
    snaLikesIndividualLevelMetric.value = {};
    snaDislikesGroupLevelMetrics.value = {};
    snaDislikesStructures.value = {};
    snaDislikesIndividualLevelMetric.value = {};
    snaLikesPlots.value = [];
    snaDislikesPlots.value = [];
    snaLikesNodeInfo.value = [];
    snaDislikesNodeInfo.value = [];
    snaLikesNetwork.value = {};
    snaDislikesNetwork.value = {};
  }

  return {
    status,
    edgeTypes,
    morenoGroupLevelMetrics,
    morenoIndividualLevelMetrics,
    morenoEgoGraphs,
    snaLikesGroupLevelMetrics,
    snaLikesIndividualLevelMetric,
    snaLikesStructures,
    snaLikesPlots,
    snaDislikesGroupLevelMetrics,
    snaDislikesIndividualLevelMetric,
    snaDislikesStructures,
    snaDislikesPlots,
    snaLikesNodeInfo,
    snaDislikesNodeInfo,
    snaLikesNetwork,
    snaDislikesNetwork,
    setStatus,
    setAnalysis,
    setSnaPlot,
    reset,
  };
});
