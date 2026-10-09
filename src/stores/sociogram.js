import { computed, ref } from "vue";
import { defineStore } from "pinia";

import { MEMBERS_INDICES } from "@/utils/sociogram/sociogramValidationFunctions";
import { isMemberComplete } from "@/utils/sociogram/memberHelpers";

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

  /** @type {import("vue").ComputedRef<string>} The current status of the sociogram. */
  const status = computed(() => {
    if (membersCount.value === 0) return "empty";
    if (members.value.every(isMemberComplete)) return "completed";
    return "partially-loaded";
  });

  /** @type {import("vue").ComputedRef<boolean>} Whether all members have no dislikes. */
  const allMembersHaveNoDislikes = computed(() => {
    return members.value.every((member) => (member.dislikes ?? []).length === 0);
  });

  /**
   * Replace the parsed members.
   * @param {Member[]} membersData
   */
  function initMembers(membersData) {
    members.value = membersData;
  }

  /**
   * Append a member with the first id from the shared index sequence that is
   * not yet in use. Does nothing once every index is in use.
   */
  function addMember() {
    const usedIds = new Set(members.value.map((m) => m.id));
    const id = MEMBERS_INDICES.find((candidate) => !usedIds.has(candidate));
    if (id === undefined) return;

    members.value = [
      ...members.value,
      { id, name: "", likes: [], dislikes: [], noLikes: false, noDislikes: false },
    ];
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

      // Delete memberId by filtering out
      members.value = members.value.filter((m) => m.id !== memberId);

      // Loop through each remaining member and remove the memberId
      // from likes/dislikes
      members.value.forEach((currentMember) => {
        // Delete MemberId from each likes/dislikes array
        if (currentMember.likes.includes(memberId)) {
          currentMember.likes = currentMember.likes.filter((id) => id !== memberId);
          currentMember.noLikes = currentMember.likes.length === 0;
        }
        // Delete MemberId from each dislikes array
        if (currentMember.dislikes.includes(memberId)) {
          currentMember.dislikes = currentMember.dislikes.filter((id) => id !== memberId);
          currentMember.noDislikes = currentMember.dislikes.length === 0;
        }
      });
    }
  /** Clear all loaded members. */
  function resetMembers() {
    members.value = [];
  }

  return {
    status,
    members,
    hasMembers,
    membersCount,
    maxMemberNameLength,
    maxMembersCount,
    allMembersHaveNoDislikes,
    initMembers,
    addMember,
    updateMember,
    removeMember,
    resetMembers,
  };
});
