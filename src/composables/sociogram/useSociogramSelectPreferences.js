// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

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
 * @param {(event: "update:modelValue", value: string[]) => void} options.emit - The component's emit function.
 * @returns {{
 *   selectedIds: import('vue').WritableComputedRef<string[]>,
 *   toggle: (member: { id: string }) => void,
 *   toggleFiltered: () => void,
 * }}
 */
export function useSociogramPreferencesSelection({ query, filteredMembers, modelValue, emit }) {
  const selectedIds = computed({
    get: () => modelValue.value ?? [],
    set: (value) => emit("update:modelValue", value),
  });

  /** @param {{ id: string }} member */
  function toggle(member) {
    const current = selectedIds.value;
    selectedIds.value = current.includes(member.id)
      ? current.filter((id) => id !== member.id)
      : [...current, member.id];
  }

  function toggleFiltered() {
    if (query.value.trim() === "") return;

    if (filteredMembers.value.length === 0) return;

    // Enter toggles one match at a time so the user controls preference order.
    toggle(filteredMembers.value[0]);

    query.value = "";
  }

  return { selectedIds, toggle, toggleFiltered };
}
