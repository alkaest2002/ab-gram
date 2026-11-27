// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

/** Group creation and editing workflow route. @type {import("vue-router").RouteRecordRaw} */
const groupRoute = {
  path: "/group",
  alias: "/sociogram",
  name: "group",
  component: () => import("@/components/views/group/Group.vue"),
  meta: {
    title: "App",
    inMenu: true,
    typeOfMenu: ["header"],
    layout: "DefaultLayout",
  },
};

export default groupRoute;
