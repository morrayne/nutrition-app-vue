import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "../appSettings/router";

// auth
import { useAuthStore } from "../stores/useAuthStore";
// body & aommon & weighlog
import { useBodyStore } from "../stores/useBodyStore";
import { useCommonStore } from "../stores/useCommonStore";
import { useWeightLogStore } from "../stores/useWeightLogStore";
// food
import { useProductStore } from "../stores/useProductStore";
import { useMealStore } from "../stores/useMealStore";
import { useFoodHistoryStore } from "../stores/useFoodHistoryStore";
// sport
import { useExerciseStore } from "../stores/useExerciseStore";
import { useWorkoutStore } from "../stores/useWorkoutStore";
// meds
import { useMedicineStore } from "../stores/useMedicineStore";

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
  // auth
  const authStore = useAuthStore();
  // body & aommon & weighlog
  const bodyStore = useBodyStore();
  const commonStore = useCommonStore();
  const weightLogStore = useWeightLogStore();
  // food
  const productStore = useProductStore();
  const mealStore = useMealStore();
  const foodHistoryStore = useFoodHistoryStore();
  // sport
  const exerciseStore = useExerciseStore();
  const workoutStore = useWorkoutStore();
  // meds
  const medicineStore = useMedicineStore();

  await authStore.initialize();

  if (authStore.isAuthenticated && authStore.userId) {
    await Promise.all([commonStore.getStore(), bodyStore.getStore(), weightLogStore.getStore(), productStore.getStore(), mealStore.getStore(), foodHistoryStore.getStore(), exerciseStore.getStore(), workoutStore.getStore(), medicineStore.getStore()]);
    applyConfig(commonStore.common);
  } else router.push("/signup");
  app.mount("#app");
};

bootstrap();
