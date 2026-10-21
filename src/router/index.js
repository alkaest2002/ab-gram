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
    return savedPosition ?? { top: 0 };
  },
});

router.afterEach((to) => {
  document.title = to.meta.title
    ? `${to.meta.title} — ${SITE_NAME}`
    : SITE_NAME;
});

export default router;
