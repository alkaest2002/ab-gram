---
title: Building Groups
order: 2
description: Turn raw choices into a graph of nodes and edges.
---

A group starts as a list of choices. AB-Grid converts that list into a graph object
that the rest of the app can analyze and draw.

## From choices to a graph

Each choice becomes an edge between two nodes. Nodes that appear in no choice are
still added, so no member is silently dropped.

```js
import { buildGraph } from "@/utils/graph";

const graph = buildGraph([
  { from: "Ada", to: "Bo", weight: 3 },
  { from: "Bo", to: "Cid", weight: 1 },
]);
```

## Adding members

You can add members explicitly when a node should exist without any edge:

```js
graph.addNode("Dee");
```

### Node attributes

Every node can carry attributes that influence layout and color:

- A `role` such as `teacher` or `student`.
- A `group` label for community coloring.
- A `weight` for node size.

## Validating the graph

Before analyzing, check that the graph is well formed. The validator reports
duplicate edges, missing targets, and self-loops.

```js
const issues = validateGraph(graph);
if (issues.length) console.warn(issues);
```
