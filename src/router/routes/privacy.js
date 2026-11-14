// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

/** Privacy page route shown in the footer menu. @type {import("vue-router").RouteRecordRaw} */
const privacyRoute = {
  path: "/privacy",
  name: "privacy",
  component: () => import("@/components/views/privacy/Privacy.vue"),
  meta: {
    title: "Privacy",
    inMenu: true,
    typeOfMenu: ["footer"],
    layout: "DefaultLayout",
  },
};

export default privacyRoute;
