<script setup>
import { ref } from "vue";

import { useTextReader } from "@/composables/useTextReader";
import { buildMembers, normalizeNames } from "@/utils/members";

import BaseButton from "@/components/ui/BaseButton.vue";


const props = defineProps({
  /** Maximum rows read from the file (see `useTextReader`). */
  maxRows: { type: Number, default: 35 },
  /** Maximum characters kept per row (see `useTextReader`). */
  maxRowLength: { type: Number, default: 150 },
});

// v-model: the clean member-name list owned by the parent view.
const model = defineModel({ type: Array, default: () => [] });

const fileInput = ref(null);
const fileName = ref("");

const { rows, error, isReading, read } = useTextReader(
  null,
  props.maxRows,
  props.maxRowLength,
);

function pick() {
  fileInput.value?.click();
}

async function onFileChange(event) {
  const file = event.target.files?.[0] ?? null;
  fileName.value = file?.name ?? "";

  if (!file) return;

  await read(file);

  // Reset the input so selecting the same file again fires `change` again.
  if (fileInput.value) fileInput.value.value = "";

  if (error.value) return;

  const normalizedNames = normalizeNames(rows.value);
  model.value = buildMembers(normalizedNames);
}
</script>

<template>
  <div class="space-y-3">
    <input
      ref="fileInput"
      type="file"
      accept=".txt,text/plain"
      class="sr-only"
      aria-label="Carica un file di testo con i nomi dei membri"
      @change="onFileChange"
    />

    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="eyebrow">Carica il file</p>
        <p class="mt-1 text-sm text-muted">
          Le righe vuote vengono ignorate.
        </p>
      </div>

      <BaseButton variant="solid" :disabled="isReading" @click="pick">
        {{ isReading ? "Lettura…" : "Scegli file" }}
      </BaseButton>
    </div>

    <p v-if="error" class="text-sm text-reject" role="alert">
      {{ error.message }}
    </p>
  </div>
</template>
