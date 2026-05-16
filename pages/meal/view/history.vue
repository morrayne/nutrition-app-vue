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

import datePicker from "../ui/datePicker.vue";
import macroWidget from "../ui/macroWidget.vue";
</script>

<template>
  <div class="w-100 g-1 half-screen">
    <macroWidget :date="activeDate" />
    <div class="def-wrap h-100"></div>
  </div>
  <datePicker v-model="activeDate" />
  <div class="w-100 flex-c g-05" v-for="item in history">
    <div class="flex-c g-05">
      <p class="fs-xl fw-6" v-if="item?.date">{{ item.date }}</p>
      <p class="fs-l fw-6" v-if="item?.products && item.products.length !== 0">{{ t("products") }}</p>
    </div>
    <div class="w-100 g-05 half-screen">
      <productWrap v-if="item?.products" v-for="subItem in item.products" :construct="subItem" />
      <productUnsaved v-if="item?.unsaved" v-for="subItem in item?.unsaved" :construct="subItem" />
    </div>
    <div class="flex-c g-05" v-if="item?.meals && item.meals.length !== 0">
      <p class="fs-l fw-6">{{ t("meals") }}</p>
    </div>
    <div class="w-100 g-05 half-screen" v-if="item?.meals">
      <mealWrap v-for="subItem in item.meals" :construct="{ ...getMealById(subItem.id!)!, intake: subItem.intake }" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.half-screen {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
@media (max-width: 768px) {
  .half-screen {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
