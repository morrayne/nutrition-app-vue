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
  <div v-if="productWithCalculatedMacros" class="product-wrap pos-r bounce-s w-100 flex-c g-05 main">
    <div class="w-100 jus-sb ali-c top">
      <p class="text-m name">{{ productWithCalculatedMacros.name || "Unknown" }}</p>
      <div class="h-100 ali-c intake" :style="{ background: getColor(props.construct.intake) }">
        <p class="text-s">{{ t(props.construct.intake) }}</p>
      </div>
    </div>
    <div class="gap-50 bot">
      <div class="gap-50 ali-c" v-for="(item, index) in macros" :key="item.data">
        <div class="dot" v-if="index !== 0"></div>
        <p class="text-s">{{ Number(productWithCalculatedMacros[item.data as MacroKey]?.toFixed(1) || 0) + " " + t(item.title) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.product-wrap {
  padding: 0.75rem 1rem;
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
.product-wrap:hover {
  .controls {
    opacity: 1;
  }
}
</style>
