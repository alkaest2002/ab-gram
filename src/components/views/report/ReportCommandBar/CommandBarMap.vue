<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From vue.
import { nextTick, ref, useTemplateRef } from "vue";

//   -- From components.
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
    class="toc-dropup overflow-y-auto rounded-2xl p-1.5 font-medium shadow-lg print:hidden"
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
