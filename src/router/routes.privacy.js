export default {
  path: "/privacy",
  name: "privacy",
  component: () => import("@/components/views/Privacy.vue"),
  meta: {
    title: "Informativa privacy",
    inMenu: true,
    typeOfMenu: ["footer"],
    layout: "DefaultLayout",
  },
};
