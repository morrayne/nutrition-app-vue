// IMPORTS
// vue router
import { createRouter, createWebHistory } from "vue-router";
// pages
import not_found_page from "../pages/not_found_main.vue";
import account_page from "../pages/account_main.vue";
import sign_up_page from "../pages/sign_up_main.vue";
import sign_in_page from "../pages/sign_in_main.vue";
import reshape_page from "../pages/reshape_main.vue";

// CONTENT
// routes
const routes = [
  {
    path: "/",
    name: "blank",
    redirect: "home",
  },
  {
    path: "/account",
    name: "account",
    component: account_page,
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
    path: "/reshape",
    name: "reshape",
    component: reshape_page,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: not_found_page,
  },
];

// EXPORTS
// router
const router = createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes });
export default router;
