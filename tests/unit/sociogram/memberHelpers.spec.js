import { describe, it, expect } from "vitest";

import { orderMemberId } from "@/utils/sociogram/memberHelpers.js";

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
