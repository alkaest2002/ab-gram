// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { describe, it, expect } from "vite-plus/test";
import { DirectedGraph } from "graphology";

import { createSnaNetwork } from "@/analysis/sna/snaBase.js";
import { getHogwartsMembers } from "../../fixtures/hogwarts.js";

describe("createSnaNetwork", () => {
  it("adds a node per member keyed by id and labelled with their name", () => {
    const members = getHogwartsMembers();

    const likesNetwork = createSnaNetwork(members, "likes");

    expect(likesNetwork.order).toBe(members.length);
    expect(likesNetwork.hasNode("A")).toBe(true);
    expect(likesNetwork.hasNode("I")).toBe(true);
    expect(likesNetwork.getNodeAttribute("A", "memberName")).toBe("Potter, Harry");
    expect(likesNetwork.getNodeAttribute("I", "memberName")).toBe("Diggory, Cedric");
  });

  it("records the preference type as a graph attribute", () => {
    const dislikesNetwork = createSnaNetwork(getHogwartsMembers(), "dislikes");

    expect(dislikesNetwork.getAttribute("typeOfPreference")).toBe("dislikes");
  });

  it("adds a directed edge from each member to each chosen member", () => {
    const likesNetwork = createSnaNetwork(getHogwartsMembers(), "likes");

    // The roster contains 38 directed likes in total.
    expect(likesNetwork.size).toBe(38);
    expect(likesNetwork.hasDirectedEdge("A", "B")).toBe(true);
    expect(likesNetwork.hasDirectedEdge("A", "C")).toBe(true);
    expect(likesNetwork.hasDirectedEdge("A", "E")).toBe(true);
    expect(likesNetwork.hasDirectedEdge("E", "I")).toBe(true);
    expect(likesNetwork.hasDirectedEdge("I", "A")).toBe(true);
    expect(likesNetwork.hasDirectedEdge("I", "F")).toBe(true);
    // E does not like B back, so the edge is one-way only.
    expect(likesNetwork.hasDirectedEdge("B", "E")).toBe(false);
  });

  it("marks mutual edges with isMutual and one-way edges without", () => {
    const likesNetwork = createSnaNetwork(getHogwartsMembers(), "likes");

    // A and B like each other, and A and E also like each other back.
    expect(likesNetwork.getEdgeAttribute("A", "B", "isMutual")).toBe(true);
    expect(likesNetwork.getEdgeAttribute("B", "A", "isMutual")).toBe(true);
    expect(likesNetwork.getEdgeAttribute("A", "E", "isMutual")).toBe(true);
  });

  it("builds an independent graph for the dislikes preference", () => {
    const dislikesNetwork = createSnaNetwork(getHogwartsMembers(), "dislikes");

    // The roster contains 30 directed dislikes in total.
    expect(dislikesNetwork.size).toBe(30);
    expect(dislikesNetwork.hasDirectedEdge("A", "F")).toBe(true);
    expect(dislikesNetwork.hasDirectedEdge("F", "A")).toBe(true);
    expect(dislikesNetwork.hasDirectedEdge("A", "E")).toBe(false);
    expect(dislikesNetwork.getAttribute("typeOfPreference")).toBe("dislikes");
  });

  it("returns a valid graphology DirectedGraph instance", () => {
    const likesNetwork = createSnaNetwork(getHogwartsMembers(), "likes");

    expect(likesNetwork).toBeInstanceOf(DirectedGraph);
  });
});
