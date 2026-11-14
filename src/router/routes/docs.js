// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import Docs from "@/components/views/docs/Docs.vue";
import { navigation, flatOrdered } from "@/docs/navigation";

/**
 * Lazy Markdown page components keyed by root-relative source path.
 *
 * Using an alias glob produces keys such as
 * `/src/docs/mds/<section>/<slug>.md`.
 */
const pages = import.meta.glob("@/docs/mds/**/*.md");

/**
 * Convert documentation navigation entries into nested Vue Router records.
 *
 * Child paths are relative to `/docs`, and route names are derived from each
 * section/slug pair to remain unique across the documentation tree.
 *
 * @type {import("vue-router").RouteRecordRaw[]}
 */
const children = navigation.flatMap((section) =>
  section.items.map((item) => {
    const relative = item.path.replace(/^\/docs\//, ""); // "folder/slug"
    return {
      path: relative,
      name: `docs-${relative.replaceAll("/", "-")}`,
      component: pages[`/src/docs/mds/${relative}.md`],
      meta: { title: item.title },
    };
  }),
);

/** Documentation shell with one generated child route per Markdown page. @type {import("vue-router").RouteRecordRaw} */
const docsRoute = {
  path: "/docs",
  name: "docs",
  component: Docs,
  redirect: flatOrdered[0]?.path,
  meta: {
    title: "Docs",
    inMenu: true,
    typeOfMenu: ["header"],
    layout: "DefaultLayout",
  },
  children,
};

export default docsRoute;
