---
title: Introduction
order: 1
description: What AB-Grid is, what it solves, and how the pieces fit together.
---

AB-Grid is a Vue 3 application for building and reading group sociograms. It turns
relational data — who chose whom, who works with whom — into an interactive map of a
group, so the social structure becomes visible at a glance.

## What a sociogram shows

A sociogram represents people as nodes and relationships as edges. The layout is not
decorative: distance and clustering reflect how the group actually hangs together.

### Nodes and edges

- **Nodes** are the members of the group.
- **Edges** are the choices or links between them.
- **Direction** marks who chose whom, when the data is directed.

### Why it matters

Sociograms surface patterns that tables hide, such as isolated members, popular
members, and subgroups that barely interact with the rest.

## The three layers

The app is split into three cooperating layers, each with a single job:

1. **Data** — imported files are parsed into a graph.
2. **Analysis** — metrics are computed on that graph.
3. **View** — the graph is laid out and rendered.

## A minimal example

Building a group from a list of choices is a few lines of code:

```js
import { buildGraph } from "@/utils/graph";

const graph = buildGraph([
  { from: "Ada", to: "Bo" },
  { from: "Ada", to: "Cid" },
  { from: "Bo", to: "Cid" },
]);

console.log(graph.order); // 3
```

Read on to install the project and build your first sociogram.
