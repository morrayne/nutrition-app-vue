<script setup lang="ts">
import { ref, watch, computed } from "vue";
import router from "../../appSettings/router";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { useAuthStore } from "../../stores/useAuthStore";
const authStore = useAuthStore();
import { useCommonStore } from "../../stores/useCommonStore";
const commonStore = useCommonStore();

import loadingWrap from "../wraps/loading.vue";

import uniNavigation from "../ui/uniNavigation.vue";
import underNavigation from "../ui/underNavigation.vue";

import { dashboardNavigationArray, dashboardNavigationItem } from "../../appSettings/defaultExport";

const loading = ref<boolean>(false);
const currentMain = ref<number>(1);
const currentSub = ref<number>(0);
watch([currentMain], () => {
  currentSub.value = 0;
}, {deep: true});

const trySignOut = async () => {
  loading.value = true;
  await authStore.signOut();
  router.push("/auth");
}

import { supabase } from "../../appSettings/supabase";
const getIconUrl = () => {
  const { data } = supabase.storage.from("icons").getPublicUrl(`${String(commonStore.common.icon).padStart(2, "0")}.jpg`);
  return data.publicUrl;
};

import mealHistory from "../meal/history.vue";
import mealIntake from "../meal/intake.vue";
import mealSaved from "../meal/saved.vue";
</script>

<template>
  <div class="wh-100 center prz-2 dashboard-page">
    <loadingWrap v-show="loading" :style="{opacity: loading ? '0' : '1'}" />
    <uniNavigation v-model="currentMain" :left="dashboardNavigationArray" :right="dashboardNavigationItem" />
    <underNavigation v-model="currentSub" :current="currentMain" />
    <TransitionGroup name="dashboard" tag="div" class="wh-100 max-width-1080 prz-2 transition-container" mode="out-in">
      <div class="wh-100 prz-2" :key="0" v-show="currentMain === 0">

      </div>
      <TransitionGroup name="mini" tag="div" class="wh-100 prz-2 transition-container" mode="out-in" :key="1" v-show="currentMain === 1">
        <mealHistory :key="0" v-show="currentSub === 0" />
        <mealIntake :key="1" v-show="currentSub === 1" />
        <mealSaved :key="2" v-show="currentSub === 2" />
      </TransitionGroup>
      <div class="wh-100 prz-2" :key="2" v-show="currentMain === 2"></div>
      <div class="wh-100 prz-2" :key="3" v-show="currentMain === 3"></div>
    </TransitionGroup>
  </div>
</template>

<style scoped lang="scss">
.dashboard-enter-from, .mini-enter-from {
  opacity: 0;
}
.dashboard-leave-to, .mini-leave-to {
  opacity: 0;
}
.dashboard-page {
  padding: 1rem;
  position: relative;
  .transition-container {
    .wh-100 {
      min-width: 100%;
      padding-top: 9rem;
      position: absolute;
      top: 0;
      overflow-y: scroll;
    }
    .wh-100::-webkit-scrollbar {
      display: none;
    }
  }
}

@media (max-width: 768px) {
  .dashboard-page .transition-container .wh-100 {
    padding-top: 0;
    padding-bottom: 9rem;
  }
}
</style>
