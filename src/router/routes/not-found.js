// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

export default {
  path: "/:pathMatch(.*)*",
  name: "not-found",
  component: () => import("@/components/views/NotFound.vue"),
  meta: {
    title: "Errore 404",
    inMenu: false,
    layout: "EmptyLayout",
  },
};
