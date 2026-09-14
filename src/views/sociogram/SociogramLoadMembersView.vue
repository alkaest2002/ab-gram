<script setup>
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";

import BaseButton from "@/components/ui/BaseButton.vue";
import StepHeader from "@/components/ui/StepHeader.vue";
import MemberFileReader from "@/components/sociogram/MemberFileReader.vue";
import MemberListEditor from "@/components/sociogram/MemberListEditor.vue";
import { useSociogramStore } from "@/stores/sociogram";
import { buildMembers, normalizeNames } from "@/utils/members";

const sociogram = useSociogramStore();
const { dataLoaded, dataMembers, membersCount } = storeToRefs(sociogram);

// Local source of truth for this step. Seed it from the store so a revisit
// keeps showing what was already loaded.
const members = ref(
  dataLoaded.value.length
    ? [...dataLoaded.value]
    : dataMembers.value.map((member) => member.name)
);

// Flag for editor mode and member list state.
const isEditing = ref(false);

// Computed values for editor mode and member list state.
const editorMode = computed(() => (isEditing.value ? "edit" : "view"));
const hasMembers = computed(() => members.value.length > 0);
const membersLabel = computed(() =>
  membersCount.value === 1
    ? "1 nome caricato"
    : `${membersCount.value} nomi caricati`
);

// Push every local change into the store, keeping raw names and parsed members
// in sync. No `immediate`: merely revisiting the step must not rebuild members
// (and drop any data a later step may have added).
watch(
  members,
  (names) => {
    const clean = normalizeNames(names);
    sociogram.setTextLoaded(clean);
    sociogram.setMembersData(buildMembers(clean));
  },
  { deep: true }
);

function toggleEditing() {
  isEditing.value = !isEditing.value;
}
</script>

<template>
  <section class="card space-y-6">
    <StepHeader eyebrow="Passaggio 1 di 3" title="Carica i membri">
      Carica un file di testo con un nome per riga, poi &mdash; se necessario &mdash; rivedi o modifica
      l'elenco prima di proseguire.
    </StepHeader>

    <div class="h-px w-full bg-line" aria-hidden="true"></div>

    <MemberFileReader v-model="members" />

    <div class="h-px w-full bg-line" aria-hidden="true"></div>

    <div class="space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="eyebrow">Elenco membri</p>
          <p v-if="membersCount > 0" class="mt-1 font-mono text-xs text-muted">
            {{ membersLabel }}
          </p>
        </div>

        <BaseButton
          v-if="hasMembers"
          variant="outline"
          @click="toggleEditing"
        >
          {{ isEditing ? "Fine modifica" : "Modifica nomi" }}
        </BaseButton>
      </div>

      <MemberListEditor v-model="members" :mode="editorMode" />
    </div>
  </section>
</template>
