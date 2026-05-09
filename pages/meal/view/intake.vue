<script setup lang="ts">
import { ref } from "vue";

const topMode = ref<"basket" | "add">("add");
const botMode = ref<"products" | "meals">("products");

import vSwitch from "../../../components/form/vSwitch.vue";
import { intakeType } from "../../../appSettings/export/vSelectDropdown";
import vSelect from "../../../components/form/vSelect.vue";
import { intakeMode, intakeBasket } from "../../../appSettings/export/vSwitch";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { useMealStore } from "../../../stores/useMealStore";
const mealStore = useMealStore();
import { useProductStore } from "../../../stores/useProductStore";
const productStore = useProductStore();
import { useFoodHistoryStore } from "../../../stores/useFoodHistoryStore";
const foodHistoryStore = useFoodHistoryStore();

import { getProductById, getMealById, getProductShortById } from "../../../appSettings/export/food";
import type { tFoodHistory, tProductSaved, tMeal } from "../../../appSettings/types/food";

const emptyBasket: tFoodHistory = {
  id: undefined,
  date: undefined,
  intake: "breakfast",
  products: [],
  meals: [],
  unsaved: [],
};
const basket = ref<tFoodHistory>(emptyBasket);
const clearBasket = () => {
  basket.value.id = undefined;
  basket.value.date = undefined;
  basket.value.intake = "breakfast";
  basket.value.products = [];
  basket.value.meals = [];
  basket.value.unsaved = [];
};

import mealWrap from "../wrap/meal.vue";
import productWrap from "../wrap/product.vue";
import shortProduct from "../wrap/shortProduct.vue";

const addProduct = (data: tProductSaved) => {
  if (!data.id) return;
  const existingProduct = basket.value.products!.find((item) => item.id === data.id);
  if (existingProduct && existingProduct.quantity < 10) existingProduct.quantity++;
  else basket.value.products!.push({ ...getProductShortById(data.id)!, quantity: 1 });
};
const addMeal = (data: tMeal) => {
  if (!data.id) return;
  const existingMeal = basket.value.meals!.find((item) => item === data.id);
  if (existingMeal) return;
  else basket.value.meals!.push(data.id);
};
const isThisInBasket = (data: number) => {
  const foundProduct = basket.value.products!.find((item) => item.id === data);
  const foundMeal = basket.value.meals!.find((item) => item === data);
  if (foundProduct || foundMeal) return true;
};
const removeProduct = (data: number) => {
  basket.value.products = basket.value.products!.filter((item) => item.id !== data);
};
const removeMeal = (data: number) => {
  basket.value.products = basket.value.products!.filter((item) => item.id !== data);
};

const finish = async () => {
  loading.value = true;
  setTimeout(() => {
    try {
      foodHistoryStore.addItem(basket.value);
    } finally {
      foodHistoryStore.getStore();
      clearBasket();
      loading.value = false;
    }
  }, 250);
};

const loading = ref<boolean>(false);
import loadingWrap from "../../../components/wraps/loading.vue";
</script>

<template>
  <loadingWrap v-if="loading" />
  <vSwitch :construct="intakeBasket" v-model="topMode" />
  <vSelect :construct="intakeType" v-model="basket.intake" v-if="topMode === 'basket'" /> 
  <p class="w-100 j-c fs-l fw-6 bounce def-wrap" v-if="topMode === 'basket'" @click="finish">{{ t("finish") }}</p>
  <vSwitch :construct="intakeMode" v-model="botMode" v-if="topMode === 'add'" />
  <!-- in basket -->
  <shortProduct v-for="item in basket.products" :construct="getProductById(item.id)!" v-model:weight="item.weight" v-model:quantity="item.quantity" v-if="topMode === 'basket'" @delete="removeProduct" />
  <mealWrap v-for="item in basket.meals" :construct="getMealById(item)!" v-if="topMode === 'basket'" @delete="removeMeal" />
  <!-- just display -->
  <productWrap v-for="item in productStore.products" :construct="item" v-if="topMode === 'add' && botMode === 'products'" @main="addProduct" :active="isThisInBasket(item.id!)" @delete="removeProduct" />
  <mealWrap v-for="item in mealStore.meals" :construct="item" v-if="topMode === 'add' && botMode === 'meals'" @main="addMeal" :active="isThisInBasket(item.id!)" @delete="removeMeal" />
</template>
