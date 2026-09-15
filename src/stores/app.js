import { ref } from "vue";
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", () => {

  /** @type {import("vue").Ref<boolean>} */
  const shouldLockUi = ref(true);

  function lockUi(value) {
    shouldLockUi.value = Boolean(value);
  }

  return { shouldLockUi, lockUi };
});
