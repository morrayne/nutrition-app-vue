// MAIN IMPORTS
// vue & app
import App from "./App.vue";
import { createApp } from "vue";
import { useTheme } from "../utils/useTheme";
const app = createApp(App);
// router & pinia
import { createPinia } from "pinia";
const pinia = createPinia();
app.use(pinia);
import router from "../utils/router";
app.use(router);
// store
import { useAuthStore } from "../store/useAuthStore";
import { useUserStore } from "../store/useUserStore";
const authStore = useAuthStore();
const userStore = useUserStore();

// FUNCTION
// bootstrap
const bootstrap = async () => {
  userStore.loadAvailableAvatars();
  await authStore.initialize();
  const { initialize: initializeTheme } = useTheme();
  initializeTheme();
  app.mount("#app");
  if (!userStore.common.firstLogin) {
    router.push("/health");
  } else {
    router.push("/settings");
  }
};

// APP START
bootstrap();
