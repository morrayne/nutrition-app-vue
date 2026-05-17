<script setup lang="ts">
import { computed } from "vue";

import type { tProductSavedShort } from "../../../appSettings/export/types/food";
import { getMealMacros, getProductById } from "../../../appSettings/export/vars/food";

import { useFoodHistoryStore } from "../../../stores/useFoodHistoryStore";
const foodHistory = useFoodHistoryStore();
import { useBodyStore } from "../../../stores/useBodyStore";
const bodyStore = useBodyStore();

const props = defineProps<{
  date: string;
}>();

const strokeWidth = 12;
const radii = [80, 64, 48, 32];

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const dayEntries = computed(() => {
  return foodHistory.foodHistory.filter((entry) => entry.date === props.date);
});

const getProductMacros = (product: tProductSavedShort) => {
  if (!product?.id || !product.weight || !product.quantity) return;
  const fullProduct = getProductById(product.id);
  if (!fullProduct) return;
  if (!fullProduct) return { calories: 0, proteins: 0, fats: 0, carbs: 0 };
  const multiplier = (product.weight / 100) * (product.quantity || 1);
  return { calories: (fullProduct.calories || 0) * multiplier, proteins: (fullProduct.proteins || 0) * multiplier, fats: (fullProduct.fats || 0) * multiplier, carbs: (fullProduct.carbs || 0) * multiplier };
};

// Суммируем все макросы за день
const dayMacros = computed(() => {
  const totals = { calories: 0, proteins: 0, fats: 0, carbs: 0 };
  for (const entry of dayEntries.value) {
    if (entry.products) {
      for (const product of entry.products) {
        const macros = getProductMacros(product);
        totals.calories += macros?.calories || 0;
        totals.proteins += macros?.proteins || 0;
        totals.fats += macros?.fats || 0;
        totals.carbs += macros?.carbs || 0;
      }
    }
    // Считаем блюда (разворачиваем их в продукты)
    if (entry.meals) {
      for (const mealId of entry.meals) {
        const mealMacros = getMealMacros(mealId);
        totals.calories += mealMacros.calories;
        totals.proteins += mealMacros.proteins;
        totals.fats += mealMacros.fats;
        totals.carbs += mealMacros.carbs;
      }
    }
    // Unsaved продукты (пока просто суммируем, но у них нет id)
    if (entry.unsaved) {
      for (const unsaved of entry.unsaved) {
        const multiplier = (unsaved.weight || 100) / 100;
        totals.calories += (unsaved.calories || 0) * multiplier;
        totals.proteins += (unsaved.proteins || 0) * multiplier;
        totals.fats += (unsaved.fats || 0) * multiplier;
        totals.carbs += (unsaved.carbs || 0) * multiplier;
      }
    }
  }
  return totals;
});

// Проценты относительно нормы
const percentages = computed(() => {
  const goal = bodyStore.body;
  return {
    calories: goal.calories ? (dayMacros.value.calories / goal.calories) * 100 : 0,
    proteins: goal.proteins ? (dayMacros.value.proteins / goal.proteins) * 100 : 0,
    fats: goal.fats ? (dayMacros.value.fats / goal.fats) * 100 : 0,
    carbs: goal.carbs ? (dayMacros.value.carbs / goal.carbs) * 100 : 0,
  };
});

// Данные для кругов (от большего к меньшему)
const circles = computed(() => {
  return [
    { key: "calories", title: "calories", color: "var(--pu)", value: dayMacros.value.calories, goal: bodyStore.body.calories, percent: percentages.value.calories },
    { key: "proteins", title: "proteins", color: "var(--pi)", value: dayMacros.value.proteins, goal: bodyStore.body.proteins, percent: percentages.value.proteins },
    { key: "fats", title: "fats", color: "var(--ye)", value: dayMacros.value.fats, goal: bodyStore.body.fats, percent: percentages.value.fats },
    { key: "carbs", title: "carbs", color: "var(--gr)", value: dayMacros.value.carbs, goal: bodyStore.body.carbs, percent: percentages.value.carbs },
  ];
});
</script>

<!-- prettier-ignore -->
<template>
  <div class="main jus-sb ali-c w-100">
    <svg class="svg" viewBox="-100 -100 200 200">
      <circle v-for="(circle, index) in circles" :key="`bg-${circle.key}`" :r="radii[index]" cx="0" cy="0" fill="none" stroke="var(--ex-background)" :stroke-width="strokeWidth" />
      <circle v-for="(circle, index) in circles" :key="`fill-${circle.key}`" :r="radii[index]" cx="0" cy="0" fill="none" :stroke="circle.color" :stroke-width="strokeWidth" stroke-linecap="round" :stroke-dasharray="2 * Math.PI * radii[index]!" :stroke-dashoffset="2 * Math.PI * radii[index]! * (1 - circle.percent / 100)" :style="{ transform: 'rotate(-90deg)' }" />
    </svg>
    <div class="legend w-100 h-100 flex-c jus-c g-05">
      <div v-for="circle in circles" :key="circle.key" class="w-100 flex-c">
        <p class="top text-l">{{ t(circle.title) + ' ' + Math.round(circle.percent) + '%'}}</p>
        <p class="bot text-m">{{ Math.round(circle.value) }} / {{ circle.goal || 0 }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.main {
  padding: 0.5rem 1rem;
  .svg {
    max-width: 15rem;
    width: 65%;
    // transform: rotate(-30deg);
  }
  .legend {
    width: 35%;
    .flex-c {
      align-items: end;
      .top {
        color: var(--main-color);
      }
      .bot {
        color: var(--ex-color);
      }
    }
  }
}
</style>
