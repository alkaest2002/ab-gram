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
 * Holds the parsed members and the current wizard step. Steps are switched by
 * swapping components in `SociogramView` (component-based), so this store is the
 * single source of truth for "which step".
 */
export const useSociogramStore = defineStore("sociogram", {
  state: () => ({
    /** @type {Member[]} Parsed sociogram members. */
    members: [],
    /** @type {SociogramStep} Current sociogram step (see `SOCIOGRAM_STEPS`). */
    currentSociogramStep: "start",
  }),

  getters: {
    /** @returns {boolean} Whether at least one member has been loaded. */
    hasMembers: (state) => state.members.length > 0,
    /** @returns {number} Number of loaded members. */
    membersCount: (state) => state.members.length,
  },

  actions: {
    /** Replace the parsed members.
     * @param {Member[]} data
     */
    setMembers(membersData) {
      this.members = membersData;
    },

    updateMember({ memberId, key, value }) {
      const memberIndex = this.members.findIndex((m) => m.id === memberId);
      if (memberIndex !== -1) {
        this.members[memberIndex][key] = value;
      }
    },

    /** Remove a single member by id.
     * @param {string} memberId
     */
    removeMember(memberId) {
      this.members = this.members.filter((m) => m.id !== memberId);
    },

    /** Set the current step, ignoring values outside `SOCIOGRAM_STEPS`.
     * @param {SociogramStep} step
     */
    setCurrentSociogramStep(step) {
      if (SOCIOGRAM_STEPS.includes(step)) {
        this.currentSociogramStep = step;
      }
    },

    /** Clear all sociogram data and return to the first step. */
    reset() {
      this.members = [];
      this.currentSociogramStep = SOCIOGRAM_STEPS[0];
    },
  },
});
