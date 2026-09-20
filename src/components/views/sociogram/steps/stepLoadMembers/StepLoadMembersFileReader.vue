<script setup>
// --- Vue ----------------
import { ref } from "vue";

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import BaseButton from "@/components/ui/BaseButton.vue";

// --- Composables --------
import { useSociogramTextReader } from "@/composables/sociogram/useSociogramTextReader";
import { buildMembers, normalizeNames } from "@/utils/sociogram/memberHelpers";

// --- Props --------------
const props = defineProps({
  /** Maximum rows read from the file (see `useSociogramTextReader`). */
  maxRows: { type: Number, default: 35 },
  /** Maximum characters kept per row (see `useSociogramTextReader`). */
  maxRowLength: { type: Number, default: 150 },
});

// v-model: the clean member-name list owned by the parent view.
const model = defineModel({ type: Array, default: () => [] });

// --- Emits --------------

// --- State --------------
const fileInput = ref(null);
const fileName = ref("");

const { rows, error, isReading, read } = useSociogramTextReader(
  null,
  props.maxRows,
  props.maxRowLength,
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

  await read(file);

  // Reset the input so selecting the same file again fires `change` again.
  if (fileInput.value) fileInput.value.value = "";

  if (error.value) return;

  const normalizedNames = normalizeNames(rows.value).sort();
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

      <BaseButton variant="solid" :disabled="isReading" @click="pick">
        {{ isReading ? "Lettura…" : "Scegli file" }}
      </BaseButton>
    </div>

    <p v-if="error" class="text-sm text-reject" role="alert">
      {{ error.message }}
    </p>
  </div>
</template>
