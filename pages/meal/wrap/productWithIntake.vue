<script setup lang="ts">
import { computed } from "vue";

import type { tProductSavedShort, tProductSaved } from "../../../appSettings/export/types/food";
import { getProductById } from "../../../appSettings/export/vars/food";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps<{
  construct: tProductSavedShort & { intake: string };
}>();

// Получаем продукт (может быть undefined)
const originalProduct = getProductById(props.construct.id);

// Вычисляем КБЖУ с учётом веса и количества
const productWithCalculatedMacros = computed(() => {
  if (!originalProduct) return null;
  const quantity = props.construct.quantity || 1;
  const weight = props.construct.weight || 100;
  const multiplier = (quantity * weight) / 100;
  return {
    ...originalProduct,
    weight: props.construct.weight,
    calories: (originalProduct.calories || 0) * multiplier,
    proteins: (originalProduct.proteins || 0) * multiplier,
    fats: (originalProduct.fats || 0) * multiplier,
    carbs: (originalProduct.carbs || 0) * multiplier,
  };
});

type MacroKey = "weight" | "calories" | "proteins" | "fats" | "carbs";
const macros = [
  // { title: "mealWeight", data: "weight" },
  { title: "shortCalories", data: "calories" },
  { title: "shortProteins", data: "proteins" },
  { title: "shortFats", data: "fats" },
  { title: "shortCarbs", data: "carbs" },
];

const getColor = (data: string) => {
  if (data === "breakfast") return "var(--bl)";
  if (data === "lunch") return "var(--re)";
  if (data === "supper") return "var(--pi)";
  if (data === "dinner") return "var(--pu)";
  if (data === "snack") return "var(--gr)";
};
</script>

<template>
  <div v-if="productWithCalculatedMacros" class="product-wrap bounce-s w-100 flex-c g-05 main">
    <div class="w-100 jus-sb ali-c top">
      <p class="text-m name">{{ productWithCalculatedMacros.name + " (" + props.construct.quantity + ")" || "Unknown" }}</p>
      <div class="h-100 ali-c intake" :style="{ background: getColor(props.construct.intake) }">
        <p class="text-s">{{ t(props.construct.intake) }}</p>
      </div>
    </div>
    <div class="gap-50 bot">
      <div class="gap-50 ali-c" v-for="(item, index) in macros" :key="item.data">
        <div class="dot" v-if="index !== 0"></div>
        <p class="text-s">{{ Number(productWithCalculatedMacros[item.data as MacroKey].toFixed(1)) + " " + t(item.title) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.product-wrap {
  padding: 0.75rem 1rem;
  .name {
    max-width: 80%;
    display: inline;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .intake {
    border-radius: 1rem;
    padding: 0 1rem;
    P {
      color: var(--white);
      opacity: 0.85;
    }
  }
  .bot {
    p {
      color: var(--ex-color);
    }
    .dot {
      width: 0.25rem;
      height: 0.25rem;
      border-radius: 50%;
      background: var(--ex-color);
    }
  }
}
.product-wrap:hover {
  .top .controls {
    opacity: 1;
  }
}
</style>
