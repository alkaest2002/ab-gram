import "@/assets/styles/fonts/fonts.css";
import "@/assets/styles/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "@/App.vue";
import router from "@/router";

const app = createApp(App);

app.use(createPinia());
app.use(router);

await router.isReady();
app.mount("#app");

function preloadRoutes() {
  router.getRoutes().forEach((route) => {
    const component = route.components?.default
    if (typeof component === 'function') component()
  })
}

window.addEventListener('load', () => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(preloadRoutes)
  } else {
    setTimeout(preloadRoutes, 2000)
  }
})
