<script setup lang="ts">
import { computed } from "vue";
import localText from "../../ui/localText.vue";

const props = defineProps<{ activeDate: string }>();
const emits = defineEmits<{ (e: "change", value: string): void }>();

interface week {
  date: number;
  weekday: string;
  fullDate: string;
}
const lastMonth: week[] = [];
for (let i = 30; i >= 0; i--) {
  const date = new Date();
  date.setDate(date.getDate() - i);
  lastMonth.push({
    date: date.getDate(),
    weekday: date
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase(),
    fullDate: date.toISOString().split("T")[0]!.replace(/-/g, "."),
  });
}
lastMonth.reverse();

const handleClick = (data: string) => {
  emits("change", data);
};

import { useGoalStore } from "../../../stores/single/useGoalStore";
const goalStore = useGoalStore();
import { useMealStore } from "../../../stores/array/useMealStore";
const mealStore = useMealStore();

const circumference = 2 * Math.PI * 16;
const getPercentage = (current: number, goal: number) => {
  if (!goal || goal === 0) return 0;
  return Math.min((current / goal) * 100, 100);
};
const getOffset = (current: number, goal: number) => {
  const percent = getPercentage(current, goal);
  if (percent === 0) return circumference * 0.99;
  if (percent >= 100) return 0;
  const remaining = 1 - percent / 100;
  if (remaining < 0.05) return circumference * 0.05;
  return circumference * remaining;
};

interface macro {
  key: "calories" | "proteins" | "fats" | "carbs";
  label: string;
  color: string;
}
const macros: macro[] = [
  { key: "calories", label: "calories", color: "re" },
  { key: "proteins", label: "proteins", color: "pu" },
  { key: "fats", label: "fats", color: "ye" },
  { key: "carbs", label: "carbs", color: "gr" },
];

const currentDayMeals = computed(() => {
  return mealStore.meals.find((meal) => meal.date === props.activeDate);
});
const getMacroValue = (key: macro["key"]) => {
  return currentDayMeals.value?.total?.[key] || 0;
};
const getMacroGoal = (key: macro["key"]) => {
  return goalStore.goal[key] || 1;
};
</script>

<template>
  <div class="short">
    <div class="week">
      <div v-for="value in lastMonth" :key="value.fullDate" :class="activeDate === value.fullDate ? 'day active' : 'day'" @click="handleClick(value.fullDate)">
        <p class="date">{{ value.date }}</p>
        <localText :text="value.weekday" size="s" />
      </div>
    </div>
    <div class="grid">
      <div class="card" v-for="macro in macros" :key="macro.key">
        <localText :text="macro.label" size="s" />
        <div class="circle">
          <svg class="progress" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="16" fill="none" stroke="var(--sub-background)" stroke-width="2.5" />
            <circle cx="20" cy="20" r="16" fill="none" :stroke="`var(--${macro.color})`" stroke-width="2.5" :stroke-dasharray="circumference" :stroke-dashoffset="getOffset(getMacroValue(macro.key), getMacroGoal(macro.key))" stroke-linecap="round" />
          </svg>
          <span class="percent">{{ Math.round(getPercentage(getMacroValue(macro.key), getMacroGoal(macro.key))) }}%</span>
        </div>
        <div class="value">{{ getMacroValue(macro.key) }} / {{ getMacroGoal(macro.key) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.short {
  width: 100%;
  max-height: 14rem;
  flex-direction: row-reverse;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: calc(2 * var(--newrem));
  border: solid 1px var(--ex-background);
  background: var(--sub-background);
  box-shadow: var(--box-shadow);

  .week {
    flex: 1;
    flex-direction: column;
    align-items: end;
    gap: 0.25rem;
    overflow: scroll;

    .day {
      max-width: 36px;
      width: 100%;
      padding: 0.5rem 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 2rem;
      border: solid 1px var(--ex-background);
      cursor: pointer;

      .date {
        font-size: 15px;
        font-weight: 500;
      }
    }

    .active {
      background: var(--ex-background);
    }
  }

  .week::-webkit-scrollbar {
    display: none;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;

    .card {
      max-width: 92px;
      aspect-ratio: 1 / 1;
      background: var(--ex-background);
      border-radius: 1rem;
      padding: 0.125rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.125rem;

      .circle {
        width: 3.5rem;
        height: 3.5rem;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;

        .progress {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .percent {
          font-weight: 500;
          position: absolute;
          font-size: 14px;
        }
      }

      .value {
        font-size: 10px;
        white-space: nowrap;
        text-align: center;
      }
    }
  }
}
</style>
