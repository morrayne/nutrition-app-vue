import { createApp } from "vue";
import App from "./App.vue";

import { createPinia } from "pinia";
const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

import router from "../appSettings/router.ts";
app.use(router);

import { useAuthStore } from "../stores/main/useAuthStore.ts";
import { useActiveDayStore } from "../stores/array/useActiveDayStore.ts";
import { useCommonStore } from "../stores/single/useCommonStore.ts";
import { useConfigStore } from "../stores/single/useConfigStore.ts";

window.addEventListener('beforeunload', () => {
  const authStore = useAuthStore();
  const commonStore = useCommonStore();
  const activeDayStore = useActiveDayStore();
  
  if (authStore.isAuthenticated && authStore.userId) {
    commonStore.common.online = false;
    commonStore.updateCommon();
    activeDayStore.addToday().catch(console.error);
  }
});

const bootstrap = async () => {
  const authStore = useAuthStore();
  const commonStore = useCommonStore();
  const activeDayStore = useActiveDayStore();
  const configStore = useConfigStore();
  configStore.changeVisualViaConfig(configStore.config); 

  await authStore.initialize();
  if (authStore.isAuthenticated && authStore.userId) {
    await configStore.getConfig();       
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
