// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import Home from "@/components/views/home/Home.vue";

/** Application landing-page route. @type {import("vue-router").RouteRecordRaw} */
const homeRoute = {
  path: "/",
  name: "home",
  component: Home,
  meta: {
    title: "Home",
    inMenu: false,
    layout: "DefaultLayout",
  },
};

export default homeRoute;
