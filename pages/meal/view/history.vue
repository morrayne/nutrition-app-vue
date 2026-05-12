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
  <macroWidget :date="activeDate" />
  <datePicker v-model="activeDate" />
  <div class="w-100 flex-c g-05" v-for="item in history">
    <p class="fs-xl fw-6" v-if="item?.date">{{ item.date }}</p>
    <p class="fs-l fw-6" v-if="item?.products && item.products.length !== 0">{{ t("products") }}</p>
    <productWrap v-if="item?.products" v-for="subItem in item.products" :construct="subItem" />
    <productUnsaved v-if="item?.unsaved" v-for="subItem in item?.unsaved" :construct="subItem" />
    <p class="fs-l fw-6" v-if="item?.meals && item.meals.length !== 0">{{ t("meals") }}</p>
    <mealWrap v-if="item?.meals" v-for="subItem in item.meals" :construct="{ ...getMealById(subItem.id!)!, intake: subItem.intake }" />
  </div>
</template>
