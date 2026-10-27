<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From vue
import { computed, toRef } from "vue";

//   -- From components
import WarningIcon from "@/components/ui/icons/WarningIcon.vue";

//   -- From composables
import { useSociogramSearchMembers } from "@/composables/sociogram/useSociogramSearchMembers";
import { useSociogramPreferencesSelection } from "@/composables/sociogram/useSociogramSelectPreferences";

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
     * Member ids selected in the opposite preference. They are not disabled:
     * a member may be both liked and disliked. One that appears in both this
     * list and the opposite one is highlighted as a conflict.
     */
    opposingIds: { type: Array, default: () => [] },
});

// --- Emits --------------
const emit = defineEmits(["update:modelValue"]);

// --- Routers ------------

// --- Stores -------------

// --- State --------------
// Members that can actually be chosen: everyone except the subject themselves.
const selectableMembers = computed(() => props.members.filter((member) => member.id !== props.selfId));

// --- Composables --------
// Search state and the ranked result list, shared via the search composable.
const { query, filteredMembers } = useSociogramSearchMembers(selectableMembers);

// Selection state: v-model reads `modelValue` and writes back through
// `update:modelValue`, so the parent stays the single source of truth.
const modelValue = toRef(props, "modelValue");
const { selectedIds, toggle, toggleFiltered } = useSociogramPreferencesSelection({
    query,
    filteredMembers,
    modelValue,
    emit,
});

// Optimize: use a Set for faster lookups.
const selected = computed(() => new Set(selectedIds.value));
const opposing = computed(() => new Set(props.opposingIds));

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

// A member selected in both preferences: still allowed, but flagged so the
// user can see the overlap at a glance.
function isConflicting(member) {
    return selected.value.has(member.id) && opposing.value.has(member.id);
}

function clearQuery() {
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
            @keydown.enter.prevent="toggleFiltered"
            @keydown.esc="clearQuery"
        />

        <p v-if="!hasMembers" class="text-sm text-muted">
            Nessuna persona caricata.
        </p>

        <ul
            v-else-if="filteredMembers.length > 0"
            class="list-none divide-y divide-line rounded-lg border border-line"
        >
            <li v-for="(member) in filteredMembers" :key="member.id">
                <label
                    class="flex cursor-pointer items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-ink/5"
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
                        :aria-label="`${preference === 'likes' ? 'Mi piace' : 'Non mi piace'} ${member.name}`"
                        @change="toggle(member)"
                    />
                    <span class="truncate text-ink">{{ member.name }}</span>
                    <span
                        v-if="isConflicting(member)"
                        class="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[0.65rem] font-medium text-muted"
                        title="Selezionato sia tra le scelte che tra i rifiuti"
                    >
                        <WarningIcon size="size-4" :stroke-width="2" />
                    </span>
                </label>
            </li>
        </ul>

        <p v-else-if="!hasSelectableMembers" class="text-sm text-muted">
            Nessun membro del gruppo da selezionare.
        </p>

        <p v-else class="text-sm text-muted">
            Nessun membro del gruppo corrisponde alla ricerca.
        </p>
    </div>
</template>
