// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

/** About page route shown in the header and footer menus. @type {import("vue-router").RouteRecordRaw} */
const aboutRoute = {
  path: "/about",
  name: "about",
  component: () => import("@/components/views/About.vue"),
  meta: {
    title: "About",
    inMenu: true,
    typeOfMenu: ["header", "footer"],
    layout: "DefaultLayout",
  },
};

export default aboutRoute;
