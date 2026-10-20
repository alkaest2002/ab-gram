<script setup>
// --- Imports ------------
//   -- From vue
import { computed } from "vue";

// --- Props --------------
const props = defineProps({
    // Whether the modal is visible.
    open: { type: Boolean, default: false },
    // Whether a regeneration is running: disables the form and swaps the
    // cancel/submit buttons for an interrupt button.
    regenerating: { type: Boolean, default: false },
    error: { type: String, default: "" },
    // ForceAtlas2 settings, bound two-way from the parent container.
    scalingRatio: { type: Number, default: 0.6 },
    gravity: { type: Number, default: 1.1 },
});

// --- Emits --------------
const emit = defineEmits([
    "update:scalingRatio",
    "update:gravity",
    "close",
    "stop",
    "confirm",
]);

// --- Routers ------------

// --- Stores -------------

// --- State --------------

// --- Composables --------

// --- Computed -----------
// v-model: read each setting from its prop and write it back by emitting
// `update:*`, so the parent container stays the single source of truth.
const scalingRatio = computed({
    get: () => props.scalingRatio,
    // `v-model.number` leaves the raw string in place when the field is cleared
    // (`looseToNumber` returns `""` for `NaN`), which would emit a String to a
    // Number prop. Coerce back to a number so the parent always receives one;
    // an empty field falls back to `0`, matching the input's `min="0"`.
    set: (value) => emit("update:scalingRatio", Number(value) || 0),
});
const gravity = computed({
    get: () => props.gravity,
    set: (value) => emit("update:gravity", Number(value) || 0),
});

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <!-- Teleported to <body> so it escapes the fixed-height, overflow-hidden
         report page that would otherwise clip it. -->
    <Teleport to="body">
        <div
            v-if="open"
            class="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 print:hidden"
            @click.self="emit('close')"
        >
            <div
                class="w-full max-w-sm rounded-xl border border-line bg-canvas p-5 shadow-xl"
                role="dialog"
                aria-modal="true"
                aria-labelledby="sna-regenerate-title"
            >
                <h3 id="sna-regenerate-title" class="font-display text-[13pt] font-bold text-ink">
                    Rigenera il grafico
                </h3>
                <p class="mt-1 text-[8.5pt] leading-snug text-muted">
                    Modifica i parametri di ForceAtlas2 e ricostruisci la disposizione dei nodi.
                </p>

                <form class="mt-4 space-y-3" @submit.prevent="emit('confirm')">
                    <label class="block">
                        <span class="font-mono text-[8pt] font-medium tracking-[0.08em] uppercase text-muted">
                            Scaling ratio
                        </span>
                        <input
                            v-model.number="scalingRatio"
                            type="number"
                            step="0.1"
                            min="0"
                            :disabled="regenerating"
                            class="mt-1 w-full rounded-md border border-line bg-canvas px-3 py-1.5 text-[10pt] text-ink outline-none transition-colors focus:border-accent disabled:opacity-50"
                        />
                    </label>

                    <label class="block">
                        <span class="font-mono text-[8pt] font-medium tracking-[0.08em] uppercase text-muted">
                            Gravity
                        </span>
                        <input
                            v-model.number="gravity"
                            type="number"
                            step="0.1"
                            min="0"
                            :disabled="regenerating"
                            class="mt-1 w-full rounded-md border border-line bg-canvas px-3 py-1.5 text-[10pt] text-ink outline-none transition-colors focus:border-accent disabled:opacity-50"
                        />
                    </label>

                    <p v-if="error" class="text-[8.5pt] text-reject">{{ error }}</p>

                    <div class="flex justify-end gap-2 pt-1">
                        <button
                            v-if="!regenerating"
                            type="button"
                            class="rounded-md px-3 py-1.5 text-[9pt] font-medium text-muted transition-colors hover:bg-line hover:text-ink"
                            @click="emit('close')"
                        >
                            Annulla
                        </button>
                        <button
                            v-if="regenerating"
                            type="button"
                            class="rounded-md bg-reject px-3 py-1.5 text-[9pt] font-medium text-white transition-opacity hover:opacity-90"
                            @click="emit('stop')"
                        >
                            Interrompi
                        </button>
                        <button
                            v-else
                            type="submit"
                            class="rounded-md bg-accent px-3 py-1.5 text-[9pt] font-medium text-white transition-opacity hover:opacity-90"
                        >
                            Rigenera
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </Teleport>
</template>
