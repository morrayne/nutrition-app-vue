import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/main/useAuthStore";

import signupPage from "../components/pages/signupMain.vue";
import signinPage from "../components/pages/signinMain.vue";
import homePage from "../components/pages/homeMain.vue";
import mealPage from "../components/pages/mealMain.vue";
import analysisPage from "../components/pages/analysisMain.vue";
import accountPage from "../components/pages/accountMain.vue";

const routes = [
  { path: "/", name: "blank", redirect: "signup", meta: { showNavigation: false, requiresGuest: true } },
  { path: "/signup", name: "signup", component: signupPage, meta: { showNavigation: false, requiresGuest: true } },
  { path: "/signin", name: "signin", component: signinPage, meta: { showNavigation: false, requiresGuest: true } },
  { path: "/home", name: "home", component: homePage, meta: { showNavigation: true, requiresAuth: true } },
  { path: "/meal", name: "meal", component: mealPage, meta: { showNavigation: true, requiresAuth: true } },
  { path: "/analysis", name: "analysis", component: analysisPage, meta: { showNavigation: true, requiresAuth: true } },
  { path: "/account", name: "account", component: accountPage, meta: { showNavigation: true, requiresAuth: true } },
];

const router = createRouter({ history: createWebHistory(), routes });
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  if (!authStore.isInitialized) await authStore.initialize();
  const isAuthenticated = authStore.isAuthenticated;
  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/signin");
    return;
  }
  if (to.meta.requiresGuest && isAuthenticated) {
    next("/home");
    return;
  }
  next();
});

export default router;
