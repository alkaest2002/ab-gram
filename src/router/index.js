import { createRouter, createWebHistory } from "vue-router";

import homeRoutes from "@/router/routes/home";
import sociogramRoutes from "@/router/routes/sociogram";
import reportRoutes from "@/router/routes/report";
import notifyRoutes from "@/router/routes/notify";
import docsRoutes from "@/router/routes/docs";
import aboutRoutes from "@/router/routes/about";
import privacyRoutes from "@/router/routes/privacy";
import notFoundRoutes from "@/router/routes/not-found";

const SITE_NAME = "AB-Gram";

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
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return { el: to.hash, top: HEADER_OFFSET, behavior: "smooth" };
    }
    if (savedPosition) {
      return savedPosition;
    }
    // Wait for the 200ms route fade-in (AppContentTransition) so the jump to
    // top lands on the incoming page instead of flashing the outgoing one.
    return new Promise((resolve) =>
      setTimeout(() => resolve({ top: 0, behavior: "smooth" }), 200),
    );
  },
});

router.afterEach((to) => {
  document.title = to.meta.title
    ? `${SITE_NAME} · ${to.meta.title}  `
    : SITE_NAME;
});

export default router;
