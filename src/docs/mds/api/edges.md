---
title: Edges
order: 3
description: Create, weight, and query the relationships between members.
---

Edges connect two nodes and represent a choice. They can be directed or mutual, and
they carry an optional weight.

## Adding edges

Create an edge with `addEdge`. The endpoints are added as nodes if they don't exist:

```js
graph.addEdge("Ada", "Bo", { weight: 2 });
```

## Querying edges

Read the edges of the graph and check whether two members are connected:

```js
graph.size; // 1 — the number of edges
graph.hasEdge("Ada", "Bo"); // true
graph.edges(); // [{ source: "Ada", target: "Bo", weight: 2 }]
```

### Direction

Edges are directed by default. Pass `undirected: true` for a mutual choice:

```js
graph.addEdge("Ada", "Bo", { undirected: true });
```

## Weight

The `weight` field is a number that maps to edge thickness and layout strength:

1. A weight of `1` is a neutral choice.
2. Higher weights pull the two nodes closer.
3. A weight of `0` is treated as no edge.
