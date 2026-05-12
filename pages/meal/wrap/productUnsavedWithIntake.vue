<script setup lang="ts">
import { computed } from "vue";

import type { tProductUnsaved } from "../../../appSettings/export/types/food";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps<{
  construct: tProductUnsaved & { intake: string };
}>();

const emits = defineEmits<{
  (e: "delete", value: tProductUnsaved): void;
  (e: "main", value: tProductUnsaved): void;
}>();

// Вычисляем КБЖУ с учётом веса (для unsaved вес всегда 100г за порцию)
const productWithCalculatedMacros = computed(() => {
  if (!props.construct.name) return null;

  return {
    ...props.construct,
    weight: 100,
    calories: props.construct.calories || 0,
    proteins: props.construct.proteins || 0,
    fats: props.construct.fats || 0,
    carbs: props.construct.carbs || 0,
  };
});

type MacroKey = "weight" | "calories" | "proteins" | "fats" | "carbs";
const macros = [
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
  return "var(--ex-color)";
};
</script>

<template>
  <div v-if="productWithCalculatedMacros" class="product-wrap bounce w-100 flex-c g-05 def-wrap">
    <div class="w-100 j-b top">
      <p class="fs-l fw-6 name">{{ productWithCalculatedMacros.name || "Unknown" }}</p>
      <div class="h-100 a-c intake" :style="{ background: getColor(props.construct.intake) }">
        <p class="fs-xs fw-6">{{ t(props.construct.intake) }}</p>
      </div>
    </div>
    <div class="g-05 bot">
      <div class="g-05 a-c item" v-for="(item, index) in macros" :key="item.data">
        <div class="dot" v-if="index !== 0"></div>
        <p class="fs-s fw-5">{{ Number(productWithCalculatedMacros[item.data as MacroKey]?.toFixed(1) || 0) }} cal</p>
        <!-- <p class="fs-s fw-5">{{ Number(productWithCalculatedMacros[item.data as MacroKey]?.toFixed(1) || 0) }} {{ t(item.title) }}</p> -->
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.product-wrap {
  padding: 0.75rem 1rem;
  position: relative;
  .top {
    .name {
      max-width: 70%;
      display: inline;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .intake {
      border-radius: 1rem;
      padding: 0 1rem;
      p {
        color: var(--white);
        opacity: 0.85;
      }
    }
  }
  .bot {
    .item {
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
}
.product-wrap:hover {
  .controls {
    opacity: 1;
  }
}
</style>
