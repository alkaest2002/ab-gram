// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

export default {
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
