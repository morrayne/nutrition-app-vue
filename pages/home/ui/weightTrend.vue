<script setup lang="ts">
import { computed } from "vue";
import type { tWeightLog } from "../../../appSettings/export/types/store";
import { useWeightLogStore } from "../../../stores/useWeightLogStore";

const weightLogStore = useWeightLogStore();

const getPercentages = (logs: tWeightLog[]) => {
  const last10 = [...logs].slice(-10);
  if (last10.length === 0) return [];
  const weights = last10.map((log) => log.weight).filter((w) => w !== undefined) as number[];
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const calculatePercent = (value: number, min: number, max: number) => {
    if (min === max) return 50;
    const normalized = (value - min) / (max - min);
    return 10 + normalized * 80;
  };
  return last10.map((log) => ({
    id: log.id,
    date: log.date,
    percent: log.weight !== undefined ? calculatePercent(log.weight, minWeight, maxWeight) : 50,
    value: log.weight,
  }));
};

const chartData = computed(() => getPercentages(weightLogStore.weightLog));
</script>

<template>
  <div class="h-100 main">
    <div class="w-100 h-100 jus-sb flex-r gap-100 z">
      <div v-for="item in chartData" :key="item.id" class="h-100 flex-c gap-50 jus-e ali-c e">
        <p class="text-s pos-a main c">{{ item.date }}</p>
        <div class="bar" :style="{ height: `${item.percent}%` }"></div>
        <p class="text-m">{{ item.value }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.z {
  min-height: 6rem;
}
.c {
  width: fit-content;
  padding: 0.25rem 0.5rem;
  opacity: 0;
  top: 0.5rem;
  left: 0.5rem;
  z-index: 3;
}
.e:hover, .e:active {
  .c {
    opacity: 1;
  }
}
.bar {
  width: 1rem;
  background: var(--focus);
}
</style>
