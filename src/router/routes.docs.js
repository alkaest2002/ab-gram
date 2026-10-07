export default {
  path: "/docs",
  name: "docs",
  component: () => import("@/components/views/docs/Docs.vue"),
  meta: {
    title: "Docs",
    inMenu: true,
    typeOfMenu: ["header"],
    layout: "DefaultLayout",
  },
};
