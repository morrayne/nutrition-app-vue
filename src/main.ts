// MAIN IMPORTS
// vue & app
import App from "./App.vue";
import { createApp } from "vue";
import { useTheme } from "../app_settings/use_theme";
const app = createApp(App);
// router & pinia
import { createPinia } from "pinia";
const pinia = createPinia();
app.use(pinia);
import router from "../app_settings/router";
app.use(router);
// store
import { useAuthStore } from "../stores/useAuthStore";
import { useUserStore } from "../stores/useUserStore";

// FUNCTION
// bootstrap
const bootstrap = async () => {
  const authStore = useAuthStore();
  const userStore = useUserStore();
  userStore.loadAvailableAvatars();
  await authStore.initialize();
  const { initialize: initializeTheme } = useTheme();
  initializeTheme();
  app.mount("#app");
  if (authStore.isAuthenticated) {
    router.push("/account");
  } else {
    router.push("/signup");
  }
};

// APP START
bootstrap();
