// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { ref } from "vue";
import { defineStore } from "pinia";

export const useReportStore = defineStore("report", () => {
  /** @type {import("vue").Ref<string>} Current report generation status. */
  /* possible values: idle, generating, generated, error */
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

  /** @type {import("vue").Ref<Array<{typeOfPreference: string, accentColor: string, svg: string}>>} SNA likes plots. */
  const snaLikesPlots = ref([]);

  /** @type {import("vue").Ref<Array<{typeOfPreference: string, accentColor: string, svg: string}>>} SNA dislikes plots. */
  const snaDislikesPlots = ref([]);

  /** @type {import("vue").Ref<object>} Directed graph for likes preferences. */
  const snaLikesNetwork = ref({});

  /** @type {import("vue").Ref<object>} Directed graph for dislikes preferences. */
  const snaDislikesNetwork = ref({});

  /** @param {string} value */
  function setStatus(value) {
    status.value = value;
  }

  /**
   * Store the combined sociogram analysis result.
   * @param {object} value - The object returned by `getSociogramAnalysis`.
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
    snaLikesNetwork.value = value.snaLikesNetwork ?? {};
    snaDislikesNetwork.value = value.snaDislikesNetwork ?? {};
  }

  /**
   * Replace the regenerated SNA plot for a single preference type.
   * @param {{typeOfPreference: string, accentColor: string, svg: string}} plot - The regenerated plot.
   */
  function setSnaPlot(plot) {
    if (plot.typeOfPreference === "likes") {
      snaLikesPlots.value = [plot];
    } else if (plot.typeOfPreference === "dislikes") {
      snaDislikesPlots.value = [plot];
    }
  }

  /** Reset the report store to its initial state. */
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
    snaLikesNetwork,
    snaDislikesNetwork,
    setStatus,
    setAnalysis,
    setSnaPlot,
    reset,
  };
});
