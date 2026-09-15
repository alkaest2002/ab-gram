import { defineStore } from "pinia";

/** Cross-cutting application state. */
export const useAppStore = defineStore("app", {
  state: () => ({
    /** @type {boolean} */
    shouldLockUi: true,
  }),

  actions: {
    lockUi(value) {
      this.shouldLockUi = Boolean(value);
    },
  },
});
