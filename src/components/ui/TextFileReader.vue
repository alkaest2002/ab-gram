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

// --- State --------------
const fileInput = ref(null);
const fileName = ref("");

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

    emit("file-selected", { name: file.name });

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
                    <slot name="label">Carica un file</slot>
                </p>
                <p class="mt-1 text-sm text-muted">
                    <slot>
                        Il file deve contenere dati validi.
                    </slot>
                </p>
            </div>

            <BaseButton variant="solid" :disabled="isReadingFile" @click="pick">
                {{ isReadingFile ? "Lettura…" : "Scegli file" }}
            </BaseButton>
        </div>

        <div
            v-if="fileName"
            class="inline-flex max-w-full items-center gap-2 rounded-md border border-line px-2.5 py-1.5"
        >
            <svg
                viewBox="0 0 24 24"
                class="size-4 shrink-0 fill-none stroke-current stroke-[1.75] text-muted"
                aria-hidden="true"
            >
                <path
                    d="M7 3.5h7l4 4v13H7z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
                <path
                    d="M14 3.5V8h4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
            <span class="truncate font-mono text-xs font-medium text-ink">
                {{ fileName }}
            </span>
        </div>
    </div>
</template>
