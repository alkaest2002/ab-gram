import { describe, it, expect } from "vitest";
import { DirectedGraph } from "graphology";

import { createLikesGraph } from "@/analysis/sna/snaBase.js";
import { getHogwartsMembers } from "../../fixtures/hogwarts.js";

describe("createLikesGraph", () => {
  it("adds a node per member keyed by id and labelled with their name", () => {
    const members = getHogwartsMembers();

    const graph = createLikesGraph(members, "likes");

    expect(graph.order).toBe(members.length);
    expect(graph.hasNode("A")).toBe(true);
    expect(graph.hasNode("I")).toBe(true);
    expect(graph.getNodeAttribute("A", "memberName")).toBe("Potter, Harry");
    expect(graph.getNodeAttribute("I", "memberName")).toBe("Diggory, Cedric");
  });

  it("records the preference type as a graph attribute", () => {
    const graph = createLikesGraph(getHogwartsMembers(), "dislikes");

    expect(graph.getAttribute("typeOfPreference")).toBe("dislikes");
  });

  it("adds a directed edge from each member to each chosen member", () => {
    const graph = createLikesGraph(getHogwartsMembers(), "likes");

    // The roster contains 36 directed likes in total.
    expect(graph.size).toBe(36);
    expect(graph.hasDirectedEdge("A", "B")).toBe(true);
    expect(graph.hasDirectedEdge("A", "C")).toBe(true);
    expect(graph.hasDirectedEdge("A", "E")).toBe(true);
    expect(graph.hasDirectedEdge("E", "I")).toBe(true);
    expect(graph.hasDirectedEdge("I", "A")).toBe(true);
    expect(graph.hasDirectedEdge("I", "F")).toBe(true);
    // E does not like B back, so the edge is one-way only.
    expect(graph.hasDirectedEdge("B", "E")).toBe(false);
  });

  it("marks mutual edges with isMutual and one-way edges without", () => {
    const graph = createLikesGraph(getHogwartsMembers(), "likes");

    // A and B like each other; A likes E but E does not like A back.
    expect(graph.getEdgeAttribute("A", "B", "isMutual")).toBe(true);
    expect(graph.getEdgeAttribute("B", "A", "isMutual")).toBe(true);
    expect(graph.getEdgeAttribute("A", "E", "isMutual")).toBe(false);
  });

  it("builds an independent graph for the dislikes preference", () => {
    const graph = createLikesGraph(getHogwartsMembers(), "dislikes");

    // The roster contains 30 directed dislikes in total.
    expect(graph.size).toBe(30);
    expect(graph.hasDirectedEdge("A", "F")).toBe(true);
    expect(graph.hasDirectedEdge("F", "A")).toBe(true);
    expect(graph.hasDirectedEdge("A", "E")).toBe(false);
    expect(graph.getAttribute("typeOfPreference")).toBe("dislikes");
  });

  it("returns a valid graphology DirectedGraph instance", () => {
    const graph = createLikesGraph(getHogwartsMembers(), "likes");

    expect(graph).toBeInstanceOf(DirectedGraph);
  });
});
