import { createRouter, createWebHistory } from "vue-router";

import { useAuthStore } from "../stores/useAuthStore";

import authPage from "../components/pages/authPage.vue";
import dashboardPage from "../components/pages/dashboardPage.vue";

const routes = [
  { path: "/", name: "blank", redirect: "auth" },
  { path: "/auth", name: "auth", component: authPage, meta: { requiresGuest: true } },
  { path: "/dashboard", name: "dashboard", component: dashboardPage, meta: { requiresAuth: true } },

];

const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  if (!authStore.isInitialized) await authStore.initialize();
  const isAuthenticated = authStore.isAuthenticated;
  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/auth");
    return;
  }
  if (to.meta.requiresGuest && isAuthenticated) {
    next("/dashboard");
    return;
  }
  next();
});

export default router;
