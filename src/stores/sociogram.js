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
    membersNames: [],
    /** @type {Member[]} */
    membersObjects: [],
    /** @type {boolean} */
    isReportBeingGenerated: false,
    /** @type {boolean} */
    isReportReady: false,
    /** @type {string} Current sociogram state (see `SOCIOGRAM_STATES`). */
    currentState: "start",
  }),

  getters: {
    membersCount: (state) => state.membersObjects.length,
    hasMembers: (state) => state.membersObjects.length > 0,
    currentStateIndex: (state) => SOCIOGRAM_STATES.indexOf(state.currentState),
    hasPreviousState: (state) =>
      SOCIOGRAM_STATES.indexOf(state.currentState) > 0,
    hasNextState: (state) =>
      SOCIOGRAM_STATES.indexOf(state.currentState) < SOCIOGRAM_STATES.length - 1,
  },

  actions: {
    /** @param {string[]} names */
    setMembersNames(names) {
      this.membersNames = names;
    },

    /** @param {Member[]} members */
    setMembersObjects(members) {
      this.membersObjects = members;
    },

    /** @param {string} state One of `SOCIOGRAM_STATES`. */
    setCurrentState(state) {
      if (SOCIOGRAM_STATES.includes(state)) {
        this.currentState = state;
      }
    },

    /** Advance to the next state, if there is one. */
    goToNextState() {
      if (this.hasNextState) {
        this.currentState = SOCIOGRAM_STATES[this.currentStateIndex + 1];
      }
    },

    /** Move back to the previous state, if there is one. */
    goToPreviousState() {
      if (this.hasPreviousState) {
        this.currentState = SOCIOGRAM_STATES[this.currentStateIndex - 1];
      }
    },

    /** Clear all sociogram data and return to the starting state. */
    reset() {
      this.membersNames = [];
      this.membersObjects = [];
      this.isReportBeingGenerated = false;
      this.isReportReady = false;
      this.currentState = "start";
    },
  },
});
