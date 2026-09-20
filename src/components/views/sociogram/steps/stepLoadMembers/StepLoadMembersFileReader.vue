<script setup>
// --- Vue ----------------
import { ref } from "vue";

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import BaseButton from "@/components/ui/BaseButton.vue";

// --- Composables --------
import {
    useSociogramTextReader,
    DEFAULT_MAX_FILE_SIZE,
} from "@/composables/sociogram/useSociogramTextReader";
import { buildMembers, normalizeNames } from "@/utils/sociogram/memberHelpers";

// --- Props --------------
const props = defineProps({
  /** Maximum bytes read from the file (see `useSociogramTextReader`). */
  maxFileSize: { type: Number, default: DEFAULT_MAX_FILE_SIZE },
  /** Maximum lines read from the file (see `useSociogramTextReader`). */
  maxLines: { type: Number, default: 35 },
  /** Maximum characters kept per line (see `useSociogramTextReader`). */
  maxLineLength: { type: Number, default: 150 },
});

// v-model: the clean member-name list owned by the parent view.
const model = defineModel({ type: Array, default: () => [] });

// --- Emits --------------

// --- State --------------
const fileInput = ref(null);
const fileName = ref("");

const { lines, readError, isReadingFile, readFile } = useSociogramTextReader(
  null,
  props.maxFileSize,
  props.maxLines,
  props.maxLineLength,
);

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
function pick() {
  fileInput.value?.click();
}

async function onFileChange(event) {
  const file = event.target.files?.[0] ?? null;
  fileName.value = file?.name ?? "";

  if (!file) return;

  await readFile(file);

  // Reset the input so selecting the same file again fires `change` again.
  if (fileInput.value) fileInput.value.value = "";

  if (readError.value) return;

  const normalizedNames = normalizeNames(lines.value).sort();
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
          Il file deve contenere un elenco di nomi, uno per riga.
        </p>
      </div>

      <BaseButton variant="solid" :disabled="isReadingFile" @click="pick">
        {{ isReadingFile ? "Lettura…" : "Scegli file" }}
      </BaseButton>
    </div>

    <p v-if="readError" class="text-sm text-reject" role="alert">
      {{ readError.message }}
    </p>
  </div>
</template>
