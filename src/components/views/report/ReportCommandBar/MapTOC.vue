<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
import { computed } from "vue";
import { RouterLink } from "vue-router";

// --- Props --------------
const props = defineProps({
  membersData: { type: Object, required: true },
});

// --- Emits --------------
const emit = defineEmits(["select", "show-members"]);

// --- Computed -----------
const allSections = computed(() => [
  { label: "Nominativi", hash: "#listOfMembers" },
  { label: "Preferenze", hash: "#listOfPreferences" },
  { label: "Network scelte", hash: "#likesNetwork" },
  {
    label: "Network rifiuti",
    hash: "#dislikesNetwork",
    hidden: props.membersData.allMembersHaveNoDislikes,
  },
  { label: "Membri", hidden: !props.membersData.members?.length },
  { label: "Sommario", hash: "#summary" },
  { label: "Glossario", hash: "#glossary" },
]);

const visibleSection = computed(() => allSections.value.filter((section) => !section.hidden));
</script>

<template>
  <ul>
    <li v-for="section in visibleSection" :key="section.label" class="text-xs text-white">
      <RouterLink
        v-if="section.hash"
        :to="{ hash: section.hash }"
        class="block rounded-xl px-2 py-1 hover:bg-white/10 focus-visible:bg-white/15 focus-visible:outline-white"
        @click="emit('select')"
      >
        {{ section.label }}
      </RouterLink>
      <button
        v-else
        type="button"
        class="flex w-full items-center justify-between rounded-xl px-2 py-1 hover:bg-white/10 focus-visible:bg-white/15 focus-visible:outline-white"
        @click="emit('show-members')"
      >
        {{ section.label }} <span aria-hidden="true">›</span>
      </button>
    </li>
  </ul>
</template>
