import { defineStore } from "pinia";

/**
 * @typedef {object} Member
 * @property {string} id
 * @property {string} name
 * @property {string[]} likes     id of the preferred members
 * @property {string[]} dislikes  id of the rejected members
 */

/** Ordered list of the sociogram states. */
export const SOCIOGRAM_STATES = [
  "start",
  "loadMembers",
  "setPreferences",
  "generateReport",
];

/** Group data: the raw names and the structured members. */
export const useSociogramStore = defineStore("sociogram", {
  state: () => ({
    /** @type {string[]} */
    textLoaded: [],
    /** @type {Member[]} */
    membersData: [],
    /** @type {string} Current sociogram state (see `SOCIOGRAM_STATES`). */
    currentSociogramStep: "start",
  }),

  getters: {
    hasMembers: (state) => state.membersData.length > 0,
    membersCount: (state) => state.membersData.length,
    hasPreviousSociogramStep: (state) =>
      SOCIOGRAM_STATES.indexOf(state.currentSociogramStep) > 0,
    hasNextSociogramStep: (state) =>
      SOCIOGRAM_STATES.indexOf(state.currentSociogramStep) < SOCIOGRAM_STATES.length - 1,
  },

  actions: {
    /** @param {string[]} data */
    setTextLoaded(data) {
      this.textLoaded = data;
    },

    /** @param {Member[]} data */
    setMembersData(data) {
      this.membersData= data;
    },

    /** @param {string} step One of `SOCIOGRAM_STATES`. */
    setCurrentSociogramStep(step) {
      if (SOCIOGRAM_STATES.includes(step)) {
        this.currentSociogramStep = step;
      }
    },

    /** Advance to the next step, if there is one. */
    goToNextSociogramStep() {
      if (this.hasNextSociogramStep) {
        this.currentSociogramStep = SOCIOGRAM_STATES[SOCIOGRAM_STATES.indexOf(this.currentSociogramStep) + 1];
      }
    },

    /** Move back to the previous step, if there is one. */
    goToPreviousSociogramStep() {
      if (this.hasPreviousSociogramStep) {
        this.currentSociogramStep = SOCIOGRAM_STATES[SOCIOGRAM_STATES.indexOf(this.currentSociogramStep) - 1];
      }
    },

    /** Clear all sociogram data and return to the starting state. */
    reset() {
      this.textLoaded = [];
      this.membersData = [];
      this.currentSociogramStep = SOCIOGRAM_STATES[0] ;
    },
  },
});
