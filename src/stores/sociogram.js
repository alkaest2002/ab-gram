import { defineStore } from 'pinia'

/**
 * @typedef {object} Member
 * @property {string} id
 * @property {string} name
 * @property {string[]} likes     id of the preferred members
 * @property {string[]} dislikes  id of the rejected members
 */

/** Group data: the raw names and the structured members. */
export const useSociogramStore = defineStore('sociogram', {
  state: () => ({
    /** @type {string[]} */
    membersNames: [],
    /** @type {Member[]} */
    membersObjects: [],
    /** @type {boolean} */
    isReportBeingGenerated: false,
    /** @type {boolean} */
    isReportReady: false,
  }),

  getters: {
    membersCount: (state) => state.membersObjects.length,
    hasMembers: (state) => state.membersObjects.length > 0,
  },

  actions: {
    /** @param {string[]} names */
    setMembersNames(names) {
      this.membersNames = names
    },

    /** @param {Member[]} members */
    setMembersObjects(members) {
      this.membersObjects = members
    },
  },
})
