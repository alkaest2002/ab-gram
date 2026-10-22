import { useSociogramStore } from "@/stores/sociogram";
import { useReportStore } from "@/stores/report";

export default {
  path: "/report",
  component: "",
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
    title: "AB-Gram · Report",
    inMenu: false,
    typeOfMenu: null,
  },
  children: [
    {
      path: "",
      name: "report",
      component: () => import("@/components/views/report/Report.vue"),
      meta: {
        title: "Report",
        inMenu: false,
        typeOfMenu: null,
        layout: "EmptyLayout",
      },
    },
    {
      path: "generated",
      name: "reportGenerated",
      component: () => import("@/components/views/report/ReportGenerated.vue"),
      beforeEnter() {
        const reportStore = useReportStore();

        if (reportStore.status === "generated") {
          return true;
        }

        return { name: "report" };
      },
      meta: {
        title: "AB-Gram · Report",
        inMenu: false,
        typeOfMenu: null,
        layout: "ReportLayout",
      },
    },
  ],
};
