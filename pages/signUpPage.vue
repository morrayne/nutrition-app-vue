<script setup lang="ts">
// IMPORT
// vue
import { ref, watch, computed, markRaw, reactive } from "vue";
// component
import dynamicIsland from "@/common/ui/dynamicIsland.vue";
import upControl from "./signUpInFolder/upControl.vue";
// router
import router from "../appSettings/router";
// store
import { useAuthStore } from "../stores/index";
const authStore = useAuthStore();
// view
import viewConfig from "./signUpInFolder/viewConfig.vue";
import viewBody from "./signUpInFolder/viewBody.vue";
import viewGoal from "./signUpInFolder/viewGoal.vue";
import viewSignup from "./signUpInFolder/viewSignUp.vue";
// type
import type { tAuth, tBody, tCommon, tConfig, tGoal } from "../stores/types";

// CONTENT
// type
export interface tUpdateViewArray {
  index: number;
  field: string;
  newValue: boolean;
}
// error
const errorMessage = ref<string[]>([]);
let thorMessage = true;
const handleError = (error: string[]) => {
  if (error.length > 0) {
    const screenIndex = parseInt(error[0]!);
    if (screenIndex !== viewCurrent.value) {
      if (thorMessage) console.warn("Oh, no. I say when we're done!");
      viewCurrent.value = screenIndex; 
      thorMessage = false;
    }
    errorMessage.value = error.slice(1);
  } else {
    errorMessage.value = [];
  }
};

// SIGNUP PLACEHOLDER
const config = ref<tConfig>({
  theme: "light",
  phone_color: "green",
  language: "en",
  mm: "16",
});
const signup = ref<tAuth>({
  email: "",
  password: "",
  username: "",
});
const common = ref<tCommon>({
  email: "",
  username: "",
  icon: 0,
  sub_tier: 0,
  online: false,
  first_login: false,
});
const body = ref<tBody>({
  gender: "male",
  age: 21,
  height: 180,
  activity: 1.3,
  weight: 71,
  bf: 12,
});
const goal = ref<tGoal>({
  calories: null,
  proteins: null,
  carbs: null,
  fats: null,
  weight: null,
  bf: null,
});

// VIEW
const viewCurrent = ref(0);
const viewArray = reactive([
  { back: false, forward: true, signup: false, profile: true, },
  { back: true, forward: true, signup: false, profile: true, },
  { back: true, forward: false, signup: false, profile: true, },
  { back: true, forward: false, signup: false, profile: false, },
]);

const updateViewArray = (data: tUpdateViewArray): void => {
  // @ts-ignore
  if (data.index >= 0 && data.index < viewArray.length) viewArray[data.index] = { ...viewArray[data.index], [data.field]: data.newValue };
};
const viewTransformStyle = (index: number) => {
  if (index < viewCurrent.value) return "translateX(-100%)";
  else if (index > viewCurrent.value) return "translateX(100%)";
  else return "translateX(0%)";
};

// WATCH
// prettier-ignore
watch(config, () => {
  document.documentElement.setAttribute("lang", config.value.language);
  document.documentElement.setAttribute("data-theme", config.value.theme);
  document.documentElement.setAttribute("data-phone-color", config.value.phone_color,);
  document.documentElement.setAttribute("data-mm", config.value.mm);
}, { deep: true, immediate: true });
// prettier-ignore
watch(signup, () => {
  common.value.email = signup.value.email;
  common.value.username = signup.value.username;
}, { deep: true });

// FUNCTION
const handleSignUp = async () => {
  if (signup.value.email && signup.value.username && signup.value.password) {
    // prettier-ignore
    const result = await authStore.signUp(signup.value, common.value, config.value, body.value, goal.value);
    if (result.success) router.push("/account");
  }
};
</script>

<template>
  <div class="screen signup">
    <upControl :viewCurrent="viewCurrent" :toDisplay="viewArray[viewCurrent]!" @updateViewArray="updateViewArray" @next="viewCurrent++" @back="viewCurrent--" @signup="handleSignUp" />
    <dynamicIsland />
    <div class="view" :style="{ transform: viewTransformStyle(0) }">
      <viewConfig v-model="config" @updateViewArray="updateViewArray" @error="handleError" />
    </div>
    <div class="view" :style="{ transform: viewTransformStyle(1) }">
      <viewBody v-model="body" @updateViewArray="updateViewArray" @error="handleError" />
    </div>
    <div class="view" :style="{ transform: viewTransformStyle(2) }">
      <viewGoal v-model="goal" :body="body" @updateViewArray="updateViewArray" @error="handleError" />
    </div>
    <div class="view" :style="{ transform: viewTransformStyle(3) }">
      <viewSignup v-model="signup" @updateViewArray="updateViewArray" @error="handleError" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.signup {
  background: var(--signup-main-background);

  .view {
    min-width: 100%;
    height: 100%;
    display: flex;
    gap: var(--mm);
    flex-direction: column;
    position: absolute;
    z-index: 2;
  }
}
</style>
