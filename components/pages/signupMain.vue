<script setup lang="ts">
import { ref, watch } from "vue";
import router from "../../appSettings/router";
import control from "./signupFolder/control.vue";
import loadingCover from "../ui/loadingCover.vue";
import signinError from "./signupFolder/siginError.vue";

import { useConfigStore } from "../../stores/single/useConfigStore";
const configStore = useConfigStore();
console.log(configStore.config.theme)
import { useAuthStore } from "../../stores/main/useAuthStore";
const authStore = useAuthStore();

import type { tConfig } from "../../stores/main/types";
const config = ref<tConfig>({
  theme: configStore.config.theme || "light",
  phoneColor: "green",
  language: "en",
  newrem: "16",
});
import type { tAuth } from "../../stores/main/types";
const auth = ref<tAuth>({
  email: "",
  password: "",
  username: "",
});
import type { tCommon } from "../../stores/main/types";
const common = ref<tCommon>({
  email: "",
  username: "",
  icon: 0,
  online: false,
});
watch(auth, () => {
  common.value.email = auth.value.email;
  common.value.username = auth.value.username;
}, { deep: true });
import type { tBody } from "../../stores/main/types";
const body = ref<tBody>({
  gender: "male",
  age: undefined,
  height: undefined,
  activity: 1.2,
  weight: undefined,
  bf: undefined,
});
import type { tGoal } from "../../stores/main/types";
const goal = ref<tGoal>({
  calories: undefined,
  proteins: undefined,
  carbs: undefined,
  fats: undefined,
  weight: undefined,
  bf: undefined,
});

const viewCurrent = ref(0);
const loading = ref(false);
const loginError = ref(false);
watch(viewCurrent, async (newVal) => {
  if (newVal < 0) {
    viewCurrent.value = 0;
    return;
  }
  if (newVal > 3) {
    viewCurrent.value = 3;
    if (loginError.value) return
    loading.value = true;
    console.warn('signup attempt: ', auth.value, common.value, config.value, body.value, goal.value);
    const result = await authStore.signUp(auth.value, common.value, config.value, body.value, goal.value);
    if (result.success) router.push('/account');
    else {
      loading.value = false;
      loginError.value = true;
      setTimeout(() => {
        loginError.value = false;
      }, 5000);
    };
  }
});
const viewTransformStyle = (index: number) => {
  if (index < viewCurrent.value) return "translateX(-100%)";
  else if (index > viewCurrent.value) return "translateX(100%)";
  else return "translateX(0%)";
};

import configView from "./signupFolder/config.vue";
import bodyView from "./signupFolder/body.vue";
import goalView from "./signupFolder/goal.vue";
import authView from "./signupFolder/auth.vue";
</script>

<template>
  <div class="screen signup">
    <control v-model="viewCurrent" />
    <loadingCover v-if="loading" />
    <signinError :error="loginError" />
    <div class="view" :style="{ transform: viewTransformStyle(0) }">
      <configView v-model="config" />
    </div>
    <div class="view" :style="{ transform: viewTransformStyle(1) }">
      <bodyView v-model="body" />
    </div>
    <div class="view" :style="{ transform: viewTransformStyle(2) }">
      <goalView v-model="goal" :body="body" />
    </div>
    <div class="view" :style="{ transform: viewTransformStyle(3) }">
      <authView v-model="auth" />
    </div>
  </div>
</template>
