<script setup>
// --- Imports ------------
//   -- From vue
import { ref } from "vue";

//   -- From components
import BaseButton from "@/components/ui/BaseButton.vue";
import FileIcon from "@/components/ui/icons/FileIcon.vue";

//   -- From composables
import {
    useSociogramTextReader,
    DEFAULT_MAX_FILE_SIZE,
} from "@/composables/sociogram/useSociogramTextReader";

// --- Props --------------
const props = defineProps({
    /** Maximum bytes read from the file (see `useSociogramTextReader`). */
    maxFileSize: { type: Number, default: DEFAULT_MAX_FILE_SIZE },
    /** Maximum lines read from the file, or `null` for no limit. */
    maxLines: { type: Number, default: null },
    /** Maximum characters kept per line, or `null` for no limit. */
    maxLineLength: { type: Number, default: null },
});

// --- Emits --------------
const emit = defineEmits([
    "file-selected",
    "file-read",
    "file-read-error",
]);

// --- Routers ------------

// --- Stores -------------

// --- State --------------
const fileInput = ref(null);
const fileName = ref(null);

// --- Composables --------
// Streams the file instead of loading it all at once, so a huge file is never
// held fully in memory — the byte ceiling is the safety limit.
const { lines, readError, isReadingFile, readFile } = useSociogramTextReader(null, {
    maxFileSize: props.maxFileSize,
    maxLines: props.maxLines,
    maxLineLength: props.maxLineLength,
});

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

    emit("file-selected", { filename: file.name });

    try {
        await readFile(file);

        if (readError.value) {
            emit("file-read-error", { message: readError.value.message });
            return;
        }

        emit("file-read", { lines: lines.value });
    } finally {
        // Reset the input so selecting the same file again fires `change` again.
        if (fileInput.value) fileInput.value.value = "";
    }
}
</script>

<template>
    <div class="space-y-3">
        <input
            ref="fileInput"
            type="file"
            accept=".txt,text/plain"
            class="sr-only"
            aria-label="Carica un file di testo"
            @change="onFileChange"
        />

        <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
                <p class="eyebrow">
                    <slot name="label">{{ fileName ? "Carica un altro file" : "Carica un file" }}</slot>
                </p>
                <p class="mt-1 text-sm text-muted">
                    <slot>
                        Il file deve contenere dati validi.
                    </slot>
                </p>
            </div>

            <BaseButton buttonVariant="solid" :disabled="isReadingFile" @click="pick">
                {{ isReadingFile ? "Lettura…" : "Scegli file" }}
            </BaseButton>
        </div>
    </div>
</template>
