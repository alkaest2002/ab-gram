---
title: Quick Start
order: 3
description: Build and read your first sociogram in under five minutes.
---

This guide walks through the shortest path from an empty project to a rendered
sociogram. You will import a small file, compute a layout, and read the result.

## Prepare your data

Create a CSV file with one row per choice. The first two columns are the source and
target members:

```csv
from,to
Ada,Bo
Ada,Cid
Bo,Cid
Dee,Ada
```

## Import the file

Load the file through the import screen. AB-Grid parses the rows and builds a directed
graph behind the scenes.

### What you should see

- Four nodes: Ada, Bo, Cid, and Dee.
- Four edges connecting them.
- Ada positioned centrally, since it is chosen most often.

## Apply a layout

Choose **ForceAtlas2** from the layout panel. The nodes will spread out so that
tightly connected members sit close together.

```js
import { runForceAtlas2 } from "@/workers/layout";

await runForceAtlas2(graph, { iterations: 200 });
```

## Read the result

Once the layout settles, look for the patterns described in the Guide:

1. Members clustered in the middle are well connected.
2. Members pushed to the edge are peripheral.
3. Thick or repeated edges mark strong relationships.
