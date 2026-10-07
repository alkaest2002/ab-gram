import Docs from "@/components/views/docs/Docs.vue";
import { navigation, flatOrdered } from "@/docs/navigation";

// Lazy Markdown components, keyed by their path relative to this file.
const pages = import.meta.glob("../docs/mds/**/*.md");

const children = navigation.flatMap((section) =>
  section.items.map((item) => {
    const relative = item.path.replace(/^\/docs\//, ""); // "folder/slug"
    return {
      path: relative,
      name: `docs-${relative.replaceAll("/", "-")}`,
      component: pages[`../docs/mds/${relative}.md`],
      meta: { title: item.title },
    };
  }),
);

export default {
  path: "/docs",
  name: "docs",
  component: Docs,
  // `/docs` itself has no content, so it forwards to the first page.
  redirect: flatOrdered[0]?.path,
  meta: {
    title: "Docs",
    inMenu: true,
    typeOfMenu: ["header"],
    layout: "DefaultLayout",
  },
  children,
};
