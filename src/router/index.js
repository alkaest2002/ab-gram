import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import { waitForPageTransition } from "@/router/scroll";
import { useAppStore } from "@/stores/app";

const SITE_NAME = "AB-Grid";

export const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: {
      title: "Sociogrammi di gruppo",
      inMenu: false,
      layout: "DefaultLayout",
    },
  },
  {
    path: "/sociogram",
    component: () => import("@/views/SociogramView.vue"),
    meta: {
      title: "App",
      inMenu: true,
      typeOfMenu: ["header"],
      layout: "DefaultLayout",
    },
  },
  {
    path: "/docs",
    name: "docs",
    component: () => import("@/views/DocsView.vue"),
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
    component: () => import("@/views/AboutView.vue"),
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
    component: () => import("@/views/PrivacyView.vue"),
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
    component: () => import("@/views/NotFoundView.vue"),
    meta: { title: "Pagina non trovata", layout: "NotFoundLayout" },
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

// Keep the app store's layout in sync with the route being navigated to.
router.beforeEach((to) => {
  useAppStore().setLayout(to.meta.layout ?? "DefaultLayout");
});

router.afterEach((to) => {
  document.title = to.meta.title
    ? `${to.meta.title} — ${SITE_NAME}`
    : SITE_NAME;
});

export default router;
