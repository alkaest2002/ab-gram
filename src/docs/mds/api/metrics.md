---
title: Metrics
order: 5
description: Quantitative measures of a graph's structure.
---

Metrics summarize the social structure with numbers. They are pure functions: the
same graph always produces the same scores.

## Degree centrality

Degree counts the choices each member receives:

```js
import { degreeCentrality } from "@/analysis/snaMetrics";

const scores = degreeCentrality(graph);
console.log(scores); // { Ada: 2, Bo: 1 }
```

## Closeness and betweenness

Two other centrality measures look beyond immediate neighbours:

- **Closeness** — how few steps a member needs to reach everyone.
- **Betweenness** — how often a member sits on a shortest path.

### Choosing a measure

Use degree for a quick read, closeness for reach, and betweenness for gatekeeping
roles.

## Whole-graph metrics

Some metrics describe the group as a whole:

- `density(graph)` — the share of possible edges that exist.
- `reciprocity(graph)` — the share of choices that are returned.

Compare these across groups of the same size, or they will mislead.
