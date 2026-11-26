<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
import { nextTick, ref, useTemplateRef } from "vue";
import MapTOC from "./MapTOC.vue";
import MapMembers from "./MapMembers.vue";

// --- Props --------------
defineProps({
  membersData: { type: Object, required: true },
});

// --- Emits --------------
const emit = defineEmits(["select"]);

// --- Routers ------------

// --- Stores -------------

// --- State --------------
const showingMembers = ref(false);
const panel = useTemplateRef("panel");

// --- Composables --------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
async function switchView(toMembers) {
  showingMembers.value = toMembers;
  await nextTick();
  panel.value?.querySelector("button")?.focus();
}
</script>

<template>
  <nav
    id="report-toc"
    ref="panel"
    :aria-label="showingMembers ? 'Membri' : 'Indice del report'"
    :class="showingMembers ? 'w-48' : 'w-32'"
    class="absolute bottom-full left-1/2 mb-2 max-h-[calc(100dvh_-_5.25rem)] -translate-x-1/2 overflow-y-auto rounded-2xl bg-(--command-surface) p-1.5 font-medium shadow-lg print:hidden"
  >
    <MapMembers
      v-if="showingMembers"
      :members="membersData.members"
      @back="switchView(false)"
      @select="emit('select')"
    />
    <MapTOC
      v-else
      :members-data="membersData"
      @show-members="switchView(true)"
      @select="emit('select')"
    />
  </nav>
</template>
