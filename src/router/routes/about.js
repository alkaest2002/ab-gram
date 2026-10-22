export default {
  path: "/about",
  name: "about",
  component: () => import("@/components/views/About.vue"),
  meta: {
    title: "AB-Gram · About",
    inMenu: true,
    typeOfMenu: ["header", "footer"],
    layout: "DefaultLayout",
  },
};
