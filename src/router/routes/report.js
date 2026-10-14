import { useSociogramStore } from "@/stores/sociogram";

export default {
  path: "/report",
  name: "report",
  component: () => import("@/components/views/report/Report.vue"),
  beforeEnter() {
    const sociogramStore = useSociogramStore();

    if (sociogramStore.membersStatus === "completed") {
      return true;
    }

    return {
      name:
        sociogramStore.membersStatus === "empty"
          ? "reportNoDataError"
          : "reportIncompleteDataError",
    };
  },
  meta: {
    title: "Report",
    inMenu: false,
    typeOfMenu: null,
    layout: "ReportLayout",
  },
};
