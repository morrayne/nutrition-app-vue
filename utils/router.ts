// vue router
import { createRouter, createWebHistory } from "vue-router";
// pages import
import HealthPage from "../pages/health_main.vue";
import NotFoundPage from "../pages/notfound.vue";
import SettingsPage from "../pages/settings_main.vue";
import LoginPage from "../pages/login_main.vue";
// routes
const routes = [
  {
    path: "/",
    name: "blank",
    redirect: "home",
  },
  {
    path: "/health",
    name: "health",
    component: HealthPage,
  },
  {
    path: "/settings",
    name: "settings",
    component: SettingsPage,
  },
  {
    path: "/login",
    name: "login",
    component: LoginPage,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFoundPage,
  },
];
// router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
// router export
export default router;
