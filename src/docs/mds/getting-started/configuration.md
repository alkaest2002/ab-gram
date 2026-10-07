---
title: Configuration
order: 4
description: Configure layout, colors, and import defaults to match your data.
---

AB-Grid ships with sensible defaults, but every dataset is different. The
configuration panel lets you tune layout and appearance without touching code.

## Layout options

The layout engine has a few knobs worth knowing:

- **Iterations** — more iterations produce a more stable layout, at a time cost.
- **Gravity** — pulls nodes toward the centre; raise it for sparse graphs.
- **Scaling** — the spacing between connected nodes.

### Choosing a layout

Different layouts suit different data:

| Layout | Best for |
| ------ | -------- |
| Circular | Small groups, easy comparison |
| ForceAtlas2 | Uncovering communities |
| Random | A neutral starting point |

## Appearance

Colors are driven by a small set of semantic tokens, so the whole app re-themes from
one place:

```js
export const theme = {
  accent: "#2563eb",
  reject: "#dc2626",
  canvas: "#ffffff",
};
```

### Accent colors

The blue accent marks positive or primary relationships; the red marks negative or
rejected ones. Keep exactly two accents so the reading stays unambiguous.

## Import defaults

Set the delimiter, encoding, and header behavior in the import settings. These
defaults are applied to every file you load until you change them.
