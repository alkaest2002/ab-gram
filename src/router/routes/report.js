// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { useSociogramStore } from "@/stores/sociogram";
import { useReportStore } from "@/stores/report";

/**
 * Report-generation routes guarded by sociogram and report lifecycle state.
 *
 * Entering any report route requires a completed sociogram. The generated
 * report child adds a second guard so it cannot be opened before analysis has
 * completed successfully.
 *
 * @type {import("vue-router").RouteRecordRaw}
 */
const reportRoute = {
  path: "/report",
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
        title: "Report",
        inMenu: false,
        typeOfMenu: null,
        layout: "ReportLayout",
      },
    },
  ],
};

export default reportRoute;
