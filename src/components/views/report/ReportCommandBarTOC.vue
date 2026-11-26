<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps({
  membersData: { type: Object, required: true },
});

const emit = defineEmits(["select"]);
const sections = computed(() => {
  const links = [
    { label: "Nominativi", hash: "#listOfMembers" },
    { label: "Preferenze", hash: "#listOfPreferences" },
    { label: "Network scelte", hash: "#likesNetwork" },
  ];
  if (!props.membersData.allMembersHaveNoDislikes) {
    links.push({ label: "Network rifiuti", hash: "#dislikesNetwork" });
  }
  const firstMember = props.membersData.members?.[0];
  if (firstMember) links.push({ label: "Membri", hash: `#member${firstMember.id}` });
  links.push({ label: "Sommario", hash: "#summary" }, { label: "Glossario", hash: "#glossary" });
  return links;
});
</script>

<template>
  <nav
    id="report-toc"
    aria-label="Indice del report"
    class="toc-dropup w-32 overflow-y-auto rounded-2xl p-1.5 font-medium shadow-lg print:hidden"
  >
    <ul>
      <li v-for="section in sections" :key="section.hash" class="text-xs text-white">
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
