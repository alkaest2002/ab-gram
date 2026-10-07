export default {
  path: "/report",
  name: "report",
  component: () => import("@/components/views/report/Report.vue"),
  meta: {
    title: "Report",
    inMenu: false,
    typeOfMenu: null,
    layout: "EmptyLayout",
  },
};
