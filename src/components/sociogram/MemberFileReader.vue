<script setup>
import { ref } from "vue";

import BaseButton from "@/components/ui/BaseButton.vue";
import { useTextReader } from "@/composables/useTextReader";
import { normalizeNames } from "@/utils/members";

const props = defineProps({
  /** Maximum rows read from the file (see `useTextReader`). */
  maxRows: { type: Number, default: 35 },
  /** Maximum characters kept per row (see `useTextReader`). */
  rowLength: { type: Number, default: 150 },
});

// v-model: the clean member-name list owned by the parent view.
const model = defineModel({ type: Array, default: () => [] });

const fileInput = ref(null);
const fileName = ref("");

const { rows, error, isReading, read } = useTextReader(
  null,
  props.rowLength,
  props.maxRows
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

  model.value = normalizeNames(rows.value);
}
</script>

<template>
  <div class="space-y-2">
    <input
      ref="fileInput"
      type="file"
      accept=".txt,text/plain"
      class="sr-only"
      aria-label="Carica un file di testo con i nomi dei membri"
      @change="onFileChange"
    />

    <div class="flex flex-wrap items-center gap-2">
      <BaseButton variant="outline" :disabled="isReading" @click="pick">
        {{ isReading ? "Lettura in corso…" : "Scegli file" }}
      </BaseButton>

      <span v-if="fileName" class="font-mono text-xs text-muted">
        {{ fileName }}
      </span>
    </div>

    <p v-if="error" class="text-sm text-reject" role="alert">
      {{ error.message }}
    </p>
  </div>
</template>
