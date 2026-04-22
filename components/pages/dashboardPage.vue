<script setup lang="ts">
import { ref, watch, computed } from "vue";
import router from "../../appSettings/router";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { today, dateFromISO } from "../../appSettings/defaultExport";
const activeDay = ref<string>(dateFromISO(today!));

import { useAuthStore } from "../../stores/useAuthStore";
const authStore = useAuthStore();
import { useCommonStore } from "../../stores/useCommonStore";
const commonStore = useCommonStore();
import { useMealTableStore } from "../../stores/useMealTableStore";
const mealTableStore = useMealTableStore();
import { useMealAssetSavedStore } from "../../stores/useMealAssetSavedStore";
const mealAssetSavedStore = useMealAssetSavedStore();
import { useMealAssetGroupStore } from "../../stores/useMealAssetGroupStore";
const mealAssetGroupStore = useMealAssetGroupStore();

import glass from "../wraps/glass.vue";
import { X } from "@lucide/vue";

import dayMacros from "../parts/dayMacros.vue";
import loadingWrap from "../wraps/loading.vue";
import mealWrap from "../wraps/mealWrap.vue";

import uniNavigation from "../ui/uniNavigation.vue";
import underNavigation from "../ui/underNavigation.vue";

import { dashboardNavigationArray, dashboardNavigationItem } from "../../appSettings/defaultExport";
import type { tMealAssetSaved, tMealAssetGroup } from "../../appSettings/types";

const loading = ref<boolean>(false);
const current = ref<number>(0);
const subCurrent = ref<number>(0);
watch([current], () => {
  subCurrent.value = 0;
}, { deep: true })

const trySignOut = async () => {
  loading.value = true;
  await authStore.signOut();
  router.push("/auth");
}

const activeDateTable = computed(() => {
  return mealTableStore.table.filter(item => item.date === activeDay.value)
});

import { supabase } from "../../appSettings/supabase";
const getIconUrl = () => {
  const { data } = supabase.storage.from("icons").getPublicUrl(`${String(commonStore.common.icon).padStart(2, "0")}.jpg`);
  return data.publicUrl;
};

const displayMealSaved = ref<tMealAssetSaved[]>(mealAssetSavedStore.saved);
const displayMealGroup = ref<tMealAssetGroup[]>(mealAssetGroupStore.groups);
const basket = ref<any>([]);

import shortMealItem from "../wraps/shortMealItem.vue";

import { useTemplateRef } from 'vue';
import { makeDroppable } from '@vue-dnd-kit/core';

const zoneRef = useTemplateRef<HTMLElement>('zoneRef');
makeDroppable(zoneRef, {
  events: {
    onDrop: (event: any) => {
      const draggedItemIndex = event.draggedItems?.[0].index;
      // console.log('draggedItem:', draggedItem.index);
      let huinya = '';
      mealAssetGroupStore.groups.forEach((item) => {
        if (Number(item.id) === draggedItemIndex) { 
          huinya = item.name
          return 
        } 
      })
      mealAssetSavedStore.saved.forEach((item) => {
        if (Number(item.id) === draggedItemIndex) huinya = item.name; return
      })
      if (!huinya) huinya === "hueta";
      basket.value.push(huinya);
    }
  }
});
</script>

<template>
  <div class="full-screen dashboard-page">
    <loadingWrap v-show="loading" :style="{opacity: loading ? '0' : '1'}" />
    <uniNavigation v-model="current" :left="dashboardNavigationArray" :right="dashboardNavigationItem" />
    <underNavigation v-model="subCurrent" :current="current" />
    <div class="pc-max-frame">
      <TransitionGroup name="dashboard" tag="div" class="views-container" mode="out-in">
        <div class="view view-center" :key="0" v-show="current === 0">
          <p class="h2"> {{ t('home') }} </p>
        </div>
        <div class="view view-center" :key="1" v-show="current === 1">
          <p class="h2"> {{ t('meal') }} </p>
          <div class="invard-wrap">
            <div class="left">
              <div class="cont" ref="zoneRef" data-droppable-id="basket">
                <glass :borderRadius="32" />
                <p class="filler" v-if="basket.length === 0"> {{ t('dragHere') }} </p>
                <div class="basket-list" v-if="basket.length !== 0">
                  <p class="item" v-for="value in basket">
                    {{ value }}
                  </p>
                </div>
                 <p class="send bounce"> {{ t('send') }} </p>
              </div>
            </div>
            <div class="right">
              <div class="top">
                <glass :borderRadius="32" />
              </div>
              <div class="bot">
                <p class="h3"> {{ t('simpleProduct') }} </p>
                <shortMealItem tabindex="0" v-for="item in displayMealSaved" :asset="item" :assetType="'single'" />
                <p class="h3"> {{ t('hardProduct') }} </p>
                <shortMealItem v-for="item in displayMealGroup" :asset="item" :assetType="'group'" />
              </div>
            </div>
          </div>
        </div>
        <div class="view view-center" :key="2" v-show="current === 2">
          <p class="h2"> {{ t('sport') }} </p>
        </div>
        <div class="view view-center" :key="3" v-show="current === 3">
          <p class="h2"> {{ t('meds') }} </p>
        </div>
        <div class="view view-center" :key="4" v-show="current === 4">
          <p class="h2"> {{ t('storage') }} </p>
        </div>
        <div class="view view-center" :key="-1" v-show="current === -1">
          <p class="h2"> {{ t('account') }} </p>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dashboard-enter-active,
.dashboard-leave-active {
  transition: all 0.3s ease;
}
.dashboard-move {
  transition: transform 0.3s ease;
}
.dashboard-enter-from {
  opacity: 0;
}
.dashboard-leave-to {
  opacity: 0;
}
.dashboard-page {
  position: relative;
  padding: 1rem;
  .pc-max-frame {
    position: relative;
    overflow: hidden;
    min-height: 400px;
  }
  .views-container {
    width: 100%;
    height: 100%;
    position: relative;
    .view {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      overflow-y: scroll;
    }
    .view-center {
      justify-content: start;
    }
  }
}
</style>
