import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "../appSettings/router";

import { useAuthStore } from "../stores/useAuthStore";
import { useCommonStore } from "../stores/useCommonStore";

import { i18n } from "../appSettings/export/locales/local";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(i18n);

const applyConfig = (config: any) => {
  if (!config) return;
  const commonStore = useCommonStore();
  commonStore.updateVisual(config);
  if (config.language && i18n.global) i18n.global.locale.value = config.language;
};

const bootstrap = async () => {
  const authStore = useAuthStore();
  const commonStore = useCommonStore();
  await authStore.initialize();

  if (authStore.isAuthenticated && authStore.userId) {
    await authStore.loadUserData();
    applyConfig(commonStore.common);
  } else router.push("/signup");
  app.mount("#app");
};

bootstrap();
