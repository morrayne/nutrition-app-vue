<script setup lang="ts">
import { ref } from "vue";

import { X, ArrowLeft } from "@lucide/vue";

import vSelect from "../../../components/form/vSelect.vue";
import { intakeType } from "../../../appSettings/export/form/vSelect";
import vSwitcherTrio from "../../../components/form/vSwitcherTrio.vue";
import { intake } from "../../../appSettings/export/form/vSwitcherTrio";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const loading = ref<boolean>(false);
import loadingWrap from "../../../components/wraps/loading.vue";

import { useMealStore } from "../../../stores/useMealStore";
const mealStore = useMealStore();
import { useProductStore } from "../../../stores/useProductStore";
const productStore = useProductStore();
import { useFoodHistoryStore } from "../../../stores/useFoodHistoryStore";
const foodHistoryStore = useFoodHistoryStore();

import { getProductById, getMealById, getProductShortById } from "../../../appSettings/export/vars/food";
import type { tFoodHistory, tProductSaved, tProductUnsaved, tMeal } from "../../../appSettings/export/types/food";

const mainMode = ref<"basket" | "products" | "meals">("basket");

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
import productUnsaved from "../wrap/productUnsaved.vue";
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

const menu = ref<boolean>(false);
const editor = ref<tProductUnsaved>({
  name: undefined,
  calories: undefined,
  proteins: undefined,
  carbs: undefined,
  fats: undefined,
});

const addUnsaved = () => {
  menu.value = true;
};
const pushUnsaved = () => {
  if (!editor.value.name?.trim()) {
    console.warn("Product name is required");
    return;
  }
  const newUnsaved: tProductUnsaved = {
    name: editor.value.name,
    calories: editor.value.calories || 0,
    proteins: editor.value.proteins || 0,
    fats: editor.value.fats || 0,
    carbs: editor.value.carbs || 0,
  };
  basket.value.unsaved!.push(newUnsaved);
  console.log("Added unsaved:", newUnsaved);
  clearEditor();
  menu.value = false;
};

import vInputString from "../../../components/form/vInputString.vue";
import { mealName } from "../../../appSettings/export/form/vInputString";
import vInputNumber from "../../../components/form/vInputNumber.vue";
import { mealCalories, mealProteins, mealCarbs, mealFats } from "../../../appSettings/export/form/vInputNumber";

const clearEditor = () => {
  editor.value.name = undefined;
  editor.value.calories = undefined;
  editor.value.proteins = undefined;
  editor.value.fats = undefined;
  editor.value.carbs = undefined;
};
</script>

<template>
  <loadingWrap v-if="loading" />
  <vSwitcherTrio :construct="intake" v-model="mainMode" />
  <vSelect :construct="intakeType" v-model="basket.intake" v-if="mainMode === 'basket'" />
  <!--  -->
  <div class="w-100 h-100 g-05 pos-a editor-wrap" v-if="menu">
    <div class="flex-c g-05 def-wrap editor">
      <div class="w-100 g-05 a-c double">
        <vInputString :construct="mealName" v-model="editor.name" />
        <!-- prettier-ignore -->
        <div class="h-100 def-wrap round" @click="menu = false; clearEditor()">
          <ArrowLeft color="var(--sub-color)" />
        </div>
      </div>
      <div class="g-05 middle">
        <vInputNumber :construct="mealCalories" v-model="editor.calories" />
        <vInputNumber :construct="mealProteins" v-model="editor.proteins" />
        <vInputNumber :construct="mealFats" v-model="editor.fats" />
        <vInputNumber :construct="mealCarbs" v-model="editor.carbs" />
      </div>
      <div class="w-100 g-05 a-c double">
        <p class="w-100 j-c finish def-wrap" @click="pushUnsaved">{{ t("pushUnsaved") }}</p>
        <div class="h-100 def-wrap round" @click="clearEditor"><X color="var(--sub-color)" /></div>
      </div>
    </div>
  </div>
  <div class="w-100 g-05 duo" v-if="mainMode === 'basket'">
    <p class="w-100 j-c fs-l fw-5 bounce fs-m def-wrap" @click="addUnsaved">{{ t("addUnsaved") }}</p>
    <p class="w-100 j-c fs-l fw-5 bounce fs-m def-wrap" @click="finish">{{ t("finish") }}</p>
  </div>
  <!-- in basket -->
  <productUnsaved v-for="item in basket.unsaved" :construct="item" />
  <shortProduct v-for="item in basket.products" :construct="getProductById(item.id)!" v-model:weight="item.weight" v-model:quantity="item.quantity" v-if="mainMode === 'basket'" @delete="removeProduct" />
  <mealWrap v-for="item in basket.meals" :construct="getMealById(item)!" v-if="mainMode === 'basket'" @delete="removeMeal" />
  <!-- just display -->
  <productWrap v-for="item in productStore.products" :construct="item" v-if="mainMode === 'products'" @main="addProduct" :active="isThisInBasket(item.id!)" @delete="removeProduct" />
  <mealWrap v-for="item in mealStore.meals" :construct="item" v-if="mainMode === 'meals'" @main="addMeal" :active="isThisInBasket(item.id!)" @delete="removeMeal" />
</template>

<style scoped lang="scss">
.duo {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  .def-wrap {
    padding: 0.75rem 0;
    border-radius: 1.25rem;
  }
}
.editor-wrap {
  align-items: end;
  position: absolute;
  z-index: 10;
  .editor {
    backdrop-filter: blur(0.5rem);
    padding: 1rem;
    border-radius: 2rem;
    overflow: hidden;
    .middle {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
    }
    .double {
      .def-wrap {
        padding: 1rem;
      }
      .finish {
        padding: 0.9rem 1rem;
      }
      .round {
        width: fit-content;
        aspect-ratio: 1 / 1;
        padding: 0.75rem;
        border-radius: 4rem;
        svg {
          width: 1.5rem;
          height: 1.5rem;
        }
      }
    }
  }
}
</style>
