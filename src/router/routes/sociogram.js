// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

/** Sociogram creation and editing workflow route. @type {import("vue-router").RouteRecordRaw} */
const sociogramRoute = {
  path: "/sociogram",
  name: "sociogram",
  component: () => import("@/components/views/sociogram/Sociogram.vue"),
  meta: {
    title: "App",
    inMenu: true,
    typeOfMenu: ["header"],
    layout: "DefaultLayout",
  },
};

export default sociogramRoute;
