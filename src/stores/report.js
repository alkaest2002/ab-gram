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

  /** @type {import("vue").Ref<object>} Group-level SNA metrics for likes. */
  const snaLikesGroupLevelMetrics = ref({});

  /** @type {import("vue").Ref<object>} SNA components for likes. */
  const snaLikesComponents = ref({});

  /** @type {import("vue").Ref<object>} Individual-level SNA metrics for likes. */
  const snaLikesIndividualLevelMetric = ref({});

  /** @type {import("vue").Ref<object>} Group-level SNA metrics for dislikes. */
  const snaDislikesGroupLevelMetrics = ref({});

  /** @type {import("vue").Ref<object>} SNA components for dislikes. */
  const snaDislikesComponents = ref({});

  /** @type {import("vue").Ref<object>} Individual-level SNA metrics for dislikes. */
  const snaDislikesIndividualLevelMetric = ref({});

  /** @type {import("vue").Ref<Array<object>>} Moreno plots. */
  const morenoPlots = ref([]);

  /** @type {import("vue").Ref<Array<{typeOfPreference: string, accentColor: string, svg: string}>>} SNA plots, one per preference graph. */
  const snaPlots = ref([]);

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
    snaLikesGroupLevelMetrics.value = value.snaLikesGroupLevelMetrics ?? {};
    snaLikesComponents.value = value.snaLikesComponents ?? {};
    snaLikesIndividualLevelMetric.value = value.snaLikesIndividualLevelMetric ?? {};
    snaDislikesGroupLevelMetrics.value = value.snaDislikesGroupLevelMetrics ?? {};
    snaDislikesComponents.value = value.snaDislikesComponents ?? {};
    snaDislikesIndividualLevelMetric.value = value.snaDislikesIndividualLevelMetric ?? {};
    morenoPlots.value = value.morenoPlots ?? [];
    snaPlots.value = value.snaPlots ?? [];
  }

  /** Reset the report store to its initial state. */
  function reset() {
    status.value = "idle";
    edgeTypes.value = {};
    morenoGroupLevelMetrics.value = {};
    morenoIndividualLevelMetrics.value = {};
    snaLikesGroupLevelMetrics.value = {};
    snaLikesComponents.value = {};
    snaLikesIndividualLevelMetric.value = {};
    snaDislikesGroupLevelMetrics.value = {};
    snaDislikesComponents.value = {};
    snaDislikesIndividualLevelMetric.value = {};
    morenoPlots.value = [];
    snaPlots.value = [];
  }

  return {
    status,
    edgeTypes,
    morenoGroupLevelMetrics,
    morenoIndividualLevelMetrics,
    snaLikesGroupLevelMetrics,
    snaLikesComponents,
    snaLikesIndividualLevelMetric,
    snaDislikesGroupLevelMetrics,
    snaDislikesComponents,
    snaDislikesIndividualLevelMetric,
    morenoPlots,
    snaPlots,
    setStatus,
    setAnalysis,
    reset,
  };
});
