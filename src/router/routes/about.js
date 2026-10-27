// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

export default {
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
