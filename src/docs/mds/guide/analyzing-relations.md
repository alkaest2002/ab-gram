---
title: Analyzing Relations
order: 5
description: Compute metrics that quantify a group's social structure.
---

Metrics turn the visual impression into numbers you can compare across groups and
over time. AB-Grid computes them on the graph, then displays them alongside the
sociogram.

## Centrality

Centrality measures how prominent a member is. The app offers several variants:

- **Degree** — how many choices a member received.
- **Closeness** — how quickly a member reaches everyone else.
- **Betweenness** — how often a member lies on a shortest path.

### Computing degree

```js
import { degreeCentrality } from "@/analysis/snaMetrics";

const scores = degreeCentrality(graph);
console.log(scores); // { Ada: 3, Bo: 2, Cid: 2, Dee: 1 }
```

## Density and cohesion

Two numbers summarize the whole group:

- **Density** — the share of possible edges that exist.
- **Reciprocity** — the share of choices that are returned.

## Reading the results

Compare metrics within a group, not between groups of different sizes. A small group
naturally has higher density than a large one.
