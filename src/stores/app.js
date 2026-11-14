// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { ref } from "vue";
import { defineStore } from "pinia";

/**
 * Application-wide metadata and transient notification payloads.
 */
export const useAppStore = defineStore("app", () => {
  /** @type {import("vue").Ref<string>} Version embedded in generated reports. */
  const appVersion = ref("1.0");

  /** @type {import("vue").Ref<string[] | null>} Validation details shown by notification views. */
  const notifyData = ref(null);

  /**
   * Store validation details for the next notification view.
   * @param {string[]} data - Human-readable validation errors.
   * @returns {void}
   */
  function setNotifyData(data) {
    notifyData.value = data;
  }

  /** Clear the transient notification payload. @returns {void} */
  function resetNotifyData() {
    notifyData.value = null;
  }

  return { appVersion, notifyData, setNotifyData, resetNotifyData };
});
