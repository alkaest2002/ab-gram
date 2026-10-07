---
title: Overview
order: 1
description: The public API surface of AB-Grid, in one page.
---

The API reference documents the modules you can import when extending AB-Grid. All
modules are plain JavaScript and follow the same conventions.

## Importing modules

Modules live under the `@/` alias, which points at `src/`:

```js
import { buildGraph } from "@/utils/graph";
import { degreeCentrality } from "@/analysis/snaMetrics";
```

## Shared conventions

Every module in this reference follows three rules:

- Pure functions take a graph as their first argument.
- Results are plain objects or arrays, never framework types.
- Mutating functions are named with an explicit verb.

## Graph object

Most functions accept a graph.

### The minimal shape

A graph needs at least a node list and an edge list:

```js
{
  nodes: ["Ada", "Bo"],
  edges: [{ source: "Ada", target: "Bo", weight: 1 }],
}
```

Browse the pages in order — [Nodes](/docs/api/nodes) through [Events](/docs/api/events) —
for the details.
