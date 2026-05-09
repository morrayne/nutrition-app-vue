<script setup lang="ts">
import { ref } from "vue";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { useMealStore } from "../../../stores/useMealStore";
const mealStore = useMealStore();
import { useProductStore } from "../../../stores/useProductStore";
const productStore = useProductStore();

import vSwitch from "../../../components/form/vSwitch.vue";
import { mealOrProducts, viewOrAdd } from "../../../appSettings/export/vSwitch";

const topMode = ref<"view" | "add">("view");
const botMode = ref<"newMeal" | "products">("products");

import vInput from "../../../components/form/vInput.vue";
import { mealName } from "../../../appSettings/export/vInput";

import mealWrap from "../wrap/meal.vue";

import { getProductShortById, getProductById } from "../../../appSettings/export/food";

import type { tMeal, tProductSaved } from "../../../appSettings/types/food";

const basket = ref<tMeal>({
  id: undefined,
  name: undefined,
  list: [],
});
const isThisInBasket = (data: number) => {
  const foundProduct = basket.value.list!.find((item) => item.id === data);
  if (foundProduct) return true;
};
const removeProduct = (data: number) => {
  basket.value.list = basket.value.list!.filter((item) => item.id !== data);
};
const addProduct = (data: tProductSaved) => {
  if (!data.id) return;
  const existingProduct = basket.value.list!.find((item) => item.id === data.id);
  if (existingProduct && existingProduct.quantity < 10) existingProduct.quantity++;
  else basket.value.list!.push({ ...getProductShortById(data.id)!, quantity: 1 });
};
const clearBasket = () => {
  basket.value.id = undefined;
  basket.value.name = undefined;
  basket.value.list = [];
};

const finish = async () => {
  if (!basket.value.name || basket.value.list!.length === 0) return;

  loading.value = true;

  try {
    basket.value.id = getDateLikeId();
    console.log("Saving meal:", JSON.parse(JSON.stringify(basket.value)));

    const result = await mealStore.addItem(basket.value);

    if (result) {
      console.log("✅ Meal saved successfully");
      clearBasket();
      await mealStore.getStore();
      topMode.value = "view";
    } else {
      console.error("❌ Failed to save meal");
    }
  } catch (error) {
    console.error("Error saving meal:", error);
  } finally {
    loading.value = false;
  }
};

import loadingWrap from "../../../components/wraps/loading.vue";
const loading = ref<boolean>(false);

import productWrap from "../wrap/product.vue";
import shortProduct from "../wrap/shortProduct.vue";
import { getDateLikeId } from "../../../appSettings/export/default";
</script>

<template>
  <loadingWrap v-if="loading" />
  <vSwitch :construct="viewOrAdd" v-model="topMode" />
  <mealWrap v-for="item in mealStore.meals" :construct="item" v-if="topMode === 'view'" />
  <vSwitch :construct="mealOrProducts" v-model="botMode" v-if="topMode === 'add'" />
  <vInput v-model="basket.name" :construct="mealName" v-if="topMode === 'add' && botMode === 'newMeal'" />
  <p class="w-100 j-c fs-l fw-6 bounce def-wrap" v-if="topMode === 'add' && botMode === 'newMeal'" @click="finish">{{ t("finish") }}</p>
  <shortProduct v-for="item in basket.list" :construct="getProductById(item.id)!" v-model:weight="item.weight" v-model:quantity="item.quantity" v-if="topMode === 'add' && botMode === 'newMeal'" @delete="removeProduct" />
  <productWrap v-for="item in productStore.products" :construct="item" v-if="topMode === 'add' && botMode === 'products'" @main="addProduct" :active="isThisInBasket(item.id!)" @delete="removeProduct" />
</template>
