import { describe, it, expect } from "vitest";
import { DirectedGraph } from "graphology";

import { createLikesGraph } from "@/analysis/sna/snaBase.js";

const makeMember = (id, name, likes = [], dislikes = []) => ({
  id,
  name,
  likes,
  dislikes,
});

describe("createLikesGraph", () => {
  it("adds a node per member keyed by id and labelled with their name", () => {
    const members = [
      makeMember("a", "Alice"),
      makeMember("b", "Bob"),
    ];

    const graph = createLikesGraph(members, "likes");

    expect(graph.order).toBe(2);
    expect(graph.hasNode("a")).toBe(true);
    expect(graph.hasNode("b")).toBe(true);
    expect(graph.getNodeAttribute("a", "memberName")).toBe("Alice");
    expect(graph.getNodeAttribute("b", "memberName")).toBe("Bob");
  });

  it("records the preference type as a graph attribute", () => {
    const graph = createLikesGraph([makeMember("a", "Alice")], "dislikes");

    expect(graph.getAttribute("typeOfPreference")).toBe("dislikes");
  });

  it("adds a directed edge from each member to each chosen member", () => {
    const members = [
      makeMember("a", "Alice", ["b", "c"]),
      makeMember("b", "Bob", ["c"]),
      makeMember("c", "Carol"),
    ];

    const graph = createLikesGraph(members, "likes");

    expect(graph.size).toBe(3);
    expect(graph.hasDirectedEdge("a", "b")).toBe(true);
    expect(graph.hasDirectedEdge("a", "c")).toBe(true);
    expect(graph.hasDirectedEdge("b", "c")).toBe(true);
    expect(graph.hasDirectedEdge("c", "a")).toBe(false);
  });

  it("marks mutual edges with isMutual and one-way edges without", () => {
    const members = [
      makeMember("a", "Alice", ["b"]),
      makeMember("b", "Bob", ["a"]),
      makeMember("c", "Carol", ["b"]),
    ];

    const graph = createLikesGraph(members, "likes");

    expect(graph.getEdgeAttribute("a", "b", "isMutual")).toBe(true);
    expect(graph.getEdgeAttribute("b", "a", "isMutual")).toBe(true);
    expect(graph.getEdgeAttribute("c", "b", "isMutual")).toBe(false);
  });

  it("builds an independent graph for the dislikes preference", () => {
    const members = [
      makeMember("a", "Alice", [], ["b"]),
      makeMember("b", "Bob", [], []),
    ];

    const graph = createLikesGraph(members, "dislikes");

    expect(graph.hasDirectedEdge("a", "b")).toBe(true);
    expect(graph.hasDirectedEdge("b", "a")).toBe(false);
    expect(graph.getAttribute("typeOfPreference")).toBe("dislikes");
  });

  it("returns a valid graphology DirectedGraph instance", () => {
    const graph = createLikesGraph([makeMember("a", "Alice")], "likes");

    expect(graph).toBeInstanceOf(DirectedGraph);
  });
});
