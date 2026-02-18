<script setup lang="ts">
// MAIN IMPORTS
// vue
import { computed, ref, watch } from "vue";
import { type Component } from "vue";
// router
import router from "../utils/router";
// store imports
import { useAuthStore } from "../store/useAuthStore";
import { useUserStore } from "../store/useUserStore";
import { useUserPrivateStore } from "../store/useUserPrivateStore";
// store vars
const authStore = useAuthStore();
const userStore = useUserStore();
const userPrivateStore = useUserPrivateStore();

// VIEWS
// imports
import prep from "@/health/prep.vue";
import user_info from "@/health/user_info.vue";
import config_info from "@/health/config_info.vue";
import body_info from "@/health/body_info.vue";
import current_info from "@/health/current_info.vue";
import goal_info from "@/health/goal_info.vue";
import finale from "@/health/finale.vue";
// types
interface component_array_type {
  component: Component;
  height: number;
  title: string;
}
// component data
const component_array = computed<component_array_type[]>(() => userStore.common.firstLogin ? login_true_array : login_false_array);
const login_true_array : component_array_type[] = [
  { component: config_info, height: 17, title: "config-data" },
  { component: body_info, height: 16, title: "body-data" },
  { component: current_info, height: 26, title: "current-data" },
  { component: goal_info, height: 11, title: "goal-data" },
  { component: finale, height: 24, title: "health-finale" },
]
const login_false_array : component_array_type[] = [
  { component: config_info, height: 17, title: "config-data" },
  { component: prep, height: 25, title: "health-prep" },
  { component: user_info, height: 19, title: "general-data" },
  { component: body_info, height: 16, title: "body-data" },
  { component: current_info, height: 26, title: "current-data" },
  { component: goal_info, height: 11, title: "goal-data" },
  { component: finale, height: 24, title: "health-finale" },
];

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
const current_view_height = computed(() => component_array.value[view_data.value.current]?.height);
const current_view_eq_0 = computed(() => view_data.value.current === 0);
const current_width_progress_bar = computed(() => view_data.value.current / (component_array.value.length - 1) * 100);

// MAIN DATA
// types
interface health_data_type {
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
const health_data = ref<health_data_type>({
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
// healh_data field update
const UpdateHealthDataField = (payload: { field: string, value: string | number }) => {
  health_data.value = { ...health_data.value, [payload.field]: payload.value };
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
  if (health_data.value.email && health_data.value.password && health_data.value.username) {
    const result = await authStore.signUp(health_data.value.email, health_data.value.password, health_data.value.username, health_data.value.lang, health_data.value.theme, health_data.value.monochrome);
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
    userStore.updateCommon({ firstLogin: true, username: health_data.value.username, icon: health_data.value.icon });
    const saveResult = await authStore.saveUserData();
    if (saveResult.success) {
      console.log("Onboarding completed successfully!");
      router.push("/settings");
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
  if (!userStore.common.firstLogin && authStore.session) {
    view_data.value.current = 3;
    view_data.value.min = 3;
  }
}, { deep: true, immediate: true });
// view_data watcher
// watch(health_data, () => {console.log("health_data changed", JSON.parse(JSON.stringify(health_data.value)))}, { deep: true });
// view_data watcher
// watch(view_data, () => { console.log("view_data changed", JSON.parse(JSON.stringify(view_data.value)))}, { deep: true });

// VUE ONMOUNTED
</script>

<template>
  <div class="health-page">
    <div class="health">
      <div class="view" v-if="current_view_height" :style="{ height: `${current_view_height}rem`}">
        <div class="progress-bar" :style="{ width: `${current_width_progress_bar}%`}"></div>
        <h1 :style="{'--title-name': `var(--${component_array[view_data.current]?.title})`}"></h1>
        <div class="wrap" v-for="(comp, index) in component_array" :key="index" :style="{ transform: `translateX(-${view_data.current * 100}%)` }">
          <component :is="comp.component" :user-data="health_data" @update-field="UpdateHealthDataField" @update-right="UpdateViewDataField" />
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

  .health {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    .view {
      width: 100%;
      display: flex;

      h1 {
        top: -2.5rem;
        left: 0;
        position: absolute;
        font-size: 1.5rem;
      }
      ::after {
        content: var(--title-name);
      }

      .progress-bar {
        min-width: 0.25rem;
        height: 0.25rem;
      }

      .wrap {
        min-width: 100%;
        height: 100%;
      }
    }

    .switch {
      width: 100%;
      height: 2.5rem;
      display: flex;

      .back, .forward, .finish, .signup {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}

::-webkit-scrollbar {
  display: none;
}

.health-page {
  padding: 1rem;

  .health {
    overflow: hidden;

    .view {
      background: var(--back-b);
      position: relative;

      .progress-bar {
        background: var(--text-a);
        position: absolute;
        top: 0;
        left: 0;
      }

      .wrap {
        position: relative;
        overflow: hidden;
      }
    }

    .switch {
      position: absolute;
      bottom: 0;
      left: 0;

      .back, .forward, .finish, .signup {
        border-radius: 0.75rem;
      }

      .back {
        background: var(--back-d);
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
</style>
