<script setup>
// --- Vue ----------------
import { computed } from "vue";

// --- Routers ------------

// --- Stores -------------

// --- Components ---------

// --- Composables --------
import { useSociogramSearchMembers } from "@/composables/sociogram/useSociogramSearchMembers";

// --- Props --------------
const props = defineProps({
    /**
     * The member ids currently selected in this preference. Bound with
     * `v-model`: read here, written back through `update:modelValue`.
     */
    modelValue: { type: Array, default: () => [] },

    /**
     * Which preference this control edits. Drives the checkbox tone ("likes"
     * reads blue, "dislikes" reads red) and the accessibility labels.
     */
    preference: {
        type: String,
        required: true,
        validator: (value) => ["likes", "dislikes"].includes(value),
    },

    /** Human-readable heading shown above the search box. */
    label: { type: String, required: true },

    /**
     * Id of the member these preferences belong to. That member is hidden from
     * the list, since a member cannot like or dislike themselves.
     */
    selfId: { type: String, required: true },

    /** Full list of members the user can pick from. */
    members: { type: Array, default: () => [] },

    /**
     * Member ids already selected in the opposite preference. They are listed
     * but disabled here, which is what keeps a person from being liked and
     * disliked at the same time.
     */
    excludedIds: { type: Array, default: () => [] },
});

// --- Emits --------------
const emit = defineEmits(["update:modelValue"]);

// --- State --------------

// --- Computed -----------
// v-model: read the ids from `modelValue` and write them back by emitting
// `update:modelValue`, so the parent stays the single source of truth.
const selectedIds = computed({
    get: () => props.modelValue ?? [],
    set: (value) => emit("update:modelValue", value),
});

// Members that can actually be chosen: everyone except the subject themselves.
const selectableMembers = computed(() => props.members.filter((member) => member.id !== props.selfId));

// Search state and the ranked result list, shared via the search composable.
const { query, filteredMembers } = useSociogramSearchMembers(selectableMembers);

const selected = computed(() => new Set(selectedIds.value));
const excluded = computed(() => new Set(props.excludedIds));
const hasMembers = computed(() => props.members.length > 0);
const hasSelectableMembers = computed(() => selectableMembers.value.length > 0);

const selectedCountLabel = computed(() => {
    const count = selectedIds.value.length;
    return count === 1 ? "1 selezionato" : `${count} selezionati`;
});

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
function isChecked(member) {
    return selected.value.has(member.id);
}

function isDisabled(member) {
    return excluded.value.has(member.id);
}

function toggle(member) {
    if (isDisabled(member)) return;

    const current = selectedIds.value;
    selectedIds.value = isChecked(member)
        ? current.filter((id) => id !== member.id)
        : [...current, member.id];
}

function handleEnter() {
    const targets = filteredMembers.value.filter(
        (member) => !isDisabled(member),
    );
    if (targets.length === 0) return;

    const current = selectedIds.value;
    const targetIds = new Set(targets.map((member) => member.id));

    // Flip each target: drop the checked ids, add the unchecked ones.
    selectedIds.value = [
        ...current.filter((id) => !targetIds.has(id)),
        ...targets
            .filter((member) => !current.includes(member.id))
            .map((member) => member.id),
    ];
    query.value = "";
}
</script>

<template>
    <div class="space-y-3">
        <div class="flex items-baseline justify-between gap-3">
            <p class="eyebrow">{{ label }}</p>
            <p class="font-mono text-xs text-muted">{{ selectedCountLabel }}</p>
        </div>

        <input
            v-model="query"
            type="text"
            class="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink transition-colors outline-none focus:border-accent"
            placeholder="Cerca un nome…"
            :aria-label="`Cerca tra i membri per ${label}`"
            @keydown.enter.prevent="handleEnter"
        />

        <p v-if="!hasMembers" class="text-sm text-muted">
            Nessuna persona caricata.
        </p>

        <ul
            v-else-if="filteredMembers.length > 0"
            class="list-none divide-y divide-line rounded-lg border border-line"
        >
            <li v-for="member in filteredMembers" :key="member.id">
                <label
                    class="flex items-center gap-3 px-3 py-2 text-sm transition-colors"
                    :class="
                        isDisabled(member)
                            ? 'cursor-not-allowed opacity-45'
                            : 'cursor-pointer hover:bg-ink/5'
                    "
                >
                    <input
                        type="checkbox"
                        class="size-4 shrink-0"
                        :class="
                            preference === 'likes'
                                ? 'accent-accent'
                                : 'accent-reject'
                        "
                        :checked="isChecked(member)"
                        :disabled="isDisabled(member)"
                        :aria-label="`${preference === 'likes' ? 'Mi piace' : 'Non mi piace'} ${member.name}`"
                        @change="toggle(member)"
                    />
                    <span class="truncate text-ink">{{ member.name }}</span>
                </label>
            </li>
        </ul>

        <p v-else-if="!hasSelectableMembers" class="text-sm text-muted">
            Nessun altro membro del gruppo da selezionare.
        </p>

        <p v-else class="text-sm text-muted">
            Nessun membro del gruppo corrisponde alla ricerca.
        </p>
    </div>
</template>
