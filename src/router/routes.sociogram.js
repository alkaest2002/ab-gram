export default {
  path: "/sociogram",
  name: "sociogram",
  component: () => import("@/components/views/sociogram/Sociogram.vue"),
  meta: {
    title: "App",
    inMenu: true,
    typeOfMenu: ["header"],
    layout: "DefaultLayout",
  },
};
