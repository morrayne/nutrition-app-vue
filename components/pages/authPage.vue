<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { languageSelect, themeSwitcher, fontSizeSwitcher, weightInput, genderSelect, signSelect, activitySelect, bfInput, heightInput, ageInput, caloriesInput, proteinsInput, fatsInput, carbsInput, usernameInput, emailInput, passwordInput } from "../../appSettings/defaultExport";
import type { tCommon, tConfig, tGoal, tBody, tAuth, tGoalWeightBoadyFat } from "../../appSettings/types";

import uniNavigation from "../ui/uniNavigation.vue";
import loadingWrap from "../wraps/loading.vue";

import { authNavigationArray, calculateMacros } from "../../appSettings/defaultExport";

import router from "../../appSettings/router";

import { useConfigStore } from "../../stores/useConfigStore";
const configStore = useConfigStore();
import { useAuthStore } from "../../stores/useAuthStore";
const authStore = useAuthStore();

import selectVertical from "../form/selectVertical.vue";
import selectHorizontal from "../form/selectHorizontal.vue";
import switcherHorizontal from "../form/switcherHorizontal.vue";
import inputHorizontal from "../form/inputHorizontal.vue";

const current = ref<number>(0);
const mode = ref<string>('signUp');
const stArray = [languageSelect, themeSwitcher, fontSizeSwitcher, weightInput, genderSelect, activitySelect, bfInput, heightInput, ageInput, caloriesInput, proteinsInput, fatsInput, carbsInput, usernameInput, emailInput, passwordInput];
for (const item of stArray) {
  item.st = { fontSize: 'm' }; 
}
weightInput.st.displayExternal = "weight-kg";
heightInput.st.displayExternal = "height-cm";

const config = ref<tConfig>({
  language: "en",
  theme: "light",
  fontSize: 1,
  focusColor: "#a29bfe"
});
const body = ref<tBody>({
  weight: undefined,
  bodyFat: undefined,
  height: undefined,
  activity: 1.2,
  gender: "male",
  age: undefined,
});
const goal = ref<tGoal>({
  calories: undefined,
  proteins: undefined,
  carbs: undefined,
  fats: undefined,
  weight: undefined,
  bodyFat: undefined
});
const common = ref<tCommon>({
  username: undefined,
  email: undefined,
  icon: undefined
});
const auth = ref<tAuth>({
  email: undefined,
  password: undefined,
});
const signin = ref<tAuth>({
  email: undefined,
  password: undefined,
});
watch(() => auth.value.email, (newEmail) => {
  if (newEmail) common.value.email = newEmail;
});

const validationSign = computed(() => {
  if (mode.value === 'signUp') {
    const c = common.value;
    const b = body.value;
    const g = goal.value;
    const a = auth.value;
    return Boolean(c.username && a.email && a.password && b.weight && b.bodyFat && b.height && b.age && g.weight && g.bodyFat && g.calories && g.carbs && g.fats && g.proteins);
  } else {
    const s = auth.value;
    return Boolean(s.email && s.password);
  }
});

let isAutoUpdating = false;

watch([body, goal], () => {
  const b = body.value;
  const g = goal.value;
  const hasRequiredData = b.gender && b.activity && b.age && b.height && g.weight && g.bodyFat;
  if (!hasRequiredData) return;
  if (isAutoUpdating) return;
  isAutoUpdating = true;
  const currentBody: tBody = { 
    weight: b.weight, 
    bodyFat: b.bodyFat, 
    height: b.height, 
    activity: b.activity, 
    gender: b.gender, 
    age: b.age 
  };
  const target: tGoalWeightBoadyFat = { 
    weight: g.weight!, 
    bodyFat: g.bodyFat!
  };
  const macros = calculateMacros(currentBody, target);
  goal.value.calories = macros.calories;
  goal.value.proteins = macros.proteins;
  goal.value.fats = macros.fats;
  goal.value.carbs = macros.carbs;
  isAutoUpdating = false;
}, { deep: true });

watch(() => config.value, (newConfig) => {
  if (newConfig) configStore.changeAttrByStore(newConfig);
}, { deep: true });

const loading = ref<boolean>(false);
const trySign = async () => {
  if (mode.value === 'signUp') trySignUp();
  else trySignIn();
}
const trySignUp = async () => {
  if (!validationSign.value) return;
  loading.value = true;
  const result = await authStore.signUp(auth.value, common.value, config.value, body.value, goal.value);
  if (result.success) router.push('/dashboard');
  else loading.value = false;
}
const trySignIn = async () => {
  if (!validationSign.value) return;
  loading.value = true;
  const s = auth.value;
  const result = await authStore.signIn(s.email!, s.password!);
  if (result.success) router.push('/dashboard');
  else loading.value = false;
}
</script>

<template>
  <div class="wh-100 center prz-2 auth-page">
    <loadingWrap v-show="loading" :style="{opacity: loading ? '1' : '0'}" />
    <uniNavigation v-model="current" :left="authNavigationArray" />
      <TransitionGroup name="auth" tag="div" class="wh-100 max-width-720 prz-2 transition-container" mode="out-in">
        <div class="wh-100 fl-col" :key="0" v-show="current === 0">
          <selectVertical v-bind="languageSelect" v-model="config.language" />
          <!-- <p class="h2"> {{ t('youWillSettings') }} </p> -->
          <switcherHorizontal v-bind="themeSwitcher" v-model="config.theme" />
          <selectVertical v-bind="fontSizeSwitcher" v-model="config.fontSize" />
        </div>
        <div class="wh-100 fl-col" :key="1" v-show="current === 1">
          <selectHorizontal v-bind="genderSelect" v-model="body.gender" />
          <p class="h2"> {{ t('bodyTop') }} </p>
          <inputHorizontal v-bind="weightInput" v-model="body.weight" />
          <inputHorizontal v-bind="bfInput" v-model="body.bodyFat" />
          <p class="h2"> {{ t('bodyBot') }} </p>
          <inputHorizontal v-bind="ageInput" v-model="body.age" />
          <inputHorizontal v-bind="heightInput" v-model="body.height" />
        </div>
        <div class="wh-100 fl-col" :key="2" v-show="current === 2">
          <p class="h2"> {{ t('mostEff') }} </p>
          <inputHorizontal v-bind="weightInput" v-model="goal.weight" />
          <inputHorizontal v-bind="bfInput" v-model="goal.bodyFat" />
          <selectVertical v-bind="activitySelect" v-model="body.activity" />
        </div>
        <div class="wh-100 fl-col" :key="3" v-show="current === 3">
          <p class="h2"> {{ t('canAdjust') }} </p>
          <inputHorizontal v-bind="caloriesInput" v-model="goal.calories" />
          <inputHorizontal v-bind="proteinsInput" v-model="goal.proteins" />
          <inputHorizontal v-bind="fatsInput" v-model="goal.fats" />
          <inputHorizontal v-bind="carbsInput" v-model="goal.carbs" />
          <p class="h2"> {{ t('plsNote') }} </p>
        </div>
        <div class="wh-100 fl-col center" :key="4" v-show="current === 4">
          <!-- <p class="h2"> {{ t('logInto') }} </p> -->
          <selectHorizontal v-bind="signSelect" v-model="mode" />
          <inputHorizontal v-bind="usernameInput" v-model="common.username" v-if="mode === 'signUp'" />
          <inputHorizontal v-bind="emailInput" v-model="auth.email" />
          <inputHorizontal v-bind="passwordInput" v-model="auth.password" />
          <button :disabled="!validationSign" :class="validationSign ? 'solid-wrap center sign active' : 'solid-wrap center sign'" @click="trySign"> {{ t('signIn') }} </button>
        </div>
      </TransitionGroup>
  </div>
</template>

<style scoped lang="scss">
.auth-enter-active,
.auth-leave-active {
  transition: all 0.3s ease;
}
.auth-move {
  transition: transform 0.3s ease;
}
.auth-enter-from {
  opacity: 0;
}
.auth-leave-to {
  opacity: 0;
}
.auth-page {
  padding: 1rem;
  .transition-container {
    .wh-100 {
      min-width: 100%;
      padding-top: 6rem;
      position: absolute;
      top: 0;
      overflow-y: scroll;
    }
    .wh-100::-webkit-scrollbar {
      display: none;
    }
  }
  .fl-col {
    gap: 1.5rem;
  }
  .body-desc {
    width: 100%;
  }
  .sign {
    width: 100%;
    font-weight: 500;
    cursor: not-allowed;
  }
  .active {
    background: var(--focus);
    border: solid 1px var(--focus);
    color: var(--white);
    cursor: pointer;
  }
}
</style>
