---
title: Overview
order: 1
description: A map of the Guide section and the workflow it covers.
---

The Guide walks through the full lifecycle of a sociogram: from a raw file of choices
to a readable, shareable picture of the group. Each page builds on the previous one.

## The workflow

Every analysis follows the same five steps, in order:

1. Build the group from imported data.
2. Read the sociogram visually.
3. Import and clean more data.
4. Compute metrics to quantify the structure.
5. Export the result.

## Conventions used here

The examples assume a small group of five members. Names are kept short so the
patterns are easy to follow.

```js
const members = ["Ada", "Bo", "Cid", "Dee", "Eli"];
```

### A note on direction

Some examples use directed choices, others mutual ones. Direction is always stated
explicitly, because it changes the meaning of every metric.

## Where to go next

Start with [Building groups](/docs/guide/building-groups) to turn data into nodes and
edges, then follow the pages in order.
