---
title: Exporting Results
order: 6
description: Save the sociogram and its metrics for reports and sharing.
---

Once the analysis is done, export the result. AB-Grid can write the image and the
underlying data in several formats.

## Image export

Export the rendered sociogram as a vector image so it scales cleanly in reports:

```js
import { exportSvg } from "@/analysis/snaPlots";

const svg = exportSvg(graph, layout);
```

### Formats

- **SVG** — editable and resolution-independent.
- **PNG** — easy to drop into documents.

## Data export

Download the graph and metrics as structured data for further processing:

- **CSV** — a flat table of members and their scores.
- **JSON** — the full graph, ready to re-import.

## What to include

Choose what goes into the export before writing the file:

1. The layout coordinates, so the picture reproduces exactly.
2. The computed metrics, so readers see the numbers.
3. Node attributes, so colors and roles survive.
