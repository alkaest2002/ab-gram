// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

export default {
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
