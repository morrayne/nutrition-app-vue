<script setup lang="ts">
// IMPORT
// vue & router
import { ref } from "vue";
import router from "../app_settings/router";
// ui 
import tr_controls from "./sign_folder/signup_controls.vue";
import dynamic_island from "@/common/dynamic.vue";
// store & type
import type { auth_type, common_type, config_type, body_type, goal_type } from "../stores/useAuthStore";
import { useAuthStore } from "../stores/useAuthStore";
const authStore = useAuthStore();
// view
import view_username_email_password from "./sign_folder/view_use_ema_pas.vue";
import view_gender_age_height from "./sign_folder/view_gen_age_hei.vue";
import view_theme_lang from "./sign_folder/view_the_lan.vue";
import view_weight_bf from "./sign_folder/view_wei_bf.vue";
import view_palette_mm from "./sign_folder/view_pal_mm.vue";
import view_phone_color from "./sign_folder/view_pho.vue";
import view_activity from "./sign_folder/view_act.vue";
import view_kpcf from "./sign_folder/view_pcf.vue";

// SIGNUP PLACEHOLDER
let auth : auth_type = {
  email: "",
  password: "",
  username: "",
} 
let common : common_type = {
  email: "",
  username: "",
  icon: null,
  sub_tier: null,
  online: false,
  first_login: false,
}  
let config : config_type = {
  theme: "light",
  palette: "colorful",
  phone_color: "blue",
  language: "en",
  mm: "16",
} 
const body = ref<body_type>({
  gender: "male",
  age: null,
  height: null,
  activity: null,
  weight: null,
  bf: null,
})
let goal = ref<goal_type>({
  calories: null,
  proteins: null,
  carbs: null,
  fats: null,
  weight: null,
  bf: null,
})
// EMIT HANDLER
// error
const err = ref("");
const set_err_func = async (data: string) => {
  err.value = "";
  await new Promise(resolve => setTimeout(resolve, 10));
  err.value = data;
};
// theme
const change_theme_func = (data: string) => {
  config.theme = data;
  document.documentElement.setAttribute("data-theme", data);
};
// language
const change_lang_func = (data: string) => {
  config.language = data;
  document.documentElement.setAttribute("lang", data);
  document.documentElement.lang = data;
  go_next_func();
};
// palette
const change_palette_func = (data: string) => {
  config.palette = data;
  document.documentElement.setAttribute("data-palette", data);
};
// phone color
const change_phone_color_func = (data: string) => {
  config.phone_color = data;
  document.documentElement.setAttribute("data-phone-color", data);
  go_next_func();
};
// gender
const change_gender_func = (data: string) => {
  body.value.gender = data;
  go_next_func();
};
// mm
const change_mm_func = (data: string) => {
  config.mm = data;
  document.documentElement.setAttribute("data-mm", data);
  go_next_func();
};
// age
const change_age_func = (data: number) => {
  body.value.age = data;
};
// height
const change_height_func = (data: number) => {
  body.value.height = data;
};
// activity
const change_activity_func = (data: number) => {
  body.value.activity = data;
  go_next_func();
};
// current weight
const change_current_weight_func = (data: number) => {
  body.value.weight = data; 
};
// current bf
const change_current_bf_func = (data: number) => {
  body.value.bf = data; 
};
// goal weight
const change_goal_weight_func = (data: number) => {
  goal.value.weight = data;
};
// goal bf
const change_goal_bf_func = (data: number) => {
  goal.value.bf = data;
};
// calories
const change_kcal_func = (data: number) => {
  goal.value.calories = data;
};
// proteins
const change_proteins_func = (data: number) => {
  goal.value.proteins = data;
};
// carbs
const change_carbs_func = (data: number) => {
  goal.value.carbs = data;
};
// fats
const change_fats_func = (data: number) => {
  goal.value.fats = data;
};
// full auth
const change_auth_func = (data: auth_type) => {
  auth = data;
  common.email = data.email;
  common.username = data.username;
};

// VIEW CONTROL
// view display controls
const view_vars = ref({
  min: 0,
  current: 0,
  max: 3,
});
// component and controls
const view_components = [
  { comp: view_theme_lang, back: false, next: false },
  { comp: view_palette_mm, back: true, next: false },
  { comp: view_phone_color, back: true, next: true },
  { comp: view_gender_age_height, back: true, next: false },
  { comp: view_activity, back: true, next: false },
  { comp: view_weight_bf, back: true, next: true },
  { comp: view_kpcf, back: true, next: true },
  { comp: view_username_email_password, back: true, next: true },
];
// transform
const view_transform_style = (index: number) => {
  if (index < view_vars.value.current) {
    return "translateX(-100%)";
  } else if (index > view_vars.value.current) {
    return "translateX(100%)";
  } else {
    return "translateX(0%)";
  }
};
// set min view count
const set_min_func = (data: number) => {
  view_vars.value.min = data;
};
// set max view count
const set_max_func = (data: number) => {
  view_vars.value.max = data;
};
// back
const go_back_func = () => {
  if (view_vars.value.current > view_vars.value.min) view_vars.value.current--;
};
// forward
const go_next_func = () => {
  if (view_vars.value.current === view_components.length - 1) {
    handleSignUp();
  } else if (view_vars.value.current < view_vars.value.max) {
    view_vars.value.current++;
  }
};

// FINAL SIGNUP
const handleSignUp = async () => {
  console.warn("Signup data:", { auth: auth, common: common, config: config, body: body, goal: goal });
  const result = await authStore.signUp(auth, common, config, body.value, goal.value);
  if (result.success) router.push("/account");
};
</script>

<template>
  <div class="signup">
    <dynamic_island :text="err" />
    <tr_controls @next="go_next_func()" @back="go_back_func()" :back="view_components[view_vars.current]!.back" :next="view_components[view_vars.current]!.next" />
    <div class="view" v-for="(item, index) in view_components" :key="index" :style="{ transform: `${view_transform_style(index)}` }">
      <component :is="item.comp"
        @set-min="set_min_func"
        @set-max="set_max_func"
        @set-err="set_err_func"
        @change-theme="change_theme_func"
        @change-lang="change_lang_func"
        @change-phone-color="change_phone_color_func"
        @change-palette="change_palette_func"
        @change-mm="change_mm_func"
        @change-gender="change_gender_func"
        @change-age="change_age_func"
        @change-height="change_height_func"
        @change-activity="change_activity_func"
        @change-current-weight="change_current_weight_func"
        @change-current-bf="change_current_bf_func"
        @change-goal-weight="change_goal_weight_func"
        @change-goal-bf="change_goal_bf_func"
        @change-auth="change_auth_func"
        @change-kcal="change_kcal_func"
        @change-proteins="change_proteins_func"
        @change-carbs="change_carbs_func"
        @change-fats="change_fats_func"
        :goal="goal"
        :body="body"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.signup {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  overflow: hidden;

  .view {
    min-width: 100%;
    height: 100%;
    padding: 1rem;
    display: flex;
    background: var(--back-a);
    justify-content: center;
    align-items: center;
    position: absolute;
    transition: 0.2s;
  }
}
</style>
