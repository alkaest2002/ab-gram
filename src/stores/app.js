// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { ref } from "vue";
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", () => {
  /** @type {import("vue").Ref<string>} */
  const appVersion = ref("1.0");

  /** @type {import("vue").Ref<unknown>} */
  const notifyData = ref(null);

  function setNotifyData(data) {
    notifyData.value = data;
  }

  function resetNotifyData() {
    notifyData.value = null;
  }

  return { appVersion, notifyData, setNotifyData, resetNotifyData };
});
