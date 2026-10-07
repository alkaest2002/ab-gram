---
title: Installation
order: 2
description: Requirements and step-by-step setup of the AB-Grid development environment.
---

AB-Grid runs on Node.js and uses pnpm for dependencies. Follow the steps below to get
a working checkout on your machine.

## Requirements

Before you start, make sure you have the following installed:

- Node.js 22 or newer
- pnpm 9 or newer
- A modern browser for the dev server

## Clone and install

Clone the repository and install its dependencies:

```sh
git clone https://github.com/ab-grid/vue-abgrid.git
cd vue-abgrid
pnpm install
```

## Start the dev server

```sh
pnpm dev
```

The app is served on `http://localhost:5173`. Vite hot-reloads on every save.

### Environment variables

Copy the example environment file and adjust it if needed:

```sh
cp .env.example .env
```

| Variable | Purpose |
| -------- | ------- |
| `VITE_BASE_URL` | Public base path for the router |
| `VITE_API_URL` | Optional backend endpoint for data import |

## Verify the install

Run the test suite to confirm everything is wired up correctly:

```sh
pnpm test
```
