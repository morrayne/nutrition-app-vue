<script setup lang="ts">
import { computed } from "vue";
import type { tMealAssetSaved, tMealAssetGroup } from "../../appSettings/types";
import { useMealAssetSavedStore } from "../../stores/useMealAssetSavedStore";
import glass from "./glass.vue";

const props = defineProps<{
  asset: tMealAssetSaved | tMealAssetGroup;
  assetType: "single" | "group";
}>();

const savedStore = useMealAssetSavedStore();

const getProductById = (id: string) => {
  return savedStore.saved.find(p => p.id === id);
};

const totalCalories = computed(() => {
  if (props.assetType === "single") return (props.asset as tMealAssetSaved).calories || 0;
  const group = props.asset as tMealAssetGroup;
  let sum = 0;
  group.list?.forEach(id => {
    const product = getProductById(id);
    if (product) sum += product.calories || 0;
  });
  return sum;
});

const totalProteins = computed(() => {
  if (props.assetType === "single") return (props.asset as tMealAssetSaved).proteins || 0;
  const group = props.asset as tMealAssetGroup;
  let sum = 0;
  group.list?.forEach(id => {
    const product = getProductById(id);
    if (product) sum += product.proteins || 0;
  });
  return sum;
});

const totalFats = computed(() => {
  if (props.assetType === "single") return (props.asset as tMealAssetSaved).fats || 0;
  const group = props.asset as tMealAssetGroup;
  let sum = 0;
  group.list?.forEach(id => {
    const product = getProductById(id);
    if (product) sum += product.fats || 0;
  });
  return sum;
});

const totalCarbs = computed(() => {
  if (props.assetType === "single") return (props.asset as tMealAssetSaved).carbs || 0;
  const group = props.asset as tMealAssetGroup;
  let sum = 0;
  group.list?.forEach(id => {
    const product = getProductById(id);
    if (product) sum += product.carbs || 0;
  });
  return sum;
});

const totalWeight = computed(() => {
  if (props.assetType === "single") return (props.asset as tMealAssetSaved).weight || 0;
  const group = props.asset as tMealAssetGroup;
  let sum = 0;
  group.list?.forEach(id => {
    const product = getProductById(id);
    if (product) sum += product.weight;
  });
  return sum;
});

const macro = [
  { title: 'calories', color: 'pu', worth: totalCalories.value },
  { title: 'proteins', color: 'pi', worth: totalProteins.value },
  { title: 'fats', color: 'ye', worth: totalFats.value },
  { title: 'carbs', color: 'ci', worth: totalCarbs.value },
]

import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';
const dragRef = useTemplateRef<HTMLElement>('dragRef');
makeDraggable(dragRef, { events: { onDragStart: (e) => console.log('start') }, dragHandle: '.handle',  activation: { distance: 0 } }, () => [Number(props.asset.id), [props.asset]]);
</script>

<template>
  <div ref="dragRef" class="mini-wrap short-meal handle">
    <glass :borderRadius="28" />
    <div class="short-top">
      <div class="main-dot"></div>
      <p class="name"> {{ props.asset.name }} </p>
      <p class="weight"> {{ totalWeight + ' ' + t('g') }} </p>
    </div>
    <div class="short-bot">
      <div class="short-item" v-for="item in macro"> 
        <div class="dot" :style="{background: `var(--${item.color})`}"></div>  
        <p> {{ t(item.title) }} </p>
        <p> {{ item.worth }} </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.short-meal {
  width: 100%;
  padding: 0.75rem;
  gap: 0.5rem;
  background: transparent;
  border: transparent;
  flex-direction: column;
  position: relative;
  cursor: grab;
  .short-top {
    width: 100%;
    align-items: center;
    gap: 1.25rem;
    padding: 0.5rem 0.125rem 0.5rem 0.75rem;
    position: relative;
    z-index: 3;
    .main-dot {
      width: 0.75rem;
      height: 0.75rem;
      border-radius: 50%;
      background: var(--ex-background);
    }
    .name {
      font-size: var(--size-s);
    }
    .weight {
      font-size: var(--size-s);
    }
  }
  .short-bot {
    width: 100%;
    display: grid;
    gap: 0.5rem;
    grid-template-columns: repeat(4, 1fr);
    position: relative;
    z-index: 3;
    .short-item {
      width: 100%;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      padding: 0.25rem 0.75rem;
      border-radius: 2rem;
      border: solid 1px var(--ex-background);
      background: var(--sub-background-tr);
      .dot {
        width: 0.75rem;
        height: 0.75rem;
        border-radius: 50%;
      }
      p {
        color: var(--sub-color);
        font-size: var(--size-xs);
      }
    }
  }
}
</style>
