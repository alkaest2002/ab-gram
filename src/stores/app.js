import { defineStore } from "pinia";

/** Cross-cutting application state. */
export const useAppStore = defineStore("app", {
  state: () => ({
    /** @type {boolean} */
    shouldLockUI: true,
    /** @type {string} Name of the active layout (see `src/layouts`). */
    layout: "DefaultLayout",
  }),

  actions: {
    setLoading(value) {
      this.shouldLockUI = Boolean(value);
    },

    setLayout(name) {
      this.layout = name;
    },
  },
});
