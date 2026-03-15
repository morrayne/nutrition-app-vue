<script setup lang="ts">
// IMPORT
// vue
import { reactive, ref, watch, computed, markRaw } from "vue";
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

// SIGNUP PLACEHOLDER
const config = ref<tConfig>({
  theme: "light",
  palette: "colorful",
  phone_color: "green",
  language: "en",
  mm: "16",
});
const signup = ref<tAuth>({
  email: "",
  password: "",
  username: "",
}) 
const common = ref<tCommon>({
  email: "",
  username: "",
  icon: 0,
  sub_tier: 0,
  online: false,
  first_login: false,
})  
const body = ref<tBody>({
  gender: "male",
  age: 21,
  height: 180,
  activity: 1.3,
  weight: 71,
  bf: 12,
})
const goal = ref<tGoal>({
  calories: null,
  proteins: null,
  carbs: null,
  fats: null,
  weight: null,
  bf: null,
})

// VALIDATION
// body
const isBodyValid = computed(() => {
  const b = body.value
  const height = (b.height! >= 120 && b.height! <= 220);
  const weight = (b.weight! >= 30 && b.weight! <= 150);
  const age = (b.age! >= 14 && b.age! <= 80);
  const bf = (b.bf! >= 5 && b.bf! <= 30);
  return  (height && weight && age && bf);
});
// goal
const isGoalValid = computed(() => {
  const g = goal.value
  const weight = (g.weight! >= 30 && g.weight! <= 150);
  const bf = (g.bf! >= 5 && g.bf! <= 30);
  const calories = (g.calories! >= 1200 && g.calories! <= 8000);
  const proteins = (g.proteins! >= 30 && g.proteins! <= 300);
  const carbs = (g.carbs! >= 50 && g.carbs! <= 600);
  const fats = (g.fats! >= 10 && g.fats! <= 200)
  return (weight && bf && calories && proteins && carbs && fats)       
});
// signup
const isSignupValid = computed(() => {
  const s = signup.value
  const isValidUsername = s.username && s.username.length >= 4 && s.username.length <= 16 && /[a-zA-Z]/.test(s.username);
  const isValidEmail = s.email && s.email.includes('@') && s.email.includes('.') && s.email.length >= 6 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email);
  const isValidPassword = s.password && s.password.length >= 6;
  return (isValidUsername && isValidEmail && isValidPassword)
});

// VIEW
const viewArray = reactive([
  { component: markRaw(viewConfig), var: config, back: false, next: true, signup: false },
  { component: markRaw(viewBody), var: body, back: true, next: isBodyValid, signup: false },
  { component: markRaw(viewGoal), var: goal, back: true, next: isGoalValid, signup: false },
  { component: markRaw(viewSignup), var: signup, back: true, next: false, signup: isSignupValid },
]);
const viewControl = ref({
  current: 0,
  max: viewArray.length - 1,
})
const viewTransformStyle = (index: number) => {
  if (index < viewControl.value.current) return "translateX(-100%)";
  else if (index > viewControl.value.current) return "translateX(100%)";
  else return "translateX(0%)";
};

// WATCH
watch(config, () => {
  document.documentElement.setAttribute("lang", config.value.language);
  document.documentElement.setAttribute("data-theme", config.value.theme);
  document.documentElement.setAttribute("data-palette", config.value.palette);
  document.documentElement.setAttribute("data-phone-color", config.value.phone_color);
  document.documentElement.setAttribute("data-mm", config.value.mm);
}, { deep: true, immediate: true });
watch(signup, () => {
  common.value.email = signup.value.email;
  common.value.username = signup.value.username;
}, { deep: true });

// FINAL
const handleSignUp = async () => {
  if (isSignupValid.value) {
    console.warn("Signup data:", { auth: signup, common: common, config: config, body: body, goal: goal });
    const result = await authStore.signUp(signup.value, common.value, config.value, body.value, goal.value);
    if (result.success) router.push("/account");
  } else {
    console.log('Заполните все поля');
  }
};
</script>

<template>
  <div class="screen signup">
    <upControl v-model="viewControl" :toShow="viewArray[viewControl.current]!" @signup="handleSignUp" />
    <dynamicIsland />
    <div class="view" v-for="(item, index) in viewArray" :key="index" :style="{ transform: `${viewTransformStyle(index)}` }">
      <component :is="item.component" v-model="item.var" :body="item.component === viewGoal ? body : undefined" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.signup {
  flex-direction: row;

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
