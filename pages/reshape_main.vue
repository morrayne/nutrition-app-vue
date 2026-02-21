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
  { component: config_info, height: 17, title: "config-data" },
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
  max: 4, // максимум 4 (индексы 0-4)
});

// computed vars
const current_view_height = computed(() => component_array[view_data.value.current]?.height);
const current_view_eq_0 = computed(() => view_data.value.current === 0);
const current_view_eq_max = computed(() => view_data.value.current === component_array.length - 1);
const current_width_progress_bar = computed(() => view_data.value.current / (component_array.length - 1) * 100);

// MAIN DATA
// types
interface form_data_type {
  lang: "en" | "ru";
  theme: "light" | "dark";
  monochrome: "mono" | "multi";
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
  lang: userStore.userData.config.lang,
  theme: userStore.userData.config.theme,
  monochrome: userStore.userData.config.monochrome,
  gender: userStore.userData.body_data.general.gender,
  age: userStore.userData.body_data.general.age,
  height: userStore.userData.body_data.general.height,
  weight: userStore.userData.body_data.current.weight,
  activity: userStore.userData.body_data.general.activity,
  bf: userStore.userData.body_data.current.bf,
  goalWeight: userStore.userData.body_data.goal.weight,
  goalBf: userStore.userData.body_data.goal.bf,
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
// saving updated data
async function SaveUpdatedData(): Promise<{ success: boolean; error?: any } | void> {
  try {
    // Рассчитываем макросы
    userStore.calculateMacros("current");
    
    // Обновляем данные пользователя
    userStore.setUserData({ 
      ...userStore.userData,
      config: { 
        ...userStore.userData.config, 
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
      }
    });
    
    const saveResult = await authStore.saveUserData();
    if (saveResult.success) {
      console.log("✅ Data updated successfully!");
      router.push("/account");
      return { success: true };
    } else {
      console.error("Failed to save user data:", saveResult.error);
      return { success: false, error: saveResult.error };
    }
  } catch (error) {
    console.error("Error updating data:", error);
    return { success: false, error };
  }
}

// Проверка на пустые поля
const isFormValid = computed(() => {
  return (
    form_data.value.age > 0 &&
    form_data.value.height > 0 &&
    form_data.value.weight > 0 &&
    form_data.value.activity > 0 &&
    form_data.value.bf > 0 &&
    form_data.value.goalWeight > 0 &&
    form_data.value.goalBf > 0
  );
});

// VUE WATCH
// Загружаем начальные данные
watch(userStore, () => {
  form_data.value = {
    lang: userStore.userData.config.lang,
    theme: userStore.userData.config.theme,
    monochrome: userStore.userData.config.monochrome,
    gender: userStore.userData.body_data.general.gender,
    age: userStore.userData.body_data.general.age,
    height: userStore.userData.body_data.general.height,
    weight: userStore.userData.body_data.current.weight,
    activity: userStore.userData.body_data.general.activity,
    bf: userStore.userData.body_data.current.bf,
    goalWeight: userStore.userData.body_data.goal.weight,
    goalBf: userStore.userData.body_data.goal.bf,
  };
}, { immediate: true });
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
        <div class="save" v-if="current_view_eq_max" @click='SaveUpdatedData()' :style="{minWidth: `${current_view_eq_0 ? 'calc(100%)' : 'calc(50% - 0.25rem)'}`, marginLeft: `${current_view_eq_0 ? '0' : '0.5rem'}`}"></div>
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

      .back, .forward, .save {
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

      .back, .forward, .save {
        border-radius: 0.75rem;
      }

      .back {
        background: var(--back-d);
      }

      .back::after {
        content: var(--back);
      }

      .forward, .save {
        color: var(--back-a);
        background: var(--text-a);
      }

      .forward::after {
        content: var(--forward);
      }

      .save::after {
        content: "Save";
      }
    }
  }
}
</style>
