import { createApp } from "vue";
import App from "./App.vue";
import router from "../appSettings/router.ts";
import { createPinia } from "pinia";
const app = createApp(App);
app.use(router);
const pinia = createPinia();
app.use(pinia);
import { useAuthStore, useCommonStore, useHistoryStore } from "../stores/index.ts";
const authStore = useAuthStore();
const commonStore = useCommonStore();
const historyStore = useHistoryStore();
const bootstrap = async () => {
  await authStore.initialize();
  if (authStore.isAuthenticated) {
    await commonStore.loadAvailableAvatars();
    // @ts-ignore
    historyStore.addActiveDay((new Date()).toISOString().split("T")[0]);
    historyStore.updateHistory();
  } else router.push("/signup");
  app.mount("#app");
};
bootstrap();
