import { ref } from "vue";
import { describe, it, expect } from "vitest";

import { useSociogramSearchMembers } from "@/composables/sociogram/useSociogramSearchMembers.js";

const DEFAULT_MEMBERS = [
  { id: "pierpaolo", name: "Pierpaolo Calanna" },
  { id: "alice", name: "Alice" },
  { id: "bob", name: "Bob" },
  { id: "carol", name: "Carol" },
];

/**
 * Instantiate the composable over a fresh, isolated copy of `members`.
 * Each call gets its own `ref`, so tests cannot leak mutations into one another.
 */
function setup(members = DEFAULT_MEMBERS) {
  const membersRef = ref([...members]);
  const { query, filteredMembers } = useSociogramSearchMembers(membersRef);
  return { membersRef, query, filteredMembers };
}

/** Map a computed member list to its ids for compact assertions. */
function ids(computedMembers) {
  return computedMembers.value.map((member) => member.id);
}

describe("useSociogramSearchMembers", () => {
  it("exposes query and filteredMembers refs with sensible defaults", () => {
    const { query, filteredMembers } = setup([]);

    expect(query.value).toBe("");
    expect(filteredMembers.value).toEqual([]);
  });

  it("returns every member, in original order, for an empty query", () => {
    const { membersRef, filteredMembers } = setup();

    expect(filteredMembers.value).toBe(membersRef.value);
    expect(ids(filteredMembers)).toEqual(["pierpaolo", "alice", "bob", "carol"]);
  });

  it("treats a whitespace-only query as empty", () => {
    const { membersRef, query, filteredMembers } = setup();

    query.value = "   ";

    expect(filteredMembers.value).toBe(membersRef.value);
  });

  it("returns an empty list when no member matches the query", () => {
    const { query, filteredMembers } = setup();

    query.value = "zzz";

    expect(filteredMembers.value).toEqual([]);
  });

  it("returns an empty list for an empty roster, even with a query", () => {
    const { query, filteredMembers } = setup([]);

    query.value = "alice";

    expect(filteredMembers.value).toEqual([]);
  });

  it("matches case-insensitively", () => {
    const { query, filteredMembers } = setup();

    query.value = "ALICE";

    expect(ids(filteredMembers)).toEqual(["alice", "pierpaolo"]);
  });

  it("strips diacritics from both the query and member names", () => {
    const { query, filteredMembers } = setup([
      { id: "andre", name: "André" },
      { id: "jose", name: "José" },
    ]);

    query.value = "andre";

    expect(ids(filteredMembers)).toEqual(["andre"]);
  });

  it("matches an accented member name against an unaccented query", () => {
    const { query, filteredMembers } = setup([
      { id: "jose", name: "José" },
      { id: "andre", name: "André" },
    ]);

    query.value = "jose";

    expect(ids(filteredMembers)).toEqual(["jose"]);
  });

  it("matches an unaccented member name against an accented query", () => {
    const { query, filteredMembers } = setup([{ id: "jose", name: "Jose" }]);

    query.value = "José";

    expect(ids(filteredMembers)).toEqual(["jose"]);
  });

  it("finds members by an ordered subsequence of their name", () => {
    const { query, filteredMembers } = setup();

    // "cln" is not a substring of "Pierpaolo Calanna", but its letters
    // appear in order (c…l…n).
    query.value = "cln";

    expect(ids(filteredMembers)).toEqual(["pierpaolo"]);
  });

  it("matches when all query characters are present but out of order", () => {
    const { query, filteredMembers } = setup([{ id: "bob", name: "Bob" }]);

    // "obb" is not a substring nor a subsequence of "bob", but every
    // character (including the repeated "b") is present.
    query.value = "obb";

    expect(ids(filteredMembers)).toEqual(["bob"]);
  });

  it("matches a substring that starts mid-word", () => {
    const { query, filteredMembers } = setup([{ id: "carol", name: "Carol" }]);

    // "arol" appears inside "Carol" but not at a word boundary.
    query.value = "arol";

    expect(ids(filteredMembers)).toEqual(["carol"]);
  });

  it("ranks exact matches ahead of looser matches", () => {
    const { query, filteredMembers } = setup();

    // "al" is a boundary substring of "Alice", a mid-word substring of
    // "Pierpaolo Calanna", and only a subsequence of "Carol".
    query.value = "al";

    expect(ids(filteredMembers)).toEqual(["alice", "pierpaolo", "carol"]);
  });

  it("reacts to query changes", () => {
    const { query, filteredMembers } = setup();

    expect(ids(filteredMembers)).toEqual(["pierpaolo", "alice", "bob", "carol"]);

    query.value = "bob";
    expect(ids(filteredMembers)).toEqual(["bob"]);

    query.value = "";
    expect(ids(filteredMembers)).toEqual(["pierpaolo", "alice", "bob", "carol"]);
  });

  it("reacts to changes in the members list", () => {
    const { membersRef, query, filteredMembers } = setup();

    query.value = "dave";
    expect(filteredMembers.value).toEqual([]);

    membersRef.value = [{ id: "dave", name: "Dave" }];
    expect(ids(filteredMembers)).toEqual(["dave"]);
  });
});
