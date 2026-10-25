import { describe, it, expect } from "vitest";

import { orderMemberId, receivedPreferenceScore } from "@/utils/sociogram/memberHelpers.js";

describe("orderMemberId", () => {
  it("sorts ids by their position in MEMBERS_INDICES", () => {
    const ids = ["C", "A", "B", "E", "D"];

    expect(orderMemberId(ids)).toEqual(["A", "B", "C", "D", "E"]);
  });

  it("does not mutate the input array", () => {
    const ids = ["C", "A", "B"];

    orderMemberId(ids);

    expect(ids).toEqual(["C", "A", "B"]);
  });

  it("sorts non-alphabetic indices by their sequence position", () => {
    // "&" is the last id in MEMBERS_INDICES, "#" comes before "@".
    const ids = ["&", "#", "A", "@"];

    expect(orderMemberId(ids)).toEqual(["A", "#", "@", "&"]);
  });

  it("pushes ids outside MEMBERS_INDICES to the end, preserving their order", () => {
    const ids = ["Z", "A", "?", "B"];

    expect(orderMemberId(ids)).toEqual(["A", "B", "Z", "?"]);
  });

  it("returns an empty array for an empty input", () => {
    expect(orderMemberId([])).toEqual([]);
  });

  it("returns a new array, not the original reference", () => {
    const ids = ["B", "A"];

    expect(orderMemberId(ids)).not.toBe(ids);
  });
});

describe("receivedPreferenceScore", () => {
  // The worked example from the report docs: six members, 35 maximum members.
  const likesExample = [
    { id: "1", likes: ["2", "3", "4", "5", "6"], dislikes: [] },
    { id: "2", likes: ["1", "3", "4", "5", "6"], dislikes: [] },
    { id: "3", likes: ["1", "2", "4"], dislikes: [] },
    { id: "4", likes: ["1", "2"], dislikes: [] },
    { id: "5", likes: ["1", "2"], dislikes: [] },
    { id: "6", likes: ["1", "2"], dislikes: [] },
  ];

  it("weights a first-place choice as maxMembersCount", () => {
    // Member 1 is chosen first by all five other members.
    expect(receivedPreferenceScore("1", likesExample, 35, "likes")).toBe(175);
  });

  it("weights each later position by one less", () => {
    // Member 2 is chosen first once (35) and second four times (34).
    expect(receivedPreferenceScore("2", likesExample, 35, "likes")).toBe(171);
  });

  it("sums the contributions from every chooser", () => {
    expect(receivedPreferenceScore("4", likesExample, 35, "likes")).toBe(99);
  });

  it("returns 0 when no one lists the member", () => {
    expect(receivedPreferenceScore("99", likesExample, 35, "likes")).toBe(0);
  });

  it("ignores the member's own preference list", () => {
    const members = [{ id: "a", likes: ["a"], dislikes: [] }];

    expect(receivedPreferenceScore("a", members, 35, "likes")).toBe(0);
  });

  it("scores dislikes independently from likes", () => {
    const members = [
      { id: "a", likes: ["b"], dislikes: ["c"] },
      { id: "b", likes: [], dislikes: [] },
      { id: "c", likes: [], dislikes: [] },
    ];

    expect(receivedPreferenceScore("b", members, 35, "likes")).toBe(35);
    expect(receivedPreferenceScore("c", members, 35, "dislikes")).toBe(35);
    expect(receivedPreferenceScore("b", members, 35, "dislikes")).toBe(0);
  });

  it("matches the documented malus example", () => {
    const dislikesExample = [
      { id: "1", likes: [], dislikes: ["4", "5", "2"] },
      { id: "2", likes: [], dislikes: ["4", "5", "3"] },
      { id: "3", likes: [], dislikes: ["4", "5", "6"] },
      { id: "4", likes: [], dislikes: ["5", "1"] },
      { id: "5", likes: [], dislikes: ["4", "6"] },
      { id: "6", likes: [], dislikes: ["4", "5"] },
    ];

    expect(receivedPreferenceScore("4", dislikesExample, 35, "dislikes")).toBe(175);
    expect(receivedPreferenceScore("5", dislikesExample, 35, "dislikes")).toBe(171);
    expect(receivedPreferenceScore("6", dislikesExample, 35, "dislikes")).toBe(67);
  });
});
