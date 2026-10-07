---
title: Reading Sociograms
order: 3
description: Interpret the visual layout of a sociogram.
---

The point of a sociogram is to see structure immediately. This page explains how to
read the picture that AB-Grid draws.

## Position

Where a node sits is meaningful. The layout pushes well-connected nodes together and
isolated nodes to the edges.

### What to look for

- **Centre** — highly chosen, socially central members.
- **Periphery** — members with few or no connections.
- **Clusters** — tight groups that mostly connect among themselves.

## Edges

Edges encode the strength and direction of a relationship.

- A solid line is a mutual or strong choice.
- An arrowhead shows direction when choices are one-way.
- Edge thickness maps to weight.

## Example reading

Consider this directed graph:

```js
const choices = [
  { from: "Ada", to: "Bo" },
  { from: "Bo", to: "Ada" },
  { from: "Ada", to: "Cid" },
];
```

Ada and Bo form a mutual pair, while Cid is only chosen by Ada. In the layout, Ada
and Bo sit close together and Cid drifts outward.

## Common pitfalls

1. Don't read distance as literal dislike — layout is approximate.
2. Compare clusters, not exact pixel positions.
3. Re-run the layout when the picture looks unstable.
