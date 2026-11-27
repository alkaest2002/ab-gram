<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
import { computed, ref } from "vue";

import { storeToRefs } from "pinia";

import { useGroupStore } from "@/stores/group";

import StepHeader from "@/components/views/group/common/StepHeader.vue";
import StepsNavigation from "@/components/views/group/common/stepsNavigation.vue";
import BaseTextFileReader from "@/components/ui/BaseTextFileReader.vue";
import FileReadResult from "@/components/views/group/common/FileReadResult.vue";
import LoadMembersOrderNamesRadioGroup from "@/components/views/group/steps/stepLoadMembers/LoadMembersOrderNamesRadioGroup.vue";

import { useGroupNavigation } from "@/composables/groups/useGroupNavigation";

import { buildMembers, normalizeNames, orderNames } from "@/utils/group/memberHelpers";

// --- Props --------------

// --- Emits --------------
const emit = defineEmits(["group-go-to-step", "group-restart-app"]);

// --- Routers ------------

// --- Stores -------------
// Get the group store and its state.
const groupStore = useGroupStore();
const { maxMemberNameLength, maxMembersCount, membersCount } = storeToRefs(groupStore);

// --- State --------------
const loadFileName = ref("");
const loadError = ref(null);
const loadedCount = ref(null);

// How imported names are ordered: "as-is" keeps the file order,
// "alphabetical" sorts them lexicographically, "shuffle" randomizes them.
const orderMode = ref("as-is");

// --- Composables --------
const { goToStep, restart } = useGroupNavigation(emit);

// --- Computed -----------
// The load step only needs at least one member to advance. Blank or duplicated
// names are reviewed and fixed in the following "manage members" step.
const hasLoaded = computed(() => membersCount.value > 0);

const loadedSummary = computed(() => {
  if (loadedCount.value === null) return "";
  const label = loadedCount.value === 1 ? "nome caricato" : "nomi caricati";
  return `${loadedCount.value} ${label}`;
});

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
function onFileSelected({ filename }) {
  loadFileName.value = filename;
  loadError.value = null;
  loadedCount.value = null;
}

function onFileRead({ lines }) {
  const normalizedNames = normalizeNames(lines);
  const orderedNames = orderNames(normalizedNames, orderMode.value);
  const loadedMembers = buildMembers(orderedNames);
  groupStore.initMembers(loadedMembers);
  loadedCount.value = loadedMembers.length;
}

function onFileReadError({ message }) {
  loadError.value = message;
}
</script>

<template>
  <section class="card space-y-6">
    <StepHeader>
      <template #eyebrow>Passaggio 1 di 4</template>
      <template #title>Carica l'elenco dei nominativi</template>
      Il file di testo deve contenere un elenco di nominativi (min
      {{ groupStore.minMembersCount }}, max {{ groupStore.maxMembersCount }}). Ogni nominativo è
      limitato a {{ groupStore.maxMemberNameLength }} caratteri.
    </StepHeader>

    <div class="h-px w-full bg-line" aria-hidden="true"></div>

    <LoadMembersOrderNamesRadioGroup v-model="orderMode" />

    <div class="h-px w-full bg-line" aria-hidden="true"></div>

    <BaseTextFileReader
      :max-line-length="maxMemberNameLength"
      :max-lines="maxMembersCount"
      @file-selected="onFileSelected"
      @file-read="onFileRead"
      @file-read-error="onFileReadError"
    >
      <template #label>{{ membersCount > 0 ? "Carica un altro file" : "Carica il file" }}</template>
      Elenco dei nominativi (es., Rossi Mario), uno per riga.
    </BaseTextFileReader>

    <FileReadResult :count="loadedCount" :error="loadError">
      <p class="text-sm font-medium text-ink">{{ loadFileName }}</p>
      <p class="text-sm text-muted">{{ loadedSummary }}.</p>
    </FileReadResult>
  </section>

  <StepsNavigation
    :enable-previous="true"
    :enable-next="hasLoaded"
    :enable-archive="hasLoaded"
    :enable-restart="hasLoaded"
    @group-navigation-previous="goToStep('createProject')"
    @group-navigation-next="goToStep('manageMembers')"
    @group-navigation-restart="restart"
  />
</template>
