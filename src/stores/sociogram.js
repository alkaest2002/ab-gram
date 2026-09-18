import { computed, ref } from "vue";
import { defineStore } from "pinia";

import { MEMBERS_INDICES } from "@/utils/members";

/**
 * A single participant in the sociogram.
 *
 * @typedef {object} Member
 * @property {string} id - Unique member id.
 * @property {string} name - Display name.
 * @property {string[]} likes - Ids of the members this member prefers (each Id = single character A,B,C,...Z,0,1,2,3,..9).
 * @property {string[]} dislikes - Ids of the members this member rejects (each Id = single character A,B,C,...Z,0,1,2,3,..9).
 * @property {boolean} noLikes - Whether the member declared no likes.
 * @property {boolean} noDislikes - Whether the member declared no dislikes.
 */

/**
 * Sociogram flow data.
 *
 * Holds the parsed members and the current wizard step. Step ordering and
 * navigation live in `useSociogramNavigation`; this store only keeps the
 * current step value, so it remains the single source of truth for "which step".
 */
export const useSociogramStore = defineStore("sociogram", () => {

  /** @type {number} Maximum length of a member's name. */
  const maxMemberNameLength = 150;

  /** @type {number} Maximum number of members (one per shared id). */
  const maxMembersCount = MEMBERS_INDICES.length;

  /** @type {import("vue").Ref<Member[]>} Parsed sociogram members. */
  const members = ref([]);

  /** @type {import("vue").ComputedRef<boolean>} Whether at least one member has been loaded. */
  const hasMembers = computed(() => members.value.length > 0);

  /** @type {import("vue").ComputedRef<number>} Number of loaded members. */
  const membersCount = computed(() => members.value.length);

  /**
   * Replace the parsed members.
   * @param {Member[]} membersData
   */
  function setMembers(membersData) {
    members.value = membersData;
  }

  function updateMember({ memberId, key, value }) {
    const memberIndex = members.value.findIndex((m) => m.id === memberId);
    if (memberIndex !== -1) {
      members.value[memberIndex][key] = value;
    }
  }

  /**
   * Remove a single member by id.
   * @param {string} memberId
   */
  function removeMember(memberId) {
    members.value = members.value.filter((m) => m.id !== memberId);
  }

  /**
   * Append a member with the next id from the shared index sequence.
   * Does nothing once every index is in use.
   */
  function addMember() {
    const id = MEMBERS_INDICES[members.value.length];
    if (id === undefined) return;

    members.value = [
      ...members.value,
      { id, name: "", likes: [], dislikes: [], noLikes: false, noDislikes: false },
    ];
  }

  /** Clear all loaded members. */
  function resetMembers() {
    members.value = [];
  }

  return {
    members,
    hasMembers,
    membersCount,
    maxMemberNameLength,
    maxMembersCount,
    setMembers,
    updateMember,
    addMember,
    removeMember,
    resetMembers,
  };
});
