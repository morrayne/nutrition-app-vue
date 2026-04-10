import { createRouter, createWebHistory } from "vue-router";

import signupPage from "../components/pages/signupMain.vue";
import signinPage from "../components/pages/signinMain.vue";
import accountPage from "../components/pages/accountMain.vue";
import homePage from "../components/pages/homeMain.vue";
import mealPage from "../components/pages/mealMain.vue";

const routes = [
  { path: "/", name: "blank", redirect: "signup", meta: { showNavigation: false } },
  { path: "/signup", name: "signup", component: signupPage, meta: { showNavigation: false } },
  { path: "/signin", name: "signin", component: signinPage, meta: { showNavigation: false } },
  { path: "/account", name: "account", component: accountPage, meta: { showNavigation: true } },
  { path: "/home", name: "home", component: homePage, meta: { showNavigation: true } },
  { path: "/meal", name: "meal", component: mealPage, meta: { showNavigation: true } },
];

const router = createRouter({ history: createWebHistory(), routes });
export default router;
