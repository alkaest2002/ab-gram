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
 * Sociogram flow data.
 *
 * Holds the parsed members and the current wizard step. Step ordering and
 * navigation live in `useSociogramNavigation`; this store only keeps the
 * current step value, so it remains the single source of truth for "which step".
 */
export const useSociogramStore = defineStore("sociogram", {
  state: () => ({
    /** @type {Member[]} Parsed sociogram members. */
    members: [],
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

    /** Clear all loaded members. */
    resetMembers() {
      this.members = [];
    },
  },
});
