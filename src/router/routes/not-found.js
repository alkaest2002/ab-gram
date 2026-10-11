export default {
  path: "/:pathMatch(.*)*",
  name: "not-found",
  component: () => import("@/components/views/NotFound.vue"),
  meta: {
    title: "Pagina non trovata",
    inMenu: false,
    layout: "EmptyLayout",
  },
};
