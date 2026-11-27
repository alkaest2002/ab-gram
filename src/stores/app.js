// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { ref } from "vue";
import { defineStore } from "pinia";

/**
 * Application-wide metadata and transient notification payloads.
 */
export const useAppStore = defineStore("app", () => {
  const initialVersion = "1.1";

  /** @type {import("vue").Ref<string>} Version embedded in generated reports. */
  const version = ref(initialVersion);

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

  /** Return a detached plain-data snapshot of the store. */
  function exportStore() {
    return { version: version.value, notifyData: notifyData.value?.slice() ?? null };
  }

  /** Clear the transient notification payload. @returns {void} */
  function resetNotifyData() {
    notifyData.value = null;
  }

  /** Reset application state to its initial values. @returns {void} */
  function resetStore() {
    version.value = initialVersion;
    resetNotifyData();
  }

  return { version, notifyData, setNotifyData, exportStore, resetNotifyData, resetStore };
});
