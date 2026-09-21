<script setup>
// --- Vue ----------------
import { ref } from "vue";

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import TextFileReader from "@/components/ui/TextFileReader.vue";

// --- Composables --------
import { DEFAULT_MAX_FILE_SIZE } from "@/composables/sociogram/useSociogramTextReader";
import { buildMembers, normalizeNames } from "@/utils/sociogram/memberHelpers";

// --- Props --------------
defineProps({
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
const readError = ref(null);

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
function onFileSelected() {
  readError.value = null;
}

function onFileRead({ lines }) {
  readError.value = null;
  const normalizedNames = normalizeNames(lines).sort();
  model.value = buildMembers(normalizedNames);
}

function onFileReadError({ message }) {
  readError.value = message;
}
</script>

<template>
  <div class="space-y-3">
    <TextFileReader
      :max-file-size="maxFileSize"
      :max-lines="maxLines"
      :max-line-length="maxLineLength"
      @file-selected="onFileSelected"
      @file-read="onFileRead"
      @file-read-error="onFileReadError"
    >
      <template #label>Carica il file</template>
      Il file deve contenere un elenco di nomi, uno per riga.
    </TextFileReader>

    <p v-if="readError" class="text-sm text-reject" role="alert">
      {{ readError }}
    </p>
  </div>
</template>
