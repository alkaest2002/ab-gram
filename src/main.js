// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import "@/assets/styles/fonts/fonts.css";
import "@/assets/styles/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "@/App.vue";
import router from "@/router";
import { preloadReportWorker, preloadSnaPlotWorker } from "@/utils/worker";

const app = createApp(App);

app.app = app.use(createPinia());
app.use(router);

// 1. Mount the app as fast as possible to unblock initial rendering
await router.isReady();
app.mount("#app");

// 2. Define the exact route paths you want to prioritize
const PRIORITY_PATHS = ["/sociogram", "/docs", "/about"];

/**
 * Safely triggers the dynamic import function for a route component.
 */
function preloadComponent(componentLoader, identifier) {
  if (typeof componentLoader === "function") {
    componentLoader().catch((error) => {
      console.warn(`[Preloader] Failed to preload "${identifier}":`, error);
    });
  }
}

/**
 * Recursively extracts and preloads route components, including nested children.
 */
function preloadAllRoutesRecursive() {
  const allRoutes = router.getRoutes();
  const routeMap = new Map();
  const preloadedPaths = new Set();

  // Helper to recursively collect route records (handling nested children)
  function flattenRoutes(routesList) {
    routesList.forEach((route) => {
      if (route.path) {
        routeMap.set(route.path, route);
      }
      // If the route record has nested children, traverse them recursively
      if (route.children && Array.isArray(route.children)) {
        flattenRoutes(route.children);
      }
    });
  }

  // Flatten both top-level records and their children
  flattenRoutes(allRoutes);

  // Step A: Preload priority routes first in exact order
  PRIORITY_PATHS.forEach((path) => {
    const route = routeMap.get(path);
    if (route) {
      // Check default component or named views components if any
      const loader = route.components?.default;
      preloadComponent(loader, path);
      preloadedPaths.add(path);
    }
  });

  // Step B: Preload all remaining routes and child routes
  routeMap.forEach((route, path) => {
    if (!preloadedPaths.has(path)) {
      const loader = route.components?.default;
      preloadComponent(loader, path);
    }
  });
}

/**
 * Warm the Web Worker chunks (report analysis + SNA plot regeneration) so the
 * first "generate report" action doesn't wait on a network fetch.
 */
function preloadWorkers() {
  [preloadReportWorker, preloadSnaPlotWorker].forEach((preload) => {
    preload().catch((error) => {
      console.warn("Worker preload failed, will load on-demand:", error);
    });
  });
}

// 3. Defer preloading until after the initial page has finished loading
window.addEventListener("load", () => {
  const preloadDeferredResources = () => {
    preloadAllRoutesRecursive();
    preloadWorkers();
  };

  if ("requestIdleCallback" in window) {
    requestIdleCallback(preloadDeferredResources, { timeout: 3000 });
  } else {
    setTimeout(preloadDeferredResources, 2000);
  }
});
