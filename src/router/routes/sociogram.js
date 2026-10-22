export default {
  path: "/sociogram",
  name: "sociogram",
  component: () => import("@/components/views/sociogram/Sociogram.vue"),
  meta: {
    title: "AB-Gram · App",
    inMenu: true,
    typeOfMenu: ["header"],
    layout: "DefaultLayout",
  },
};
