---
title: Importing Data
order: 4
description: Load choices from CSV files and clean them for analysis.
---

Import is the bridge between your data and the graph. AB-Grid accepts CSV files and
normalizes them into choices before building the graph.

## Supported formats

The importer accepts the following columns, in any order:

- `from` and `to` — the two members of a choice.
- `weight` — optional strength of the choice.
- `direction` — optional override for directed or mutual edges.

## A sample file

```csv
from,to,weight
Ada,Bo,3
Ada,Cid,1
Bo,Cid,2
```

## Cleaning the data

Real files are messy. The importer normalizes names, drops empty rows, and flags
problems instead of failing silently.

### Name normalization

Names are trimmed and case-folded so `"ada"` and `"Ada"` refer to the same member.
Set the case policy in import settings when names are case-sensitive.

## Reviewing before import

After loading, review the preview table before committing:

1. Confirm the member count is what you expect.
2. Check for unknown or empty names.
3. Resolve any duplicate rows.
