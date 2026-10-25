import { computed } from "vue";

/**
 * Selection state for a single preference category (likes or dislikes).
 *
 * Both interactions share the same v-model contract: the selected ids are read
 * from `modelValue` and written back through `emit("update:modelValue")`, so the
 * parent stays the single source of truth. Kept as a composable so the toggle
 * and keyboard-toggle rules are unit-testable without mounting a component.
 *
 * @param {object} options
 * @param {import('vue').Ref<string>} options.query - The search query text.
 * @param {import('vue').Ref<Array<{ id: string }>>} options.filteredMembers - Members shown by the current filter.
 * @param {import('vue').Ref<string[]>} options.modelValue - The selected member ids (v-model source).
 * @param {Function} options.emit - The component's emit function.
 * @returns {{ selectedIds: import('vue').ComputedRef<string[]>, toggle: Function, toggleFiltered: Function }}
 */
export function useSociogramPreferencesSelection({
    query,
    filteredMembers,
    modelValue,
    emit,
}) {
    const selectedIds = computed({
        get: () => modelValue.value ?? [],
        set: (value) => emit("update:modelValue", value),
    });

    function toggle(member) {
        const current = selectedIds.value;
        selectedIds.value = current.includes(member.id)
            ? current.filter((id) => id !== member.id)
            : [...current, member.id];
    }

    function toggleFiltered() {
        // Only act on an explicit, non-empty query; an empty (or whitespace)
        // query means "show everyone", so Enter would otherwise toggle the first
        // member of the roster without a deliberate search.
        if (query.value.trim() === "") return;

        const first = filteredMembers.value[0];
        if (!first) return;

        // Toggle only the top result. Adding one member at a time keeps the
        // preference list in the order the user builds it, which several
        // metrics (e.g. bonus/malus) rely on.
        toggle(first);
        query.value = "";
    }

    return { selectedIds, toggle, toggleFiltered };
}
