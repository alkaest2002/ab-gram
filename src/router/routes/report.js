// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { useGroupStore } from "@/stores/group";
import { useReportStore } from "@/stores/report";

/**
 * Report-generation routes guarded by group and report lifecycle state.
 *
 * Entering any report route requires a completed group. The generated
 * report child adds a second guard so it cannot be opened before analysis has
 * completed successfully.
 *
 * @type {import("vue-router").RouteRecordRaw}
 */
const reportRoute = {
  path: "/report",
  redirect: { name: "reportGenerating" },
  beforeEnter() {
    const groupStore = useGroupStore();

    if (groupStore.membersStatus === "completed") {
      return true;
    }

    return {
      name:
        groupStore.membersStatus === "empty" ? "reportNoDataError" : "reportIncompleteDataError",
    };
  },
  meta: {
    title: "Report",
    inMenu: false,
    typeOfMenu: null,
  },
  children: [
    {
      path: "generating",
      name: "reportGenerating",
      component: () => import("@/components/views/report/ReportGenerating.vue"),
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

        return { name: "reportGenerating" };
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
