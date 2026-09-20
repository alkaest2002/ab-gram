import { createRouter, createWebHistory } from "vue-router";

import { useAppStore } from "@/stores/app";
import { waitForPageTransition } from "@/router/scroll";

import Home from "@/components/views/home/Home.vue";

const SITE_NAME = "AB-Grid";

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
    component: () => import("@/components/views/sociogram/Sociogram.vue"),
    meta: {
      title: "App",
      inMenu: true,
      typeOfMenu: ["header"],
      layout: "DefaultLayout",
      // Hand-drawn SVG paths: no icon dependency, no files to load.
      icon: [
        "M18 2a3 3 0 1 0 0 6a3 3 0 1 0 0-6",
        "M6 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6",
        "M18 16a3 3 0 1 0 0 6a3 3 0 1 0 0-6",
        "M8.59 13.51l6.83 3.98",
        "M15.41 6.51l-6.82 3.98",
      ],
    },
  },
  {
    path: "/report",
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
    name: "notfy",
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
        meta: {
          title: "Informazione",
          inMenu: false,
          typeOfMenu: null,
          layout: "DefaultLayout",
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
          layout: "DefaultLayout",
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
      icon: [
        "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z",
        "M14 2v4a2 2 0 0 0 2 2h4",
        "M10 9H8",
        "M16 13H8",
        "M16 17H8",
      ],
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
      icon: [
        "M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20",
        "M12 16v-4",
        "M12 8h.01",
      ],
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
