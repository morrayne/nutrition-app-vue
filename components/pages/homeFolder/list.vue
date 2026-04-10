<script setup lang="ts">
import { computed } from "vue";
import localText from "../../ui/localText.vue";
import asset from "../../ui/asset.vue";

const props = defineProps<{ activeDate: string }>();

import { useMealStore } from "../../../stores/array/useMealStore";
const mealStore = useMealStore();

const currentDayMeals = computed(() => {
  return mealStore.meals.find((meal) => meal.date === props.activeDate)?.list || [];
});
</script>

<template>
  <TransitionGroup name="fade" tag="div" class="list">
    <asset v-for="value in currentDayMeals" :key="value.name" :meal="value" v-if="currentDayMeals.length !== 0" :edit="false" :x="true" />
    <div class="mini-wrap empty" v-else>
      <div class="dot"></div>
      <localText text="nothing-on-date" size="s" />
    </div>
  </TransitionGroup>
</template>

<style scoped lang="scss">
.list {
  flex-direction: column-reverse;
  gap: 0.75rem;

  .empty {
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
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
