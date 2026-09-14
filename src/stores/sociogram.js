import { defineStore } from "pinia";

/**
 * A single participant in the sociogram.
 *
 * @typedef {object} Member
 * @property {string} id - Unique member id.
 * @property {string} name - Display name.
 * @property {string[]} likes - Ids of the members this member prefers.
 * @property {string[]} dislikes - Ids of the members this member rejects.
 */

/**
 * One of the ordered sociogram steps.
 *
 * @typedef {'start' | 'loadMembers' | 'setPreferences' | 'generateReport'} SociogramStep
 */

/**
 * Ordered list of the sociogram steps.
 * @type {SociogramStep[]}
 */
export const SOCIOGRAM_STEPS = [
  "start",
  "loadMembers",
  "setPreferences",
  "generateReport",
];

/**
 * Sociogram flow data and navigation.
 *
 * Holds the raw member names (`dataLoaded`), the parsed members
 * (`dataMembers`), and the current wizard step (`currentSociogramStep`).
 */
export const useSociogramStore = defineStore("sociogram", {
  state: () => ({
    /** @type {string[]} Raw member names loaded from user input. */
    dataLoaded: [],
    /** @type {Member[]} Parsed sociogram members. */
    dataMembers: [],
    /** @type {SociogramStep} Current sociogram step (see `SOCIOGRAM_STEPS`). */
    currentSociogramStep: "start",
  }),

  getters: {
    /** @returns {boolean} Whether at least one member has been loaded. */
    hasMembers: (state) => state.dataMembers.length > 0,
    /** @returns {number} Number of loaded members. */
    membersCount: (state) => state.dataMembers.length,
    /** @returns {boolean} Whether there is a step before the current one. */
    hasPreviousSociogramStep: (state) =>
      SOCIOGRAM_STEPS.indexOf(state.currentSociogramStep) > 0,
    /** @returns {boolean} Whether there is a step after the current one. */
    hasNextSociogramStep: (state) =>
      SOCIOGRAM_STEPS.indexOf(state.currentSociogramStep) < SOCIOGRAM_STEPS.length - 1,
  },

  actions: {
    /** Replace the raw member names.
     * @param {string[]} data
     */
    setTextLoaded(data) {
      this.dataLoaded = data;
    },

    /** Replace the parsed members.
     * @param {Member[]} data
     */
    setMembersData(data) {
      this.dataMembers = data;
    },

    /** Set the current step, ignoring values outside `SOCIOGRAM_STEPS`.
     * @param {SociogramStep} step
     */
    setCurrentSociogramStep(step) {
      if (SOCIOGRAM_STEPS.includes(step)) {
        this.currentSociogramStep = step;
      }
    },

    /** Advance to the next step, if there is one. */
    goToNextSociogramStep() {
      if (this.hasNextSociogramStep) {
        this.currentSociogramStep = SOCIOGRAM_STEPS[SOCIOGRAM_STEPS.indexOf(this.currentSociogramStep) + 1];
      }
    },

    /** Move back to the previous step, if there is one. */
    goToPreviousSociogramStep() {
      if (this.hasPreviousSociogramStep) {
        this.currentSociogramStep = SOCIOGRAM_STEPS[SOCIOGRAM_STEPS.indexOf(this.currentSociogramStep) - 1];
      }
    },

    /** Clear all sociogram data and return to the first step. */
    reset() {
      this.dataLoaded = [];
      this.dataMembers = [];
      this.currentSociogramStep = SOCIOGRAM_STEPS[0];
    },
  },
});
