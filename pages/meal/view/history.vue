<script setup lang="ts">
import { ref } from "vue";

import { today } from "../../../appSettings/export/vars/default";
const activeDate = ref<string>(today!);

import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { getFoodArrayByDate, getMealById } from "../../../appSettings/export/vars/food";
const history = getFoodArrayByDate(7);

import mealWrap from "../wrap/mealWithIntake.vue";
import productWrap from "../wrap/productWithIntake.vue";
import productUnsaved from "../wrap/productUnsavedWithIntake.vue";
</script>

<template>
  <div class="w-100 flex-c gap-50" v-for="item in history">
    <div class="flex-c gap-50">
      <p class="text-xl" v-if="item?.date">{{ item.date }}</p>
      <p class="text-l" v-if="item?.products && item.products.length !== 0">{{ t("products") }}</p>
    </div>
    <div class="w-100 gap-50 grid grid-3">
      <productWrap v-if="item?.products" v-for="subItem in item.products" :construct="subItem" />
      <productUnsaved v-if="item?.unsaved" v-for="subItem in item?.unsaved" :construct="subItem" />
    </div>
    <div class="flex-c gap-50" v-if="item?.meals && item.meals.length !== 0">
      <p class="text-l">{{ t("meals") }}</p>
    </div>
    <div class="w-100 gap-50 grid grid-3" v-if="item?.meals.length !== 0"">
      <mealWrap v-for="subItem in item.meals" :construct="{ ...getMealById(subItem.id!)!, intake: subItem.intake }" />
    </div>
  </div>
</template>
