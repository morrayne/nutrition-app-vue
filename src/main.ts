// MAIN IMPORTS
// vue & app
import App from "./App.vue";
import { createApp } from "vue";
const app = createApp(App);
// store
import { useAuthStore } from "../stores/useAuthStore";
import { useCommonStore } from "../stores/useCommonStore";
// router & pinia
import { createPinia } from "pinia";
const pinia = createPinia();
app.use(pinia);
import router from "../app_settings/router";
app.use(router);

// bootstrap
const bootstrap = async () => {
  const authStore = useAuthStore();
  const commonStore = useCommonStore();
  await authStore.initialize();
  if (authStore.isAuthenticated) await commonStore.loadAvailableAvatars();
  app.mount("#app");
  if (authStore.isAuthenticated) router.push("/account");
  else router.push("/signup");
};

// APP START
bootstrap();
