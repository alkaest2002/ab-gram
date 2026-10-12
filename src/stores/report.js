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

  /** @type {import("vue").Ref<Array<{typeOfPreference: string, accentColor: string, svg: string}>>} SNA likes plots. */
  const snaLikesPlots = ref([]);

  /** @type {import("vue").Ref<Array<{typeOfPreference: string, accentColor: string, svg: string}>>} SNA dislikes plots. */
  const snaDislikesPlots = ref([]);

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
    snaLikesComponents.value = value.snaLikesComponents ?? {};
    snaLikesIndividualLevelMetric.value = value.snaLikesIndividualLevelMetric ?? {};
    snaDislikesGroupLevelMetrics.value = value.snaDislikesGroupLevelMetrics ?? {};
    snaDislikesComponents.value = value.snaDislikesComponents ?? {};
    snaDislikesIndividualLevelMetric.value = value.snaDislikesIndividualLevelMetric ?? {};
    snaLikesPlots.value = value.snaLikesPlots ?? [];
    snaDislikesPlots.value = value.snaDislikesPlots ?? [];
  }

  /** Reset the report store to its initial state. */
  function reset() {
    status.value = "idle";
    edgeTypes.value = {};
    morenoGroupLevelMetrics.value = {};
    morenoIndividualLevelMetrics.value = {};
    morenoEgoGraphs.value = [];
    snaLikesGroupLevelMetrics.value = {};
    snaLikesComponents.value = {};
    snaLikesIndividualLevelMetric.value = {};
    snaDislikesGroupLevelMetrics.value = {};
    snaDislikesComponents.value = {};
    snaDislikesIndividualLevelMetric.value = {};
    snaLikesPlots.value = [];
    snaDislikesPlots.value = [];
  }

  return {
    status,
    edgeTypes,
    morenoGroupLevelMetrics,
    morenoIndividualLevelMetrics,
    morenoEgoGraphs,
    snaLikesGroupLevelMetrics,
    snaLikesIndividualLevelMetric,
    snaLikesComponents,
    snaLikesPlots,
    snaDislikesGroupLevelMetrics,
    snaDislikesIndividualLevelMetric,
    snaDislikesComponents,
    snaDislikesPlots,
    setStatus,
    setAnalysis,
    reset,
  };
});
