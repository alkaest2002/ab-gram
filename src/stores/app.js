import { ref } from "vue";
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", () => {

  /** @type {import("vue").Ref<string>} */
  const appVersion = ref("0.10");

  return { appVersion, };
});
