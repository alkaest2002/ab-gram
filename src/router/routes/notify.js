export default {
  path: "/notify",
  name: "notify",
  component: "",
  redirect: "/notify/generic-error",
  meta: {
    title: "AB-Gram · Notify",
    inMenu: false,
    typeOfMenu: null,
    layout: "EmptyLayout",
  },
  children: [
    {
      path: "generic-error",
      name: "genericError",
      component: () => import("@/components/views/notify/GenericError.vue"),
      meta: {
        title: "Informazione",
        inMenu: false,
        typeOfMenu: null,
        layout: "EmptyLayout",
      },
    },
    {
      path: "sociogram-validation-error",
      name: "sociogramValidatioError",
      component: () => import("@/components/views/notify/SociogramDataValidationError.vue"),
      meta: {
        title: "Informazione",
        inMenu: false,
        typeOfMenu: null,
        layout: "EmptyLayout",
      },
    },
    {
      path: "report-no-data-error",
      name: "reportNoDataError",
      component: () => import("@/components/views/notify/ReportNoDataError.vue"),
      meta: {
        title: "Informazione",
        inMenu: false,
        typeOfMenu: null,
        layout: "EmptyLayout",
      },
    },
    {
      path: "report-incomplete-data-error",
      name: "reportIncompleteDataError",
      component: () => import("@/components/views/notify/ReportIncompleteDataError.vue"),
      meta: {
        title: "Informazione",
        inMenu: false,
        typeOfMenu: null,
        layout: "EmptyLayout",
      },
    },
    {
      path: "report-error",
      name: "reportError",
      component: () => import("@/components/views/notify/ReportError.vue"),
      meta: {
        title: "Informazione",
        inMenu: false,
        typeOfMenu: null,
        layout: "EmptyLayout",
      },
    },
    {
      path: "report-stopped",
      name: "reportStopped",
      component: () => import("@/components/views/notify/ReportStopped.vue"),
      meta: {
        title: "Informazione",
        inMenu: false,
        typeOfMenu: null,
        layout: "EmptyLayout",
      },
    },
    {
      path: "file-input-error",
      name: "fileInputError",
      component: () => import("@/components/views/notify/FileInputError.vue"),
      meta: {
        title: "Informazione",
        inMenu: false,
        typeOfMenu: null,
        layout: "EmptyLayout",
      },
    },
  ],
};
