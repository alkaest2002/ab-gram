// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { createRouter, createWebHistory } from "vue-router";

import homeRoutes from "@/router/routes/home";
import sociogramRoutes from "@/router/routes/sociogram";
import reportRoutes from "@/router/routes/report";
import notifyRoutes from "@/router/routes/notify";
import docsRoutes from "@/router/routes/docs";
import aboutRoutes from "@/router/routes/about";
import privacyRoutes from "@/router/routes/privacy";
import notFoundRoutes from "@/router/routes/not-found";

/** Site name used as the base browser-document title. @type {string} */
const SITE_NAME = "AB-Gram";

/**
 * Pixel offset applied when scrolling to a route hash.
 *
 * The site header is sticky, so anchor targets need to land below its 76px
 * height plus the surrounding gap rather than underneath it.
 *
 * @type {number}
 */
const HEADER_OFFSET = 88;

/**
 * Top-level application routes in matching order.
 *
 * The catch-all route must remain last so it does not intercept valid routes.
 *
 * @type {import("vue-router").RouteRecordRaw[]}
 */
export const routes = [
  homeRoutes,
  sociogramRoutes,
  reportRoutes,
  notifyRoutes,
  docsRoutes,
  aboutRoutes,
  privacyRoutes,
  notFoundRoutes,
];

/**
 * Resolve the browser scroll position after navigation.
 *
 * Hash navigation clears the sticky header, browser history restores its saved
 * position, and ordinary navigation waits for the route fade before scrolling
 * smoothly to the top.
 *
 * @type {import("vue-router").RouterScrollBehavior}
 */
const scrollBehavior = (to, from, savedPosition) => {
  if (to.hash) {
    return { el: to.hash, top: HEADER_OFFSET, behavior: "smooth" };
  }
  if (savedPosition) {
    return savedPosition;
  }
  // Wait for the 200ms route fade-in (AppContentTransition) so the jump to
  // top lands on the incoming page instead of flashing the outgoing one.
  return new Promise((resolve) => setTimeout(() => resolve({ top: 0, behavior: "smooth" }), 200));
};

/** Application Vue Router instance. @type {import("vue-router").Router} */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior,
});

/**
 * Update the browser title from the destination route's metadata.
 * @param {import("vue-router").RouteLocationNormalized} to - Completed destination route.
 * @returns {void}
 */
function updateDocumentTitle(to) {
  document.title = to.meta.title ? `${SITE_NAME} · ${to.meta.title}` : SITE_NAME;
}

router.afterEach(updateDocumentTitle);

export default router;
