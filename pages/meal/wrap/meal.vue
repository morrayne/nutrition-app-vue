<script setup lang="ts">
import { X } from "@lucide/vue";
import type { tMeal } from "../../../appSettings/export/types/food";

import { getProductById, getMealMacros } from "../../../appSettings/export/vars/food";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps<{
  construct: tMeal;
  active?: boolean;
}>();
const emits = defineEmits<{
  (e: "delete", value: number): void;
  (e: "main", value: tMeal): void;
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
</script>

<template>
  <div class="meal-wrap bounce w-100 flex-c g-05 def-wrap" :class="props.active ? 'active' : ''" @click="emits('main', props.construct)">
    <p class="fs-l fw-6">{{ props.construct.name }}</p>
    <div class="def-wrap controls" @click.stop>
      <button style="scale: 0.9" @click="emits('delete', props.construct.id!)">
        <X color="var(--sub-color)" />
      </button>
    </div>
    <div class="w-100 g-05 macros">
      <p class="w-100 j-c fs-s fw-4 macros-item" v-for="(item, index) in macros">{{ "cal" + " " + item.worth }}</p>
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
.active {
  border: solid 1px var(--gr);
}
.meal-wrap {
  padding: 0.75rem 1rem;
  .controls {
    width: fit-content;
    padding: 0.125rem;
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    opacity: 0;
  }
  .macros {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    .macros-item {
      padding: 0.25rem 0;
      border-radius: 1rem;
      color: var(--ex-color);
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
