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

// --- Routers ------------

// --- Stores -------------

// --- State --------------
const allSections = [
  { label: "Nominativi", hash: "#listOfMembers" },
  { label: "Scelte e rifiuti", hash: "#listOfPreferences" },
  { label: "Rete delle scelte", hash: "#likesNetwork" },
  { label: "Rete dei rifiuti", hash: "#dislikesNetwork" },
  { label: "Membri", hash: null },
  { label: "Sintesi", hash: "#summary" },
  { label: "Glossario", hash: "#glossary" },
];

// --- Composables --------

// --- Computed -----------
const visibleSections = computed(() => {
  return allSections.filter(
    (section) => section.hash !== "#dislikesNetwork" || !props.membersData.allMembersHaveNoDislikes,
  );
});

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
  <ul>
    <li v-for="section in visibleSections" :key="section.label" class="text-xs text-white">
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
