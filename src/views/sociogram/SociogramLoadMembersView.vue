<script setup>
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";

import BaseButton from "@/components/ui/BaseButton.vue";
import StepHeader from "@/components/ui/StepHeader.vue";
import MemberFileReader from "@/components/sociogram/MemberFileReader.vue";
import MemberListEditor from "@/components/sociogram/MemberListEditor.vue";
import { useSociogramStore } from "@/stores/sociogram";
import { buildMembers, normalizeNames } from "@/utils/members";

// Get the sociogram store and its state.
const sociogram = useSociogramStore();
const { hasMembers, membersCount, members } = storeToRefs(sociogram);

// Flag for editor mode and member list state.
const isEditing = ref(false);

// Computed values.
const editorMode = computed(() => (isEditing.value ? "edit" : "view"));
const membersCountLabel = computed(() =>
  membersCount.value === 1
    ? "1 nome caricato"
    : `${membersCount.value} nomi caricati`
);

// Toggle the editing mode.
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
            {{ membersCountLabel }}
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

      <MemberListEditor
        :members="members"
        :mode="editorMode"
        @update:member="sociogram.updateMember"
        @remove:member="sociogram.removeMember"
      />
    </div>
  </section>
</template>
