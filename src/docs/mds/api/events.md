---
title: Events
order: 6
description: Subscribe to graph changes with a simple event system.
---

The graph emits events when it changes, so views and analyses can stay in sync
without polling.

## Subscribing

Register a listener with `on`. It receives the type of change and the affected data.

### Listener signature

Listeners receive the affected node or edge as their argument:

```js
graph.on("node:added", (node) => {
  console.log(`added ${node}`);
});
```

## Available events

The graph emits the following events:

- `node:added` — a new member was created.
- `node:removed` — a member and its edges were dropped.
- `edge:added` — a new choice was created.
- `edge:removed` — a choice was removed.

## Unsubscribing

Remove a listener with `off` to avoid leaks in long-lived components:

```js
const listener = (node) => console.log(node);
graph.on("node:added", listener);
graph.off("node:added", listener);
```

## Batching updates

Wrap many changes in a transaction to emit a single event instead of one per change:

```js
graph.batch(() => {
  graph.addNode("Ada");
  graph.addNode("Bo");
  graph.addEdge("Ada", "Bo");
});
```
