# AB-Gram

**AB-Gram** is a browser-based tool for building and reading **group sociograms**. It helps people who work with groups — teachers, educators, psychologists, sociologists, and team coordinators — understand the social dynamics between members without needing a background in math or computer science.

You collect each member's **choices** (who they would like to work or spend time with) and **rejections** (who they would prefer to avoid). AB-Gram turns those answers into a sociogram, sociometric indices, and social network measures — for the group as a whole and for each individual member.

> The application UI and its in-app documentation are written in Italian.

## What it does

AB-Gram combines two complementary approaches:

- **Sociometry** (originating with Jacob L. Moreno) provides the method for collecting a group's preferences and the indices for reading them.
- **Social Network Analysis (SNA)** provides structural measures of how members are connected to one another.

From the collected data, AB-Gram produces:

- A **sociogram** — the visual map of relationships.
- **Sociometric (Moreno) indices** at the group and individual level:
  - _Group:_ cohesion (types I and II), conflict (types I and II), and positive and negative reciprocity.
  - _Individual:_ received/given positive and negative nominations, mutual positive and negative connections, impact, balance, expressivity, orientation, affiliation, influence, sociometric status, and order-weighted bonus/malus scores.
- **Social network measures**, computed separately for the likes and dislikes graphs:
  - _Group:_ node, edge, and mutual-edge counts; in-/out-degree distribution summaries; density; centralization; reciprocity; and transitivity.
  - _Individual:_ in-degree, out-degree, and degree centrality, closeness, betweenness, PageRank, and HITS (authority and hub).
  - _Structures:_ symmetric and asymmetric dyads, cliques, strongly connected components (plain and reciprocal-edge), weakly connected components, and Louvain communities.
- **Classified relationship edges** — seven edge types spanning healthy, potentially problematic, and problematic relationships (e.g. mutual like, one-sided dislike, mutual dislike).
- **Ego plots** (Moreno) and **network plots** (ForceAtlas2) for visual inspection.

## The workflow

1. Start a new project or import an archived one.
2. Load the list of members (or load the bundled example dataset).
3. Manage the member list.
4. Define each member's choices and rejections.
5. Generate the report. Analysis and plot layout run in Web Workers so the UI stays responsive.
6. Read, filter, print, and archive the results.

## Tech stack

- [Vue 3](https://vuejs.org/) with the Composition API
- [Vite+](https://viteplus.dev/) — the unified web toolchain built on Vite (includes Vitest for testing)
- [Pinia](https://pinia.vuejs.org/) for state management
- [Vue Router](https://router.vuejs.org/) for navigation
- [Tailwind CSS](https://tailwindcss.com/) v4
- [graphology](https://graphology.github.io/) for graph structures, metrics, and layout (ForceAtlas2, Louvain, components, operators)
- [numpy-ts](https://github.com/fnnxdev/numpy-ts) for vectorized matrix calculations
- [MathJax](https://www.mathjax.org/) v4 for rendering formulas in the docs
- Markdown files rendered as documentation pages via `unplugin-vue-markdown`

## Prerequisites

- [Node.js](https://nodejs.org/) `^22.18.0 || ^24.11.0 || >=26.0.0`
- [pnpm](https://pnpm.io/) `12.16.1`

## Getting started

```sh
# Install dependencies
pnpm install

# Start the dev server with hot reload
vp dev

# Build for production
vp build

# Preview the production build
vp preview

# Run the test suite in watch mode
vp test

# Run the test suite once (e.g. for CI)
vp test run

# Format, lint, and type check
vp check
```

The project uses the Vite+ toolchain, so its commands are run through the `vp` CLI. The same commands are also available as `package.json` scripts (e.g. `pnpm dev` runs `vp dev`).

Two additional scripts generate site artifacts:

```sh
# Regenerate the sitemap
vp run generate:sitemap

# Regenerate third-party notices
vp run generate:notices
```

## Project structure

```
src/
├── analysis/        # Sociometry and SNA computations
│   ├── common/      # Adjacency matrices and ranked scores
│   ├── edges/       # Seven edge-type classification
│   ├── moreno/      # Moreno metrics and ego plots
│   └── sna/         # SNA metrics, structures, plots, and graph base
├── assets/          # Global styles and fonts
├── components/      # Layouts, views, and UI components
├── composables/     # Reusable logic (docs, report, sociogram, downloads, …)
├── docs/            # Markdown documentation and its navigation
├── router/          # Route definitions (top-level and per-route files)
├── stores/          # Pinia stores (app, sociogram, report)
├── utils/           # Sociogram/report helpers, Vite plugins, and worker loader
└── workers/         # Web Workers that run report analysis and plot layout off the main thread

tests/               # Vitest unit tests (analysis and sociogram helpers) plus fixtures
scripts/             # Node scripts for the sitemap and third-party notices
public/              # Static assets (favicons, sitemap, printable PDF)
```

## Notes

- **Privacy-first:** entered data is processed in the browser and is not sent to a server or stored permanently.
- The report analysis (`src/analysis/analysisMain.js`) is orchestrated in a Web Worker (`src/workers/reportWorker.js`) and returns a single combined result consumed by the report store. Worker construction and preloading are centralized in `src/workers/workerHelpers.js`.
- SNA plot layout regeneration (`src/workers/snaPlotWorker.js`) also runs off the main thread so adjusting ForceAtlas2 settings doesn't freeze the UI.
