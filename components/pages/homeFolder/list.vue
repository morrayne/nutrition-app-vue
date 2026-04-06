<script setup lang="ts">
import { computed } from "vue";
import asset from "../../ui/asset.vue";

const props = defineProps<{ activeDate: string }>();

import { useMealStore } from "../../../stores/array/useMealStore";
const mealStore = useMealStore();

const currentDayMeals = computed(() => {
  return (mealStore.meals.find((meal) => meal.date === props.activeDate)?.list || []);
});
</script>

<template>
  <div class="list">
    <asset v-for="value in currentDayMeals" :key="value.name" :meal="value" />
  </div>
</template>

<style scoped lang="scss">
.list {
  flex-direction: column;
  gap: 0.5rem;
}
</style>
