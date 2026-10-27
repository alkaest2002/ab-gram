// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import Docs from "@/components/views/docs/Docs.vue";
import { navigation, flatOrdered } from "@/docs/navigation";

// Lazy Markdown components. With an alias glob, keys are root-relative
// (leading slash), e.g. "/src/docs/mds/folder/slug.md".
const pages = import.meta.glob("@/docs/mds/**/*.md");

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

export default {
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
