---
title: Troubleshooting
order: 7
description: Fix the most common problems when building and reading sociograms.
---

This page collects the issues most often reported, with the cause and the fix for
each.

## The layout looks random

If the sociogram keeps jumping or looks tangled, the layout has not converged.

### Fixes

- Increase the number of iterations.
- Raise gravity to pull nodes together.
- Reduce the scaling factor.

## A member is missing

A member can vanish if their name is inconsistent across rows.

```js
// "Ada " and "ada" become two nodes unless names are normalized.
```

Enable name normalization in import settings and re-import.

## The graph is too dense to read

With many members, edges overlap. Filter the view instead of shrinking everything:

1. Hide weak edges below a weight threshold.
2. Focus on one community at a time.
3. Increase node spacing.

## Import fails with no message

Check the file encoding and delimiter. The importer expects UTF-8 and a comma by
default; switch the delimiter in settings for tab- or semicolon-separated files.
