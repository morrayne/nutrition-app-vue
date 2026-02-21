<script setup lang="ts">
// MAIN IMPORTS
// vue & router & types
import router from "../app_settings/router";
import { computed, ref, watch } from "vue";
import { type Component } from "vue";
import type { new_format } from "../stores/store_types";
// store imports
import { useAuthStore } from "../stores/useAuthStore";
import { useUserStore } from "../stores/useUserStore";
// store vars
const authStore = useAuthStore();
const userStore = useUserStore();
// views
import current_info from "./sign_up/current_info.vue";
import config_info from "./sign_up/config_info.vue";
import body_info from "./sign_up/body_info.vue";
import goal_info from "./sign_up/goal_info.vue";
import user_info from "./sign_up/user_info.vue";
import prep from "./sign_up/introduction.vue";
import finale from "./sign_up/finale.vue";

// CONTENT
// types
interface component_array_type {
  component: Component;
  height: number;
  title: string;
}
// vars
const component_array = <component_array_type[]>([
  { component: config_info, height: 15, title: "config-data" },
  { component: prep, height: 25, title: "health-prep" },
  { component: user_info, height: 19, title: "general-data" },
  { component: body_info, height: 16, title: "body-data" },
  { component: current_info, height: 26, title: "current-data" },
  { component: goal_info, height: 11, title: "goal-data" },
  { component: finale, height: 24, title: "health-finale" },
]);

// NAVIGATION
// types
interface view_data_type {
  current: number;
  min: number;
  max: number;
}
// vars
const view_data = ref<view_data_type>({
  current: 0,
  min: 0,
  max: 2,
});
// computed vars
const current_view_height = computed(() => component_array[view_data.value.current]?.height);
const current_view_eq_0 = computed(() => view_data.value.current === 0);
const current_width_progress_bar = computed(() => view_data.value.current / (component_array.length - 1) * 100);

// MAIN DATA
// types
interface form_data_type {
  lang: "en" | "ru";
  theme: "light" | "dark";
  monochrome: "mono" | "multi";
  username: string;
  email: string;
  password: string;
  icon: number;
  gender: "male" | "female";
  age: number;
  height: number;
  weight: number;
  activity: number;
  bf: number;
  goalWeight: number;
  goalBf: number;
}
// vars
const form_data = ref<form_data_type>({
  lang: "en",
  theme: "light",
  monochrome: "mono",
  username: "",
  email: "",
  password: "",
  icon: 0,
  gender: "male",
  age: 21,
  height: 180,
  weight: 72,
  activity: 1.45,
  bf: 12,
  goalWeight: 82,
  goalBf: 8,
});

// FUNCTIONS  
// form_data field update
const UpdateFormDataField = (payload: { field: string, value: string | number }) => {
  form_data.value = { ...form_data.value, [payload.field]: payload.value };
}
// view_data field update
const UpdateViewDataField = (payload: { field: "min" | "max" | "current", value: number }) => {
  if (payload.field === "current") {
    if (!(payload.value > view_data.value.max || payload.value < view_data.value.min)) {
      view_data.value.current = payload.value;
    } 
  } else {
    view_data.value[payload.field] = payload.value;
  }
}
// signing up in supabase
async function SupabaseSignUp(): Promise<{ success: boolean; error?: any } | void> {
  if (form_data.value.email && form_data.value.password && form_data.value.username) {
    const signUpData: new_format = {
      id: "",
      online: true,
      friends: [],
      common: {
        sub_tier: 0,
        username: form_data.value.username,
        email: form_data.value.email,
        icon: form_data.value.icon,
      },
      config: {
        first_login: false,
        lang: form_data.value.lang,
        theme: form_data.value.theme,
        monochrome: form_data.value.monochrome,
      },
      body_data: {
        general: {
          gender: form_data.value.gender,
          age: form_data.value.age,
          height: form_data.value.height,
          activity: form_data.value.activity as 1.15 | 1.3 | 1.45 | 1.6 | 1.75 | 1.9,
        },
        current: {
          weight: form_data.value.weight,
          bf: form_data.value.bf,
        },
        goal: {
          weight: form_data.value.goalWeight,
          bf: form_data.value.goalBf,
        },
      },
      macros_data: {
        current: { kcal: 0, proteins: 0, carbs: 0, fats: 0 },
        goal: { kcal: 0, proteins: 0, carbs: 0, fats: 0 },
      },
    };
    
    const result = await authStore.signUp(signUpData, form_data.value.password);
    if (result.success) {
      UpdateViewDataField({ field: "current", value: view_data.value.current + 1 });
      UpdateViewDataField({ field: "min", value: 3 });
      return { success: true };
    } else {
      console.error(result.error);
      return { success: false, error: result.error };
    }
  }
}
// finishing login/onboarding in supabase
async function SupabaseSignUpFinish(): Promise<{ success: boolean; error?: any } | void> {
  try {
    userStore.calculateMacros("current");
    userStore.setUserData({ 
      ...userStore.userData,
      config: { 
        ...userStore.userData.config, 
        first_login: true 
      },
      common: { 
        ...userStore.userData.common, 
        username: form_data.value.username, 
        icon: form_data.value.icon 
      },
      body_data: {
        ...userStore.userData.body_data,
        current: {
          weight: form_data.value.weight,
          bf: form_data.value.bf,
        },
        goal: {
          weight: form_data.value.goalWeight,
          bf: form_data.value.goalBf,
        },
        general: {
          ...userStore.userData.body_data.general,
          gender: form_data.value.gender,
          age: form_data.value.age,
          height: form_data.value.height,
          activity: form_data.value.activity as 1.15 | 1.3 | 1.45 | 1.6 | 1.75 | 1.9,
        }
      }
    });
    
    const saveResult = await authStore.saveUserData();
    if (saveResult.success) {
      console.log("🚀 Onboarding completed successfully!");
      router.push("/account");
      return { success: true };
    } else {
      console.error("Failed to save user data:", saveResult.error);
      return { success: false, error: saveResult.error };
    }
  } catch (error) {
    console.error("Error in finish onboarding:", error);
    return { success: false, error };
  }
}

// VUE WATCH
// reload/f5 restore
watch(userStore, () => {
  if (!userStore.userData.config.first_login && authStore.session) {
    view_data.value.current = 3;
    view_data.value.min = 3;
  }
}, { deep: true, immediate: true });

// VUE ONMOUNTED
</script>

<template>
  <div class="health-page">
    <div class="health">
      <div class="view" v-if="current_view_height" :style="{ height: `${current_view_height}rem`}">
        <div class="progress-bar" :style="{ width: `${current_width_progress_bar}%`}"></div>
        <h1 :style="{'--title-name': `var(--${component_array[view_data.current]?.title})`}"></h1>
        <div class="wrap" v-for="(comp, index) in component_array" :key="index" :style="{ transform: `translateX(-${view_data.current * 100}%)` }">
          <component :is="comp.component" :user-data="form_data" @update-field="UpdateFormDataField" @update-right="UpdateViewDataField" />
        </div>
      </div>
      <div class="switch">
        <div class="back" @click='UpdateViewDataField({ field: "current", value: view_data.current - 1 })' :style="{minWidth: `${current_view_eq_0 ? '0%' : 'calc(50% - 0.25rem)'}`}"></div>
        <div class="signup" v-if="view_data.current === 2" @click='SupabaseSignUp()' :style="{minWidth: `${current_view_eq_0 ? 'calc(100%)' : 'calc(50% - 0.25rem)'}`, marginLeft: `${current_view_eq_0 ? '0' : '0.5rem'}`}"></div>
        <div class="finish" v-else-if="view_data.current === 6" @click='SupabaseSignUpFinish()' :style="{minWidth: `${current_view_eq_0 ? 'calc(100%)' : 'calc(50% - 0.25rem)'}`, marginLeft: `${current_view_eq_0 ? '0' : '0.5rem'}`}"></div>
        <div class="forward" v-else @click='UpdateViewDataField({ field: "current", value: view_data.current + 1 })' :style="{minWidth: `${current_view_eq_0 ? 'calc(100%)' : 'calc(50% - 0.25rem)'}`, marginLeft: `${current_view_eq_0 ? '0' : '0.5rem'}`}"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.health-page {
  width: 100%;
  height: 100%;
  padding: 0.5rem 0.75rem 0.75rem;
  background: var(--back-a);

  .health {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;

    .view {
      width: 100%;
      display: flex;
      background: var(--back-b);
      position: relative;

      h1 {
        top: -2.5rem;
        left: 0;
        position: absolute;
        font-size: 1.5rem;
      }
      
      h1::after {
        content: var(--title-name);
      }

      .progress-bar {
        min-width: 0.25rem;
        height: 0.25rem;
        background: var(--text-a);
        position: absolute;
        top: 0;
        left: 0;
      }

      .wrap {
        min-width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
      }
    }

    .switch {
      width: 100%;
      height: 2.5rem;
      display: flex;
      position: absolute;
      bottom: 0;
      left: 0;

      .back, .forward, .finish, .signup {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 0.75rem;
        border: solid 1px var(--text-a);
      }

      .back {
        background: var(--back-b);
        border: solid 1px var(--back-c);
      }

      .back::after {
        content: var(--back);
      }

      .forward, .finish, .signup {
        color: var(--back-a);
        background: var(--text-a);
      }

      .forward::after {
        content: var(--forward);
      }

      .finish::after {
        content: var(--finish);
      }

      .signup::after {
        content: var(--signup);
      }
    }
  }
}

::-webkit-scrollbar {
  display: none;
}
</style>
