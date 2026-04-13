<script setup lang="ts">
import { computed } from "vue";
import localText from "../../ui/localText.vue";

const props = defineProps<{ activeDate: string }>();

import { useMealStore } from "../../../stores/array/useMealStore";
const mealStore = useMealStore();
import { useGoalStore } from "../../../stores/single/useGoalStore";
const goalStore = useGoalStore();

// Получаем последние 21 день
const last21Days = computed(() => {
  const days = [];
  for (let i = 20; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const fullDate = date.toISOString().split("T")[0]!.replace(/-/g, ".");
    days.push(fullDate);
  }
  return days;
});

// Проверка успешности для конкретного макроса
const getSuccessRate = (macro: 'calories' | 'proteins' | 'fats' | 'carbs'): number => {
  const days = last21Days.value;
  const goal = goalStore.goal[macro];
  if (!goal) return 0;
  
  const successfulDays = days.filter(date => {
    const dayData = mealStore.meals.find(meal => meal.date === date);
    if (!dayData) return false;
    const value = dayData.total[macro];
    return value >= goal * 0.9 && value <= goal * 1.1;
  }).length;
  
  return Math.round((successfulDays / days.length) * 100);
};

const stats = computed(() => [
  { color: "pi", text: "short-calories", rate: getSuccessRate('calories') },
  { color: "ye", text: "short-fats", rate: getSuccessRate('fats') },
  { color: "pu", text: "short-proteins", rate: getSuccessRate('proteins') },
  { color: "gr", text: "short-carbs", rate: getSuccessRate('carbs') },
]);
</script>

<template>
  <div class="mini-wrap table">
    <localText text="goal-succes" size="s" />
    <div class="bot">
      <div class="row" v-for="row in stats" :key="row.color">
        <div class="dot" :style="{background: `var(--${row.color})`}"></div>
        <localText :text="row.text" size="s" />
        <div class="numbers">
          <p class="t"></p>
          <p class="b">{{ row.rate }}%</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.table {
  flex-direction: column;
  padding: 0.75rem;
  gap: 0.5rem;
  .bot {
    display: grid;
    gap: calc(0.65 * var(--size-s));
    grid-template-columns: repeat(2, 1fr);
    .row {
      padding: 0.25rem 0.5rem;
      gap: calc(0.65 * var(--size-s));
      justify-content: space-between;
      align-items: center;
      border: solid 1px var(--ex-background);
      border-radius: 1rem;
      .dot {
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 50%;
        background: var(--ex-background);
      }
      .numbers {
        .b {
          font-size: var(--size-s);
        }
      }
    }
  }
}
</style>
