<script setup lang="ts">
import { computed } from "vue";
import inRound from "./inRound.vue";

const props = defineProps<{ activeDate: string }>();

import { useGoalStore } from "../../../stores/single/useGoalStore";
const goalStore = useGoalStore();
import { useMealStore } from "../../../stores/array/useMealStore";
const mealStore = useMealStore();

const activeDateObj = computed(() => {
  return mealStore.meals.find(meal => meal.date === props.activeDate);
});

const inRoundArray = computed(() => [
  { color: 'pi', current: activeDateObj.value?.total?.calories || 0, goal: goalStore.goal.calories || 0, text: 'short-calories' },
  { color: 'pu', current: activeDateObj.value?.total?.proteins || 0, goal: goalStore.goal.proteins || 0, text: 'short-proteins' },
  { color: 'ye', current: activeDateObj.value?.total?.fats || 0, goal: goalStore.goal.fats || 0, text: 'short-fats' },
  { color: 'gr', current: activeDateObj.value?.total?.carbs || 0, goal: goalStore.goal.carbs || 0, text: 'short-carbs' },
]);
</script>

<template>
  <div class="mini-wrap stats">
    <inRound v-for="value in inRoundArray" v-bind="value" :key="value.text" />
  </div>
</template>

<style scoped lang="scss">
.stats {
  width: 100%;
  gap: 0.5rem;
}
</style>
