<script setup lang="ts">
import { computed } from "vue";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

import type { tMealAssetSaved, tMealAssetGroup, tMacro } from '../../appSettings/types';

import { useMealAssetSavedStore } from "../../stores/useMealAssetSavedStore";
const savedStore = useMealAssetSavedStore();
import { useMealAssetGroupStore } from "../../stores/useMealAssetGroupStore";
const mealAssetGroupStore = useMealAssetGroupStore();

import glass from "./glass.vue";

const props = defineProps<{
  asset: tMealAssetSaved | tMealAssetGroup;
  assetType: 'single' | 'group';
}>();


const macros = computed<tMacro>(() => {
  let m: tMacro = { calories: 0, proteins: 0, fats: 0, carbs: 0 };
  if (props.assetType === 'single') {
    const a = props.asset as tMealAssetSaved;
    return { calories: a.calories, proteins: a.proteins, fats: a.fats, carbs: a.carbs };
  } else {
    const group = props.asset as tMealAssetGroup;
    for (const id of group.list) {
      const item = savedStore.saved.find((i: tMealAssetSaved) => i.id === id);
      if (!item) continue;
      m.calories! += item.calories;
      m.proteins! += item.proteins;
      m.fats! += item.fats;
      m.carbs! += item.carbs;
    }
  }
  return m;
});

const weight = computed(() => {
  if (props.assetType === 'single') {
    const a = props.asset as tMealAssetSaved;
    return a.weight;
  }
  const group = props.asset as tMealAssetGroup;
  let total = 0;
  for (const id of group.list) {
    const item = savedStore.saved.find(i => i.id === id);
    if (!item) continue;
    total += item.weight;
  }
  return total;
});

const calotiesItem : { title: keyof tMacro; color: string } = {
  title: "calories", color: "pu"
}
const macrosArray : { title: keyof tMacro; color: string }[] = [
  { title: "calories", color: "pu" },
  { title: "proteins", color: "pi" },
  { title: "fats", color: "ye" },
  { title: "carbs", color: "gr" },
]

import { EllipsisVertical, X } from "@lucide/vue";
</script>

<template>
  <div class="meal-wrap">
    <div class="top">
      <glass :borderRadius="36" />
      <p class="name"> {{ props.asset.name }} </p>
      <p class="weight"> {{ weight + ' ' + t('g') }} </p>
      <div class="edit">
        <component :is="EllipsisVertical" color="var(--sub-color)" />
      </div>
      <div class="x">
        <component :is="X" color="var(--sub-color)" />
      </div>
    </div>
    <div class="mid">
      <div class="item" v-for="item in macrosArray">
        <div class="dot" :style="{background: `var(--${item.color})`}"></div>
        <p> {{ t(item.title) }} </p>
        <p> {{ macros[item.title] }} </p>
      </div>
    </div>
    <div class="bot" v-if="props.assetType === 'group'">
      <div class="item" v-for="item in (props.asset as tMealAssetGroup).list"> 
        <p> {{ savedStore.saved.find((i: tMealAssetSaved) => i.id === item)?.name }} </p>
        <p> {{ savedStore.saved.find((i: tMealAssetSaved) => i.id === item)?.weight }} </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.meal-wrap {
  width: 100%;
  min-height: fit-content;
  background: var(--sub-background);
  border: solid 1px var(--ex-background);
  flex-direction: column;
  padding: 0.75rem;
  border-radius: 2rem;
  overflow: hidden;
  .top, .mid, .bot {
    width: 100%;
  }
  .top {
    align-items: center;
    gap: 0.5rem;
    border-radius: 3rem;
    padding: 0.75rem;
    position: relative;
    .name {
      flex: 1;
      margin-left: 1rem;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .weight {
      height: 100%;
      font-size: var(--size-m);
      padding: 0.125rem 1rem;
      border-radius: 1rem;
      background: var(--ex-background);
      margin-left: auto;
      position: relative;
      z-index: 2;
    }
    .edit, .x {
      height: 100%;
      border-radius: 50%;
      padding: 0.25rem;
      aspect-ratio: 1 / 1;
      background: var(--ex-background);
      cursor: pointer;
      position: relative;
      z-index: 2;
    }
    p {
      font-weight: 500;
      position: relative;
      z-index: 2;
    }
  }
  .mid {
    display: grid;
    padding: 0.75rem 0 0;
    gap: 0.5rem;
    grid-template-columns: repeat(4, 1fr);
    .item {
      width: 100%;
      align-items: center;
      border: solid 1px var(--ex-background);
      justify-content: space-between;
      border-radius: 2rem;
      padding: 0.5rem 1rem;
      .dot {
        width: 0.75rem;
        height: 0.75rem;
        border-radius: 50%;
      }
      p {
        font-weight: 400;
        font-size: var(--size-s);
      }
    }
  }
  .bot {
    padding: 0 1rem 1rem;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 0.75rem;
    .item {
      width: 100%;
      justify-content: space-between;
      border-radius: 2rem;
      padding: 0.5rem 1rem;
      p {
        font-weight: 400;
        font-size: var(--size-s);
      }
    }
  }
}
</style>
