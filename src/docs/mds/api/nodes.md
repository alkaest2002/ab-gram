---
title: Nodes
order: 2
description: Create, inspect, and modify the members of a graph.
---

Nodes are the members of the group. This page covers the functions that manage them.

## Creating nodes

Add members to a graph with `addNode`. Adding an existing node is a no-op.

```js
import { buildGraph } from "@/utils/graph";

const graph = buildGraph();
graph.addNode("Ada");
graph.addNode("Bo");
```

## Inspecting nodes

Query the graph for its members:

```js
graph.order; // 2 — the number of nodes
graph.hasNode("Ada"); // true
graph.nodes(); // ["Ada", "Bo"]
```

### Attributes

Every node can carry attributes that the layout and renderer read:

- `size` — scales the node in the picture.
- `color` — overrides the default fill.
- `group` — colors the node by community.

## Removing nodes

`dropNode` removes a member and every edge touching it:

```js
graph.dropNode("Bo");
console.log(graph.order); // 1
```

Removing a node is destructive; check `hasNode` first when the input is untrusted.
