export default {
  path: "/:pathMatch(.*)*",
  name: "not-found",
  component: () => import("@/components/views/NotFound.vue"),
  meta: {
    title: "AB-Gram · 404",
    inMenu: false,
    layout: "EmptyLayout",
  },
};
