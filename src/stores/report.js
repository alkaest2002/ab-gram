import { ref } from "vue";
import { defineStore } from "pinia";

export const useReportStore = defineStore("report", () => {

  /** @type {import("vue").Ref<string>} Current report generation status. */
  /* possible values: idle, generating, generated, error */
  const status = ref("idle");

  /** @type {import("vue").Ref<object>} Generated report data. */
  const data = ref({});

  return { status, data };
});
