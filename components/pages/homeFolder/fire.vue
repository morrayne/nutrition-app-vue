<script setup lang="ts">
import { computed } from 'vue';
import { useActiveDayStore } from '../../../stores/array/useActiveDayStore';
import { useMealStore } from '../../../stores/array/useMealStore';
import { useGoalStore } from '../../../stores/single/useGoalStore';

const activeDayStore = useActiveDayStore();
const mealStore = useMealStore();
const goalStore = useGoalStore();
const props = defineProps<{ today: string }>();

const isSuccessfulDay = (date: string): boolean => {
  const dayData = mealStore.meals.find(meal => meal.date === date);
  if (!dayData) return false;
  const total = dayData.total;
  const goal = goalStore.goal;
  const caloriesOk = total.calories >= (goal.calories || 0) * 0.9 && total.calories <= (goal.calories || 0) * 1.1;
  const proteinsOk = total.proteins >= (goal.proteins || 0) * 0.9 && total.proteins <= (goal.proteins || 0) * 1.1;
  const fatsOk = total.fats >= (goal.fats || 0) * 0.9 && total.fats <= (goal.fats || 0) * 1.1;
  const carbsOk = total.carbs >= (goal.carbs || 0) * 0.9 && total.carbs <= (goal.carbs || 0) * 1.1;
  const okCount = [caloriesOk, proteinsOk, fatsOk, carbsOk].filter(Boolean).length;
  return okCount >= 3;
};

const last21Days = computed(() => {
  const days = [];
  for (let i = 20; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const fullDate = date.toISOString().split('T')[0]!.replace(/-/g, '.');
    let status = 'inactive';
    if (fullDate === props.today) status = 'today';
    else if (activeDayStore.activeDays.includes(fullDate)) status = isSuccessfulDay(fullDate) ? 'success' : 'fail';
    days.push({ date: date.getDate(), fullDate: fullDate, status });
  }
  return days;
});

</script>

<template>
  <div class="mini-wrap fire">
    <div v-for="day in last21Days" :key="day.fullDate" class="item" :class="{ active: day.status === 'success', fail: day.status === 'fail', today: day.status === 'today' }"
    ></div>
  </div>
</template>

<style scoped lang="scss">
.fire {
  padding: 0.5rem 0.75rem;
  display: grid;
  gap: 0.125rem;
  grid-template-columns: repeat(21, 1fr);
  .item {
    width: 0.65rem;
    height: 0.65rem;
    background: var(--ex-background);
    border-radius: 0.5rem;
  }
  .active {
    background: var(--gr);
  }
  .fail {
    background: var(--re);
  }
  .today {
    background: var(--bl);
  }
}
</style>
