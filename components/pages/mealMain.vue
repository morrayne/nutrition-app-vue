<script setup lang="ts">
import { ref } from "vue";
import localText from "../ui/localText.vue";
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
    size: 's',
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
  const asset : tAsset = { id: crypto.randomUUID(), name: data.name, weight: data.weight, calories: data.calories, proteins: data.proteins, fats: data.fats, carbs: data.carbs }
  if (data.log === 'send') log.value.push(asset);
  if (data.save === 'save') assetStore.addAsset(asset);
}

const addTodayMeal = () => {
  for (const meal of log.value) {
    mealStore.addMeal(meal);
  }
  log.value = [];
}

const handleDeleteFromLog = (id: string) => {
  const index = log.value.findIndex(item => item.id === id);
  if (index !== -1) log.value.splice(index, 1);
};
const deleteFromSave = (data: string) => {
  assetStore.delAsset(data);
}
</script>

<template>
  <div class="screen default-screen meal">
    <rowSelect v-bind="tab" :modelValue="activeTab" @update:modelValue="handleUpdate" />
    <!-- log -->
    <div class="display" v-if="activeTab === 'log'">
      <TransitionGroup name="fade" tag="div" class="display">
        <asset v-for="value in log" v-if="log.length !== 0" :key="value.id" :meal="value" :edit="false" :x="true" @delete="handleDeleteFromLog" />
        <button class="send" v-if="log.length !== 0" @click="addTodayMeal"></button>
        <div class="mini-wrap empty" v-else>
          <div class="dot"></div>
          <localText text="nothing-here" size="s" />
        </div>
      </TransitionGroup>
    </div>
    <!-- add -->
    <div class="display" v-if="activeTab === 'add'">
      <create @create="createAsset" />
    </div>
    <!-- saved -->
    <div v-if="activeTab === 'saved'">
      <TransitionGroup v-if="assetStore.assets.length !== 0" name="fade" tag="div" class="display">
        <asset v-for="value in assetStore.assets" :key="value.id" :meal="value" :edit="false" :x="true" @click="handleAssetClick(value)" @delete="deleteFromSave"  />
      </TransitionGroup>
      <TransitionGroup tag="div" style="width: 100%" v-else>
        <div class="mini-wrap empty" key=1>
          <div class="dot"></div>
          <localText text="nothing-here" size="s" />
        </div>
      </TransitionGroup>
    </div>
    <end />
  </div>
</template>

<style scoped lang="scss">
.meal {
  .empty {
    width: 100%;
    padding: 0.5rem 0.75rem;
    align-items: center;
    gap: 1rem;
    .dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      background: var(--re);
    }
  }
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
      cursor: pointer;
    }
    .send::after {
      content: var(--send);
    }
  }
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
