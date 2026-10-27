// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

export default {
  path: "/notify",
  name: "notify",
  component: "",
  redirect: "/notify/generic-error",
  meta: {
    title: "Notify",
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
        title: "Errore Generico",
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
        title: "Errore di Validazione",
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
        title: "Errore per Dati Mancanti",
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
        title: "Errore per Dati Incompleti",
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
        title: "Errore nella Generazione del Report",
        inMenu: false,
        typeOfMenu: null,
        layout: "EmptyLayout",
      },
    },
    {
      path: "report-stopped",
      name: "Avviso di Annullamento della Generazione del Report",
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
      name: "Errore nel File di Input",
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
