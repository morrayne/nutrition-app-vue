import { createRouter, createWebHistory } from "vue-router";

import { useAuthStore } from "../stores/useAuthStore";

// guest only
import signup from "../pages/signup/main.vue";
import signin from "../pages/signin/main.vue";
// auth user only
import home from "../pages/home/main.vue";
import meal from "../pages/meal/main.vue";
import sport from "../pages/sport/main.vue";
import pill from "../pages/pill/main.vue";
import account from "../pages/account/main.vue";

const routes = [
  { path: "/", name: "blank", redirect: "auth" },
  // guest only
  { path: "/signup", name: "signup", component: signup, meta: { requiresGuest: true } },
  { path: "/signin", name: "signin", component: signin, meta: { requiresGuest: true } },
  // auth user only
  { path: "/home", name: "home", component: home, meta: { requiresAuth: true } },
  { path: "/meal", name: "meal", component: meal, meta: { requiresAuth: true } },
  { path: "/sport", name: "sport", component: sport, meta: { requiresAuth: true } },
  { path: "/pill", name: "pill", component: pill, meta: { requiresAuth: true } },
  { path: "/account", name: "account", component: account, meta: { requiresAuth: true } },
];

const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  if (!authStore.isInitialized) await authStore.initialize();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/signup");
    return;
  }
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next("/home");
    return;
  }
  next();
});

export default router;
