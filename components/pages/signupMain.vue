<script setup lang="ts">
import { ref, watch } from "vue";
import router from "../../appSettings/router";
import control from "./signupFolder/control.vue";
import loadingCover from "../ui/loadingCover.vue";
import signinError from "./signupFolder/siginError.vue";

import { useConfigStore } from "../../stores/single/useConfigStore";
const configStore = useConfigStore();
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
    if (loginError.value) return;
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
    }
  }
});

import configView from "./signupFolder/config.vue";
import bodyView from "./signupFolder/body.vue";
import goalView from "./signupFolder/goal.vue";
import authView from "./signupFolder/auth.vue";
</script>

<template>
  <loadingCover v-if="loading" />
  <div class="screen signup">
    <control v-model="viewCurrent" />
    <signinError :error="loginError" />
    <div class="view" :class="{ prev: 0 < viewCurrent, current: 0 === viewCurrent, next: 0 > viewCurrent }">
      <configView v-model="config" />
    </div>
    <div class="view" :class="{ prev: 1 < viewCurrent, current: 1 === viewCurrent, next: 1 > viewCurrent }">
      <bodyView v-model="body" />
    </div>
    <div class="view" :class="{ prev: 2 < viewCurrent, current: 2 === viewCurrent, next: 2 > viewCurrent }">
      <goalView v-model="goal" :body="body" />
    </div>
    <div class="view" :class="{ prev: 3 < viewCurrent, current: 3 === viewCurrent, next: 3 > viewCurrent }">
      <authView v-model="auth" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.signup {
  position: relative;
  overflow: hidden;
  .view {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: transform 0.3s ease;
    &.prev {
      transform: translateX(-100%);
      visibility: hidden;
    }
    &.current {
      transform: translateX(0);
      visibility: visible;
    }
    &.next {
      transform: translateX(100%);
      visibility: hidden;
    }
  }
}
</style>
