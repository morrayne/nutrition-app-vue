import { createApp } from "vue";
import App from "./App.vue";

import { createPinia } from "pinia";
const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

import router from "../appSettings/router.ts";
app.use(router);

import { useAuthStore } from "../stores/main/useAuthStore.ts";
import { useConfigStore } from "../stores/single/useConfigStore.ts";
import { useActiveDayStore } from "../stores/array/useActiveDayStore.ts";
import { useCommonStore } from "../stores/single/useCommonStore.ts";

const bootstrap = async () => {
  const authStore = useAuthStore();
  const configStore = useConfigStore();
  const commonStore = useCommonStore();
  const activeDayStore = useActiveDayStore();
  await authStore.initialize();
  if (authStore.isAuthenticated && authStore.userId) {
    configStore.changeVisualViaConfig(configStore.config);
    await activeDayStore.addToday();
    commonStore.common.online = true;
    commonStore.updateCommon();
  } else {
    router.push("/signup");
  }
  app.mount("#app");
};

bootstrap();