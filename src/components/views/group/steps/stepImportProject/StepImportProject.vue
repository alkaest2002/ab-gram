<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
import { computed, ref } from "vue";

import { useGroupStore } from "@/stores/group";

import StepHeader from "@/components/views/group/common/StepHeader.vue";
import GroupNavigation from "@/components/views/group/common/GroupNavigation.vue";
import BaseTextFileReader from "@/components/ui/BaseTextFileReader.vue";
import FileReadResult from "@/components/views/group/common/FileReadResult.vue";

import { useGroupNavigation } from "@/composables/groups/useGroupNavigation";
import { useGroupValidateData } from "@/composables/groups/useGroupValidateData";

// --- Props --------------

// --- Emits --------------
const emit = defineEmits(["group-go-to-step", "group-restart-app"]);

// --- Routers ------------

// --- Stores -------------
const groupStore = useGroupStore();

// --- State --------------
const importFilename = ref(null);
const importError = ref(null);
const importedCount = ref(null);

// --- Composables --------
const { validate } = useGroupValidateData();
const { goToStep, restart } = useGroupNavigation(emit);

// --- Computed -----------
const hasImported = computed(() => importedCount.value !== null);

const importedSummary = computed(() => {
  if (importedCount.value === null) return "";
  const label = importedCount.value === 1 ? "membro importato" : "membri importati";
  return `${importedCount.value} ${label}`;
});

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
// Base64-decode a UTF-8 string, mirroring `encodeBase64` in useGroupDownloadArchive.
function decodeBase64(value) {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function onFileSelected({ filename }) {
  importFilename.value = filename;
  importError.value = null;
  importedCount.value = null;
}

function onFileRead({ lines }) {
  try {
    const json = decodeBase64(lines.join("").trim());
    const parsed = JSON.parse(json);

    const result = validate(parsed);
    if (!result.isValid) {
      importError.value = result.errors.join(" ");
      return;
    }

    // Replace the store state with the validated snapshot: reset first, then
    // copy each known state key out of the loaded json.
    groupStore.resetStore();
    for (const key of Object.keys(groupStore.$state)) {
      if (key in result.data) {
        groupStore.$state[key] = result.data[key];
      }
    }

    importedCount.value = result.data.members.length;
  } catch {
    importError.value = "Il file non è un archivio sociogramma valido.";
  }
}

function onFileReadError({ message }) {
  importError.value = message;
}
</script>

<template>
  <section class="card space-y-6">
    <StepHeader>
      <template #eyebrow>Passaggio 1 di 4</template>
      <template #title>Vuoi riprendere un progetto archiviato?</template>
      Se hai già salvato un sociogramma, puoi ricaricarlo da un file archiviato. In alternativa
      prosegui per crearne uno nuovo.
    </StepHeader>

    <div class="h-px w-full bg-line" aria-hidden="true"></div>

    <BaseTextFileReader
      @file-selected="onFileSelected"
      @file-read="onFileRead"
      @file-read-error="onFileReadError"
    >
      <template #label>Importa da file</template>
      Il file deve contenere un archivio valido.
    </BaseTextFileReader>

    <FileReadResult :count="importedCount" :error="importError">
      <p class="text-sm font-medium text-ink">{{ importFilename }}</p>
      <p class="text-sm text-muted">{{ importedSummary }}.</p>
    </FileReadResult>
  </section>

  <GroupNavigation
    :enable-previous="true"
    :enable-next="hasImported"
    :enable-archive="hasImported"
    :enable-restart="hasImported"
    @group-navigation-previous="goToStep('createProject')"
    @group-navigation-next="goToStep('manageMembers')"
    @group-navigation-restart="restart"
  />
</template>
