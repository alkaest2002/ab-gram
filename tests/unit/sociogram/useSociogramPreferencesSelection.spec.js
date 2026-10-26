import { ref } from "vue";
import { describe, it, expect, vi } from "vitest";

import { useSociogramSearchMembers } from "@/composables/sociogram/useSociogramSearchMembers.js";
import { useSociogramPreferencesSelection } from "@/composables/sociogram/useSociogramSelectPreferences.js";

const DEFAULT_MEMBERS = [
  { id: "alice", name: "Alice" },
  { id: "bob", name: "Bob" },
  { id: "carol", name: "Carol" },
];

/**
 * Instantiate the selection composable over the real search composable, so
 * `filteredMembers` reacts to `query` exactly as it does in the component. A
 * mock `emit` round-trips `update:modelValue` back into `selectedRef`, mirroring
 * how the parent's v-model updates the prop.
 */
function setup(members = DEFAULT_MEMBERS, selected = []) {
  const membersRef = ref([...members]);
  const { query, filteredMembers } = useSociogramSearchMembers(membersRef);

  const selectedRef = ref([...selected]);
  const emit = vi.fn((event, value) => {
    if (event === "update:modelValue") selectedRef.value = value;
  });

  const { selectedIds, toggle, toggleFiltered } =
    useSociogramPreferencesSelection({
      query,
      filteredMembers,
      modelValue: selectedRef,
      emit,
    });

  return { membersRef, query, selectedRef, emit, selectedIds, toggle, toggleFiltered };
}

describe("useSociogramPreferencesSelection", () => {
  describe("toggle", () => {
    it("adds a member that is not yet selected", () => {
      const { selectedIds, toggle, emit } = setup(DEFAULT_MEMBERS, []);

      toggle({ id: "bob", name: "Bob" });

      expect(selectedIds.value).toEqual(["bob"]);
      expect(emit).toHaveBeenCalledWith("update:modelValue", ["bob"]);
    });

    it("removes a member that is already selected", () => {
      const { selectedIds, toggle } = setup(DEFAULT_MEMBERS, ["alice", "bob"]);

      toggle({ id: "alice", name: "Alice" });

      expect(selectedIds.value).toEqual(["bob"]);
    });

    it("toggles a member that is not first in the filtered list", () => {
      const { selectedIds, toggle } = setup(DEFAULT_MEMBERS, []);

      // "Carol" is not the first member in the list; toggling must still work.
      toggle({ id: "carol", name: "Carol" });

      expect(selectedIds.value).toEqual(["carol"]);
    });
  });

  describe("toggleFiltered", () => {
    it("does nothing when the query is empty", () => {
      const { selectedIds, emit, toggleFiltered } = setup(DEFAULT_MEMBERS, ["alice"]);

      toggleFiltered();

      expect(selectedIds.value).toEqual(["alice"]);
      expect(emit).not.toHaveBeenCalled();
    });

    it("treats a whitespace-only query as empty", () => {
      const { query, selectedIds, emit, toggleFiltered } = setup(DEFAULT_MEMBERS, ["alice"]);

      query.value = "   ";
      toggleFiltered();

      expect(selectedIds.value).toEqual(["alice"]);
      expect(emit).not.toHaveBeenCalled();
    });

    it("does nothing when no member matches the query", () => {
      const { query, selectedIds, emit, toggleFiltered } = setup(DEFAULT_MEMBERS, ["alice"]);

      query.value = "zzz";
      toggleFiltered();

      expect(selectedIds.value).toEqual(["alice"]);
      expect(emit).not.toHaveBeenCalled();
    });

    it("toggles only the first member that matches the query", () => {
      const { query, selectedIds, toggleFiltered } = setup(DEFAULT_MEMBERS, []);

      // "a" matches both Alice and Carol; only the top result is toggled.
      query.value = "a";
      toggleFiltered();

      expect(selectedIds.value).toEqual(["alice"]);
    });

    it("leaves the other matching members untouched", () => {
      const { query, selectedIds, toggleFiltered } = setup(DEFAULT_MEMBERS, ["bob"]);

      query.value = "a";
      toggleFiltered();

      expect(selectedIds.value).toEqual(["bob", "alice"]);
    });

    it("removes the first match when it is already selected", () => {
      const { query, selectedIds, toggleFiltered } = setup(DEFAULT_MEMBERS, ["alice"]);

      query.value = "a";
      toggleFiltered();

      expect(selectedIds.value).toEqual([]);
    });

    it("clears the query after toggling", () => {
      const { query, toggleFiltered } = setup(DEFAULT_MEMBERS, []);

      query.value = "bob";
      toggleFiltered();

      expect(query.value).toBe("");
    });
  });
});
