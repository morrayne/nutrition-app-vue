<script setup lang="ts">
import { computed } from "vue";
import inRound from "./inRound.vue";

const props = defineProps<{ activeDate: string }>();

import { useGoalStore } from "../../stores/useGoalStore";
const goalStore = useGoalStore();
import { useMealTableStore } from "../../stores/useMealTableStore";
const mealTableStore = useMealTableStore();
import { useMealAssetSavedStore } from "../../stores/useMealAssetSavedStore";
const mealAssetSavedStore = useMealAssetSavedStore();

const activeDateEntry = computed(() => {
  return mealTableStore.table.find(item => item.date === props.activeDate);
});

const calculateTotal = () => {
  const entry = activeDateEntry.value;
  if (!entry) {
    return { calories: 0, proteins: 0, fats: 0, carbs: 0 };
  }
  let totals = { calories: 0, proteins: 0, fats: 0, carbs: 0 };
  for (let i = 0; i < entry.saved.length; i++) {
    const savedId = entry.saved[i];
    const savedItem = mealAssetSavedStore.saved.find(asset => asset.id === savedId);
    if (savedItem) {
      totals.calories += savedItem.calories;
      totals.proteins += savedItem.proteins;
      totals.fats += savedItem.fats;
      totals.carbs += savedItem.carbs;
    }
  }
  for (let i = 0; i < entry.unsaved.length; i++) {
    const unsavedItem = entry.unsaved[i];
    totals.calories += unsavedItem?.calories || 0;
    totals.proteins += unsavedItem?.proteins || 0;
    totals.fats += unsavedItem?.fats || 0;
    totals.carbs += unsavedItem?.carbs || 0;
  }
  return totals;
};

const inRoundArray = computed(() => {
  const totals = calculateTotal();
  return [
    { color: 'pu', current: totals.calories, goal: goalStore.goal.calories || 0, text: 'shortCalories' },
    { color: 'pi', current: totals.proteins, goal: goalStore.goal.proteins || 0, text: 'shortProteins' },
    { color: 'ye', current: totals.fats, goal: goalStore.goal.fats || 0, text: 'shortFats' },
    { color: 'gr', current: totals.carbs, goal: goalStore.goal.carbs || 0, text: 'shortCarbs' },
  ];
});
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
  justify-content: space-between;
  padding: 1rem !important;
  border-radius: 1rem;
}
</style>
