// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { computed, ref } from "vue";
import { defineStore } from "pinia";

import {
  MEMBERS_INDICES,
  MIN_MEMBERS_COUNT,
  MAX_MEMBERS_COUNT,
  MAX_NAME_LENGTH,
} from "@/utils/sociogram/validationHelpers";
import { isMemberComplete } from "@/utils/sociogram/memberHelpers";

/**
 * A single participant in the sociogram.
 *
 * @typedef {object} Member
 * @property {string} id - Unique member id.
 * @property {string} name - Display name.
 * @property {string[]} likes - Ids of preferred members from `MEMBERS_INDICES`.
 * @property {string[]} dislikes - Ids of rejected members from `MEMBERS_INDICES`.
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
  /** @type {number} Minimum number of members. */
  const minMembersCount = MIN_MEMBERS_COUNT;

  /** @type {number} Maximum number of members. */
  const maxMembersCount = MAX_MEMBERS_COUNT;

  /** @type {number} Maximum length of a member's name. */
  const maxMemberNameLength = MAX_NAME_LENGTH;

  /** @type {import("vue").Ref<Member[]>} Parsed sociogram members. */
  const members = ref([]);

  /** @type {import("vue").ComputedRef<number>} Number of loaded members. */
  const membersCount = computed(() => members.value.length);

  /** @type {import("vue").ComputedRef<"empty" | "completed" | "partially-loaded">} Completion status derived from the loaded members. */
  const membersStatus = computed(() => {
    if (membersCount.value === 0) return "empty";
    if (members.value.every(isMemberComplete)) return "completed";
    return "partially-loaded";
  });

  /** @type {import("vue").ComputedRef<boolean>} Whether all members have no dislikes. */
  const allMembersHaveNoDislikes = computed(() => {
    return members.value.every((member) => (member.dislikes ?? []).length === 0);
  });

  /**
   * Replace all currently loaded members.
   * @param {Member[]} membersData - Parsed members to store.
   * @returns {void}
   */
  function initMembers(membersData) {
    members.value = membersData;
  }

  /**
   * Append an empty member using the first available shared id.
   *
   * Does nothing once every id in `MEMBERS_INDICES` is in use.
   * @returns {void}
   */
  function addMember() {
    const usedIds = new Set(members.value.map((m) => m.id));
    const id = MEMBERS_INDICES.find((candidate) => !usedIds.has(candidate));
    if (id === undefined) return;

    members.value = [
      ...members.value,
      {
        id,
        name: "",
        likes: [],
        dislikes: [],
        noLikes: false,
        noDislikes: false,
      },
    ];
  }

  /**
   * Update one field on an existing member.
   *
   * Unknown member ids are ignored. Callers are responsible for supplying a
   * value compatible with the selected field.
   *
   * @param {{ memberId: string, key: keyof Member, value: Member[keyof Member] }} update
   * @returns {void}
   */
  function updateMember({ memberId, key, value }) {
    const memberIndex = members.value.findIndex((m) => m.id === memberId);
    if (memberIndex !== -1) {
      members.value[memberIndex][key] = value;
    }
  }

  /**
   * Remove a member and all likes/dislikes that reference it.
   *
   * A preference list emptied by removal is marked as explicitly unanswered.
   * @param {string} memberId - Id of the member to remove.
   * @returns {void}
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
  /** Clear all loaded members. @returns {void} */
  function resetMembers() {
    members.value = [];
  }

  return {
    members,
    membersCount,
    membersStatus,
    minMembersCount,
    maxMembersCount,
    maxMemberNameLength,
    allMembersHaveNoDislikes,
    initMembers,
    addMember,
    updateMember,
    removeMember,
    resetMembers,
  };
});
