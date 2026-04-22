import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "../appSettings/router";

import { useAuthStore } from "../stores/useAuthStore";
import { useConfigStore } from "../stores/useConfigStore";
import { useCommonStore } from "../stores/useCommonStore";
import { useBodyStore } from "../stores/useBodyStore";
import { useGoalStore } from "../stores/useGoalStore";
import { useWeightLogStore } from "../stores/useWeightLogStore";
import { useMealAssetSavedStore } from "../stores/useMealAssetSavedStore";
import { useMealAssetGroupStore } from "../stores/useMealAssetGroupStore";
import { useMealTableStore } from "../stores/useMealTableStore";

import { i18n } from "../appSettings/locales/local";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(i18n);

const applyConfig = (config: any) => {
  if (!config) return;
  const configStore = useConfigStore();
  configStore.changeAttrByStore(config);
  if (config.language && i18n.global) i18n.global.locale.value = config.language;
};

const bootstrap = async () => {
  const authStore = useAuthStore();
  const configStore = useConfigStore();
  const commonStore = useCommonStore();
  const bodyStore = useBodyStore();
  const goalStore = useGoalStore();
  const weightLogStore = useWeightLogStore();
  const mealAssetSavedStore = useMealAssetSavedStore();
  const mealAssetGroupStore = useMealAssetGroupStore();
  const mealTableStore = useMealTableStore();
  await authStore.initialize();
  if (authStore.isAuthenticated && authStore.userId) {
    await Promise.all([
      configStore.getStore(),
      commonStore.getStore(),
      bodyStore.getStore(),
      goalStore.getStore(),
      weightLogStore.getStore(),
      mealAssetSavedStore.getStore(),
      mealAssetGroupStore.getStore(),
      mealTableStore.getStore()
    ]);
    applyConfig(configStore.config);
  } else router.push("/auth");
  app.mount("#app");
};

bootstrap();
