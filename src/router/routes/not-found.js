// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

/** Catch-all route rendered when no earlier route matches. @type {import("vue-router").RouteRecordRaw} */
const notFoundRoute = {
  path: "/:pathMatch(.*)*",
  name: "not-found",
  component: () => import("@/components/views/NotFound.vue"),
  meta: {
    title: "Errore 404",
    inMenu: false,
    layout: "EmptyLayout",
  },
};

export default notFoundRoute;
