import { createRouter, createWebHistory } from "vue-router";

import { waitForPageTransition, preferredScrollBehavior } from "@/router/scroll";

import homeRoutes from "@/router/routes.home";
import sociogramRoutes from "@/router/routes.sociogram";
import reportRoutes from "@/router/routes.report";
import notifyRoutes from "@/router/routes.notify";
import docsRoutes from "@/router/routes.docs";
import aboutRoutes from "@/router/routes.about";
import privacyRoutes from "@/router/routes.privacy";
import notFoundRoutes from "@/router/routes.not-found";

const SITE_NAME = "AB-Grid";

// The site header is sticky; scrolling to an anchor needs this offset so the
// heading lands just below it instead of underneath it (4.25rem ≈ 76px + gap).
const HEADER_OFFSET = 88;

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
    // Only wait for a page transition when the top-level route changes — that's
    // what triggers the `<Transition>` in App.vue. Nested navigations (e.g.
    // between docs pages) have no transition to wait for.
    if (to.matched[0] !== from.matched[0]) {
      await waitForPageTransition();
    }

    if (to.hash) {
      return {
        el: to.hash,
        top: HEADER_OFFSET,
        behavior: preferredScrollBehavior(),
      };
    }

    return savedPosition ?? { top: 0 };
  },
});

router.afterEach((to) => {
  document.title = to.meta.title
    ? `${to.meta.title} — ${SITE_NAME}`
    : SITE_NAME;
});

export default router;
