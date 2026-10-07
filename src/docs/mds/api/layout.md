---
title: Layout
order: 4
description: Position the nodes of a graph with the layout algorithms.
---

Layout assigns each node a position so the sociogram can be drawn. AB-Grid ships
several algorithms with different trade-offs.

## Running a layout

Layout functions are asynchronous and run in a worker so the UI stays responsive:

```js
import { runForceAtlas2 } from "@/workers/layout";

const positions = await runForceAtlas2(graph, { iterations: 200 });
```

## Available algorithms

| Algorithm | Use case |
| --------- | -------- |
| `circular` | Small, readable groups |
| `random` | A neutral starting point |
| `forceAtlas2` | Uncovering communities |

### ForceAtlas2

ForceAtlas2 is the default for larger groups. Its main options:

- `iterations` — number of passes over the graph.
- `gravity` — attraction toward the centre.
- `scaling` — base distance between connected nodes.

## Applying positions

The result is a map from node to coordinates:

```js
// positions: { Ada: { x: 12, y: 3 }, Bo: { x: -4, y: 9 } }
```

Pass it to the renderer, or export it to reproduce the exact picture later.
