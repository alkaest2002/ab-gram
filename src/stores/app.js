import { defineStore } from "pinia";

/** Cross-cutting application state. Single state property: `shouldLockUI`. */
export const useAppStore = defineStore("app", {
  state: () => ({
    /** @type {boolean} */
    shouldLockUI: true,
  }),

  actions: {
    setLoading(value) {
      this.shouldLockUI = Boolean(value);
    },
  },
});
