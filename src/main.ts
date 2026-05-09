import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "../appSettings/router";

import { useAuthStore } from "../stores/useAuthStore";
import { useCommonStore } from "../stores/useCommonStore";
import { useBodyStore } from "../stores/useBodyStore";
import { useWeightLogStore } from "../stores/useWeightLogStore";
import { useProductStore } from "../stores/useProductStore";
import { useMealStore } from "../stores/useMealStore";
import { useFoodHistoryStore } from "../stores/useFoodHistoryStore";

import { i18n } from "../appSettings/locales/local";

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
  const bodyStore = useBodyStore();
  const weightLogStore = useWeightLogStore();
  const productStore = useProductStore();
  const mealStore = useMealStore();
  const foodHistoryStore = useFoodHistoryStore();
  await authStore.initialize();
  if (authStore.isAuthenticated && authStore.userId) {
    await Promise.all([
      commonStore.getStore(),
      bodyStore.getStore(),
      weightLogStore.getStore(),
      productStore.getStore(),
      mealStore.getStore(),
      foodHistoryStore.getStore()
    ]);
    applyConfig(commonStore.common);
  } else router.push("/signup");
  app.mount("#app");
};

bootstrap();
