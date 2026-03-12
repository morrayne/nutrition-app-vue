// IMPORTS
// vue router
import { createRouter, createWebHistory } from "vue-router";
// pages
import sign_up_page from "../pages/sign_up_main.vue";
import sign_in_page from "../pages/sign_in_main.vue";
import account_page from "../pages/account_main.vue";
import home_page from "../pages/home_main.vue";

// CONTENT
// routes
const routes = [
  {
    path: "/",
    name: "blank",
    redirect: "home",
  },
  {
    path: "/signup",
    name: "signup",
    component: sign_up_page,
  },
  {
    path: "/signin",
    name: "signin",
    component: sign_in_page,
  },
  {
    path: "/home",
    name: "home",
    component: home_page,
  },
  {
    path: "/account",
    name: "account",
    component: account_page,
  },
];

// EXPORTS
// router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
export default router;
