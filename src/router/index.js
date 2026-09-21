import { createRouter, createWebHistory } from "vue-router";

import { useAppStore } from "@/stores/app";
import { waitForPageTransition } from "@/router/scroll";

import Home from "@/components/views/home/Home.vue";

const SITE_NAME = "AB-Grid";

// Notify views get their button destination from the router: the caller passes
// `to` as a query param and the route hands it down to the view as a `to` prop.
// Each view keeps a sensible fallback for direct visits.
const notifyProps = (fallbackTo) => (route) => ({
    to: route.query.to ?? fallbackTo,
});

export const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      title: "Sociogrammi di gruppo",
      inMenu: false,
      layout: "DefaultLayout",
    },
  },
  {
    path: "/sociogram",
    name: "sociogram",
    component: () => import("@/components/views/sociogram/Sociogram.vue"),
    meta: {
      title: "App",
      inMenu: true,
      typeOfMenu: ["header"],
      layout: "DefaultLayout",
    },
  },
  {
    path: "/report",
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
    path: "/notify",
    name: "notify",
    component: "",
    redirect: "/notify/generic-error",
    meta: {
      title: "Notify",
      inMenu: false,
      typeOfMenu: null,
      layout: "DefaultLayout",
    },
    children: [
      {
        path: "generic-error",
        name: "genericError",
        component: () => import("@/components/views/notify/GenericError.vue"),
        props: notifyProps("/"),
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
        props: notifyProps("/docs"),
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
        props: notifyProps("/sociogram"),
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
        props: notifyProps("/sociogram"),
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
        props: notifyProps("/sociogram"),
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
        props: notifyProps("/sociogram"),
        meta: {
          title: "Informazione",
          inMenu: false,
          typeOfMenu: null,
          layout: "EmptyLayout",
        },
      }
    ]
  },
  {
    path: "/docs",
    name: "docs",
    component: () => import("@/components/views/Docs.vue"),
    meta: {
      title: "Docs",
      inMenu: true,
      typeOfMenu: ["header"],
      layout: "DefaultLayout",
    },
  },
  {
    path: "/about",
    name: "about",
    component: () => import("@/components/views/About.vue"),
    meta: {
      title: "About",
      inMenu: true,
      typeOfMenu: ["header", "footer"],
      layout: "DefaultLayout",
    },
  },
  {
    path: "/privacy",
    name: "privacy",
    component: () => import("@/components/views/Privacy.vue"),
    meta: {
      title: "Informativa privacy",
      inMenu: true,
      typeOfMenu: ["footer"],
      layout: "DefaultLayout",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/components/views/NotFound.vue"),
    meta: {
      title: "Pagina non trovata",
      inMenu: false,
      layout: "EmptyLayout",
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // A single active class, shared by header and footer.
  // Note: RouterLink builds `{ [active]: isActive, [exact]: isExactActive }`,
  // so giving the two options the same name makes the second one win and the
  // active-but-not-exact links (the /app parent) end up with no class. Keep them distinct.
  linkActiveClass: "is-active",
  linkExactActiveClass: "is-exact-active",
  async scrollBehavior(to, from, savedPosition) {
    // Wait for the page transition to finish before scrolling, so the outgoing
    // page doesn't jump while it is still fading out (see `src/router/scroll.js`).
    await waitForPageTransition();
    return savedPosition ?? { top: 0 };
  },
});

router.afterEach((to) => {
  document.title = to.meta.title
    ? `${to.meta.title} — ${SITE_NAME}`
    : SITE_NAME;
});

export default router;
