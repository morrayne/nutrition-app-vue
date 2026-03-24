// IMPORTS
// vue router
import { createRouter, createWebHistory } from "vue-router";
import signUpPage from "../pages/signUpPage.vue";
import signInPage from "../pages/signInPage.vue";
import accountPage from "../pages/accountPage.vue";
import reshapePage from "../pages/reshapePage.vue";
import analysisPage from "../pages/analysisPage.vue";
import homePage from "../pages/homePage.vue";
import mealPage from "../pages/mealPage.vue";
// pages

// CONTENT
// routes
const routes = [
  {
    path: "/",
    name: "blank",
    redirect: "signup",
    meta: { showNav: false } 
  },
  {
    path: "/signup",
    name: "signup",
    component: signUpPage,
    meta: { showNav: false } 
  },
  {
    path: "/signin",
    name: "signin",
    component: signInPage,
    meta: { showNav: false } 
  },
  {
    path: "/account",
    name: "account",
    component: accountPage,
    meta: { showNav: true } 
  },
  {
    path: "/reshape",
    name: "reshape",
    component: reshapePage,
    meta: { showNav: true } 
  },
  {
    path: "/analysis",
    name: "analysis",
    component: analysisPage,
    meta: { showNav: true } 
  },
  {
    path: "/meal",
    name: "meal",
    component: mealPage,
    meta: { showNav: true } 
  },
  {
    path: "/home",
    name: "home",
    component: homePage,
    meta: { showNav: true } 
  },
];

// EXPORTS
// router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
export default router;
