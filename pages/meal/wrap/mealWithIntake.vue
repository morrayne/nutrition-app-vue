<script setup lang="ts">
import { X } from "@lucide/vue";
import type { tMeal } from "../../../appSettings/export/types/food";

import { getProductById, getMealMacros } from "../../../appSettings/export/vars/food";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps<{
  construct: tMeal & { intake: string };
}>();

const macros = [
  // @ts-ignore
  { title: "shortCalories", data: "calories", worth: Number(getMealMacros(props.construct.id!).calories.toFixed(1)), color: "var(--pu)" },
  // @ts-ignore
  { title: "shortProteins", data: "proteins", worth: Number(getMealMacros(props.construct.id!).proteins.toFixed(1)), color: "var(--pi)" },
  // @ts-ignore
  { title: "shortFats", data: "fats", worth: Number(getMealMacros(props.construct.id!).fats.toFixed(1)), color: "var(--ye)" },
  // @ts-ignore
  { title: "shortCarbs", data: "carbs", worth: Number(getMealMacros(props.construct.id!).carbs.toFixed(1)), color: "var(--gr)" },
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
  <div class="meal-wrap bounce w-100 flex-c g-05 def-wrap">
    <div class="w-100 j-b top">
      <p class="fs-l fw-6">{{ props.construct.name }}</p>
      <div class="h-100 a-c intake" :style="{ background: getColor(props.construct.intake) }">
        <p class="fs-xs fw-6">{{ t(props.construct.intake) }}</p>
      </div>
    </div>
    <div class="w-100 g-05 macros">
      <p class="w-100 j-c fs-s fw-6 macros-item" v-for="(item, index) in macros">{{ "cal" + " " + item.worth }}</p>
    </div>
    <div class="w-100 flex-c g-05 receit">
      <div class="w-100 j-b receit-item" v-for="item in props.construct.list">
        <p class="fs-s fw-5">{{ getProductById(item.id)?.name + " (" + item.quantity + ")" }}</p>
        <p class="fs-s fw-6">{{ item.weight + t("g") }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.meal-wrap {
  margin-top: 0.5rem;
  padding: 0.75rem 1rem;
  .top {
    .intake {
      border-radius: 1rem;
      padding: 0 1rem;
      P {
        color: var(--white);
        opacity: 0.85;
      }
    }
  }
  .macros {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    .macros-item {
      padding: 0.25rem 0;
      border-radius: 1rem;
      background: var(--ex-background);
    }
  }
  .receit {
    .receit-item {
      p {
        color: var(--sub-color);
      }
    }
  }
}
.meal-wrap:hover {
  .controls {
    opacity: 1;
  }
}
</style>
