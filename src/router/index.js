import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import { waitForPageTransition } from "@/router/scroll";

const SITE_NAME = "AB-Grid";

// Routes of /app, exported separately: the sub-navigation reads them from here and
// shows only those with `meta.label`. The first is the entry page: without
// a label it stays out of the sub-navigation, which keeps showing the three steps.
export const sociogramRoutes = [
  {
    path: "",
    name: "app-start",
    component: () => import("@/views/sociogram/SociogramStartView.vue"),
    meta: {
      label: "Inizia",
      title: "Da dove iniziare",
      inMenu: true,
      typeOfMenu: ["header"],
    },
  },
  {
    path: "load-members",
    name: "load-members",
    component: () => import("@/views/sociogram/SociogramLoadMembersView.vue"),
    meta: {
      label: "Membri",
      title: "Carica i membri",
      inMenu: true,
      typeOfMenu: ["header"],
    },
  },
  {
    path: "set-preferences",
    name: "set-preferences",
    component: () =>
      import("@/views/sociogram/SociogramSetPreferencesView.vue"),
    meta: {
      label: "Preferenze",
      title: "Imposta le preferenze",
      inMenu: true,
      typeOfMenu: ["header"],
    },
  },
  {
    path: "generate-report",
    name: "generate-report",
    component: () =>
      import("@/views/sociogram/SociogramGenerateReportView.vue"),
    meta: {
      label: "Report",
      title: "Genera il report",
      inMenu: true,
      typeOfMenu: ["header"],
    },
  },
];

export const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { label: "Home", title: "Sociogrammi di gruppo", inMenu: false },
  },
  {
    path: "/sociogram",
    component: () => import("@/views/SociogramView.vue"),
    meta: {
      label: "App",
      title: "Costruisci il sociogramma",
      inMenu: true,
      typeOfMenu: ["header"],
    },
    children: sociogramRoutes,
  },
  {
    path: "/docs",
    name: "docs",
    component: () => import("@/views/DocsView.vue"),
    meta: {
      label: "Docs",
      title: "Docs",
      inMenu: true,
      typeOfMenu: ["header"],
    },
  },
  {
    path: "/about",
    name: "about",
    component: () => import("@/views/AboutView.vue"),
    meta: {
      label: "About",
      title: "About",
      inMenu: true,
      typeOfMenu: ["header", "footer"],
    },
  },
  {
    path: "/privacy",
    name: "privacy",
    component: () => import("@/views/PrivacyView.vue"),
    meta: {
      label: "Privacy",
      title: "Informativa privacy",
      inMenu: true,
      typeOfMenu: ["footer"],
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/views/NotFoundView.vue"),
    meta: { title: "Pagina non trovata" },
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
