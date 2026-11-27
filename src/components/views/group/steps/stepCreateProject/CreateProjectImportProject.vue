<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
import { useGroupStore } from "@/stores/group";

import BaseClickButton from "@/components/ui/BaseClickButton.vue";

import hogwartsDemo from "@/utils/group/hogwarts.json";

// --- Props --------------

// --- Emits --------------
const emit = defineEmits(["group-start-import-project", "group-start-demo"]);

// --- Routers ------------

// --- Stores -------------
const groupStore = useGroupStore();

// --- State --------------

// --- Composables --------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
/**
 * Load the bundled demo group into the store.
 * Members are cloned so later edits never mutate the imported module data.
 */
function loadDemo() {
  groupStore.initMembers(
    hogwartsDemo.map((member) => ({
      id: member.id,
      name: member.name,
      likes: [...(member.likes ?? [])],
      dislikes: [...(member.dislikes ?? [])],
      noLikes: member.noLikes,
      noDislikes: member.noDislikes,
    })),
  );
  emit("group-start-demo");
}
</script>

<template>
  <div class="space-y-1">
    <p class="eyebrow">Progetto archiviato</p>
    <h3>Importa i dati archiviati</h3>
    <p class="text-sm">
      Riprendi un progetto salvato in precedenza, esattamente da dove lo avevi lasciato.
    </p>
  </div>
  <div class="flex flex-wrap gap-2">
    <BaseClickButton button-variant="outline" @click="emit('group-start-import-project')">
      <template #icon>
        <svg
          class="size-4 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M12 3v12" />
          <path d="m17 8-5-5-5 5" />
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        </svg>
      </template>
      Importa progetto
    </BaseClickButton>
    <BaseClickButton button-variant="outline" @click="loadDemo">
      <template #icon>
        <svg
          class="size-4 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <rect width="20" height="5" x="2" y="3" rx="1" />
          <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
          <path d="M10 12h4" />
        </svg>
      </template>
      Dati demo
    </BaseClickButton>
  </div>
</template>
