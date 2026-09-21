import { ref } from "vue";
import { defineStore } from "pinia";

export const useReportStore = defineStore("report", () => {

  /** @type {import("vue").Ref<string>} Current report generation status. */
  /* possible values: idle, generating, generated, error */
  const status = ref("idle");

  /** @type {import("vue").Ref<object>} Generated report data. */
  const tabularData = ref({});

  /** @type {import("vue").Ref<object>} SVGs */
  const graphs = ref({});

  /** @param {string} value */
  function setStatus(value) {
    status.value = value;
  }

  /** @param {object} value */
  function setTabularData(value) {
    tabularData.value = value;
  }

  /** @param {object} value */
  function setGraphs(value) {
    graphs.value = value;
  }

  return { status, tabularData, graphs, setStatus, setTabularData, setGraphs };
});
