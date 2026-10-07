import { createRouter, createWebHistory } from "vue-router";

import { waitForPageTransition } from "@/router/scroll";

import homeRoutes from "@/router/routes.home";
import sociogramRoutes from "@/router/routes.sociogram";
import reportRoutes from "@/router/routes.report";
import notifyRoutes from "@/router/routes.notify";
import docsRoutes from "@/router/routes.docs";
import aboutRoutes from "@/router/routes.about";
import privacyRoutes from "@/router/routes.privacy";
import notFoundRoutes from "@/router/routes.not-found";

const SITE_NAME = "AB-Grid";

export const routes = [
  homeRoutes,
  sociogramRoutes,
  reportRoutes,
  notifyRoutes,
  docsRoutes,
  aboutRoutes,
  privacyRoutes,
  notFoundRoutes,
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
