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
- **Sociometric indices** at the group and individual level, including cohesion, conflict, reciprocity, and each member's sociometric status.
- **Social network measures** for the likes and dislikes graphs separately: degree, closeness, betweenness, PageRank, and HITS centrality, plus density, centralization, reciprocity, transitivity, and connected components.
- **Classified relationship edges** — seven edge types spanning healthy, potentially problematic, and problematic relationships (e.g. mutual like, one-sided dislike, mutual dislike).
- **Ego plots** and **network plots** for visual inspection.

## The workflow

1. Enter the list of members (or import an archived project).
2. Define each member's choices and rejections.
3. Generate the report. Analysis runs in a Web Worker so the UI stays responsive.
4. Read, filter, and archive the results.

## Tech stack

- [Vue 3](https://vuejs.org/) with the Composition API
- [Vite](https://vite.dev/)
- [Pinia](https://pinia.vuejs.org/) for state management
- [Vue Router](https://router.vuejs.org/) for navigation
- [Tailwind CSS](https://tailwindcss.com/) v4
- [graphology](https://graphology.github.io/) for graph structures, metrics, and layout
- [numpy-ts](https://github.com/fnnxdev/numpy-ts) for vectorized matrix calculations
- [MathJax](https://www.mathjax.org/) for rendering formulas in the docs
- [Vitest](https://vitest.dev/) for testing
- Markdown files rendered as documentation pages via `unplugin-vue-markdown`

## Prerequisites

- [Node.js](https://nodejs.org/) `^22.18.0 || >=24.12.0`
- [pnpm](https://pnpm.io/)

## Getting started

```sh
# Install dependencies
pnpm install

# Start the dev server with hot reload
pnpm dev

# Build for production
pnpm build

# Preview the production build
pnpm preview

# Run the test suite
pnpm test
```

## Project structure

```
src/
├── analysis/        # Sociometry and SNA computations (metrics, plots, edges)
├── assets/          # Global styles
├── components/      # Views, layouts, and UI components
├── composables/     # Reusable logic (docs, sociogram flow, downloads, …)
├── docs/            # Markdown documentation and its navigation
├── router/          # Route definitions
├── stores/          # Pinia stores (app, sociogram, report)
├── utils/           # Sociogram helpers and worker loader
└── workers/         # Web Worker that runs report analysis off the main thread

tests/               # Vitest unit tests (analysis and sociogram helpers)
```

## Notes

- **Privacy-first:** entered data is processed in the browser and is not sent to a server or stored permanently.
- The report analysis (`src/analysis/analysisMain.js`) is orchestrated in a Web Worker (`src/workers/reportWorker.js`) and returns a single combined result consumed by the report store.
