<script setup lang="ts">
import { ref } from "vue";
import create from "./mealFolder/create.vue";
import end from "../ui/end.vue";
import rowSelect from "../form/rowSelect.vue";
import type { tRowSelectOpt, tRowSelect } from "../form/rowSelect.vue";
import type { tAsset, tAllMeals } from "../../stores/main/types";

import asset from "../ui/asset.vue";
import { useAssetStore } from "../../stores/array/useAssetStore";
const assetStore = useAssetStore();
import { useMealStore } from "../../stores/array/useMealStore";
const mealStore = useMealStore();

const activeTab = ref("add");
const tabOpt: tRowSelectOpt[] = [
  { title: "log", toEmit: "log" },
  { title: "add", toEmit: "add" },
  { title: "saved", toEmit: "saved" },
];
const tab: tRowSelect = {
  data: {
    type: "string",
    start: 1,
    options: tabOpt,
  },
};
const handleUpdate = (value: string | number) => {
  activeTab.value = value as string;
};

const log = ref<tAsset[]>([]);
const handleAssetClick = (value: tAsset) => {
  log.value.push(value);
};

const createAsset = (data: any) => {
  const asset : tAsset = {
    id: crypto.randomUUID(),
    name: data.name,
    weight: data.weight,
    calories: data.calories,
    proteins: data.proteins,
    fats: data.fats,
    carbs: data.carbs,
  }
  if (data.log === 'send') {
    log.value.push(asset);
  }
  if (data.save === 'save') {
    assetStore.addAsset(asset);
  }
}

const addTodayMeal = () => {
  for (const meal of log.value) {
    mealStore.addMeal(meal);
  }
  log.value = [];
}
</script>

<template>
  <div class="screen default-screen meal">
    <rowSelect v-bind="tab" :modelValue="activeTab" @update:modelValue="handleUpdate" />
    <div class="display" v-if="activeTab === 'log'">
      <asset v-for="value in log" :meal="value" :edit="false" :x="true" />
      <button class="send" v-if="log.length !== 0" @click="addTodayMeal"></button>
    </div>
    <div class="display" v-if="activeTab === 'add'">
      <create @create="createAsset" />
    </div>
    <div class="display" v-if="activeTab === 'saved'">
      <asset v-for="value in assetStore.assets" :meal="value" @click="handleAssetClick(value)" :edit="true" :x="true" :style="{ cursor: 'pointer' }" />
    </div>
    <end />
  </div>
</template>

<style scoped lang="scss">
.meal {

  .display {
    flex: 1;
    flex-direction: column;
    gap: 0.75rem;

    .send {
      margin-top: auto;
      font-size: var(--size-m);
      justify-content: center;
      padding: calc(0.75 * var(--newrem)) calc(1.25 * var(--newrem));
      border: solid 1px var(--ex-background);
      border-radius: calc(1.5 * var(--newrem));
      background: var(--sub-background);
      box-shadow: var(--box-shadow);
    }

    .send::after {
      content: var(--send);
    }
  }
}
</style>
