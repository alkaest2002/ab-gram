---
title: Deployment
order: 5
description: Build a production bundle and serve it anywhere that hosts static files.
---

AB-Grid is a static single-page application. Deployment is a matter of building the
bundle and pointing a static file server at the output directory.

## Build

Create an optimized production bundle:

```sh
pnpm build
```

The output lands in `dist/`. Vite minifies the JavaScript and fingerprints assets for
long-term caching.

## Preview the build

Before publishing, serve the build locally to confirm it works:

```sh
pnpm preview
```

## Hosting

Because the app uses client-side routing, the server must fall back to `index.html`
for unknown paths. Most hosts support this with a small config.

### SPA fallback examples

- **Netlify** — add a `_redirects` file containing `/* /index.html 200`.
- **Vercel** — use a `vercel.json` with a rewrite to `/index.html`.
- **nginx** — `try_files $uri $uri/ /index.html;`

## Checklist

Before shipping, verify the following:

1. The base URL matches where the app is hosted.
2. The bundle builds without warnings.
3. Deep links to a docs page reload correctly.
