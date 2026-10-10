<script setup>
// --- Vue ----------------
import { computed, useId } from "vue";

// --- Routers ------------

// --- Stores -------------

// --- Components ---------

// --- Composables --------

// --- Props --------------
const props = defineProps({
    /**
     * The selected ordering mode. Bound with `v-model`: read here, written
     * back through `update:modelValue`.
     */
    modelValue: {
        type: String,
        default: "as-is",
        validator: (value) => ["as-is", "alphabetical", "shuffle"].includes(value),
    },
});

// --- Emits --------------
const emit = defineEmits(["update:modelValue"]);

// --- State --------------
// Unique name for the radio group, so multiple instances never share the same
// radio group in the DOM.
const groupName = useId();

// --- Computed -----------
// v-model: read the selected mode from `modelValue` and write it back by
// emitting `update:modelValue`, so the parent stays the single source of truth.
const selected = computed({
    get: () => props.modelValue,
    set: (value) => emit("update:modelValue", value),
});

const options = [
    { value: "as-is", label: "Mantienti l'ordine del file" },
    { value: "alphabetical", label: "Ordina alfabeticamente" },
    { value: "shuffle", label: "Mescola in modo casuale" },
];

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <fieldset class="space-y-2">
        <legend class="eyebrow">Ordinamento dei nominativi</legend>
        <div class="space-y-2">
            <label
                v-for="option in options"
                :key="option.value"
                class="flex items-start gap-3"
            >
                <input
                    type="radio"
                    :name="groupName"
                    :value="option.value"
                    class="mt-0.5 size-4 shrink-0 accent-accent"
                    v-model="selected"
                />
                <span class="text-sm text-muted">{{ option.label }}</span>
            </label>
        </div>
    </fieldset>
</template>
