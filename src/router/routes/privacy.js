export default {
  path: "/privacy",
  name: "privacy",
  component: () => import("@/components/views/privacy/Privacy.vue"),
  meta: {
    title: "AB-Gram · Privacy",
    inMenu: true,
    typeOfMenu: ["footer"],
    layout: "DefaultLayout",
  },
};
