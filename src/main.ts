// IMPORT
// vue & app
import { createApp } from "vue";
import App from "./App.vue";
// router & pinia
import router from "../appSettings/router.ts";
import { createPinia } from "pinia";
// store
import { useAuthStore } from "../stores/useAuthStore";
import { useCommonStore } from "../stores/useCommonStore";
// import { useConfigStore } from "../stores/useConfigStore.ts";

// USE
// app
const app = createApp(App);
// router & pinia
const pinia = createPinia();
app.use(pinia);
app.use(router);
// store
const authStore = useAuthStore();
const commonStore = useCommonStore();
// const configStore = useConfigStore();

// BOOTSTRAP
const bootstrap = async () => {
  await authStore.initialize();
  if (authStore.isAuthenticated) await commonStore.loadAvailableAvatars();
  else router.push("/signup");
  app.mount("#app");
};

// APP START
bootstrap();
