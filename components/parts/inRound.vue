<script setup lang="ts">
import { computed } from "vue";

import type { tInRound } from "../../appSettings/types";

const props = defineProps<tInRound>();
const circleRound = 18;
const circumference = 2 * Math.PI * 18;

const getOffset = (current: number, goal: number) => {
  const percent = getPercentage(current, goal);
  if (percent === 0) return circumference * 1;
  if (percent >= 100) return 0;
  const remaining = 1 - percent / 100;
  if (remaining < 0.05) return circumference * 0.05;
  return circumference * remaining;
};

const getPercentage = (current: number, goal: number) => {
  if (!goal || goal === 0) return 0;
  return Math.min((current / goal) * 100, 100);
};
const strokeColor = computed(() => {
  if (props.current > props.goal * 1.1) return `var(--re)`;
  return `var(--${props.color})`;
});
</script>

<template>
  <div class="in-round">
    <div class="short">
      <p class="top">{{ props.current }}</p>
      <p class="bot">{{ `/${props.goal}` }}</p>
    </div>
    <svg class="progres" viewBox="0 0 40 40">
      <circle cx="20" cy="20" :r="circleRound" fill="none" stroke="var(--ex-background)" stroke-width="2.5" />
      <circle cx="20" cy="20" :r="circleRound" fill="none" :stroke="strokeColor" stroke-width="2.5" :stroke-dasharray="circumference" :stroke-dashoffset="getOffset(props.current, props.goal)" stroke-linecap="round" />
    </svg>
  </div>
</template>

<style scoped lang="scss">
.in-round {
  height: 100%;
  aspect-ratio: 1 / 1;
  position: relative;
  .short {
    width: 100%;
    height: 100%;
    position: absolute;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    scale: 0.8;
    .top {
      font-size: var(--size-l);
      font-weight: 500;
    }
    .bot {
      font-size: var(--size-s);
    }
  }
  .progres {
    transform: rotate(-90deg);
  }
}
</style>
