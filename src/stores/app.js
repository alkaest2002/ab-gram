import { ref } from "vue";
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", () => {

  /** @type {import("vue").Ref<string>} */
  const appVersion = ref("1.0");

  return { appVersion, };
});
