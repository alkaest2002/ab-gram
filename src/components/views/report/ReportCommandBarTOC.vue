<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From vue.
import { computed } from "vue";

//   -- From vue-router.
import { RouterLink } from "vue-router";

// --- Props --------------
const props = defineProps({
  membersData: { type: Object, required: true },
});

// --- Emits --------------
const emit = defineEmits(["select"]);

// --- Routers ------------

// --- Stores -------------

// --- State --------------

// --- Composables --------

// --- Computed -----------
const allSections = computed(() => {
  const firstMember = props.membersData.members?.[0];
  return [
    { label: "Nominativi", hash: "#listOfMembers" },
    { label: "Preferenze", hash: "#listOfPreferences" },
    { label: "Network scelte", hash: "#likesNetwork" },
    {
      label: "Network rifiuti",
      hash: "#dislikesNetwork",
      hidden: props.membersData.allMembersHaveNoDislikes,
    },
    { label: "Membri", hash: firstMember ? `#member${firstMember.id}` : null },
    { label: "Sommario", hash: "#summary" },
    { label: "Glossario", hash: "#glossary" },
  ];
});

const visibleSection = computed(() =>
  allSections.value.filter((section) => section.hash && !section.hidden),
);

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
  <nav
    id="report-toc"
    aria-label="Indice del report"
    class="toc-dropup w-32 overflow-y-auto rounded-2xl p-1.5 font-medium shadow-lg print:hidden"
  >
    <ul>
      <li v-for="section in visibleSection" :key="section.hash" class="text-xs text-white">
        <RouterLink
          :to="{ hash: section.hash }"
          class="block rounded-xl px-2 py-1 hover:bg-white/10 focus-visible:bg-white/15 focus-visible:outline-white"
          @click="emit('select')"
        >
          {{ section.label }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.toc-dropup {
  position: absolute;
  bottom: calc(100% + 0.5rem);
  left: 50%;
  transform: translateX(-50%);
  max-height: calc(100dvh - 5.25rem);
  background: var(--command-surface);
}
</style>
