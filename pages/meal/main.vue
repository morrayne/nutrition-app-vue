<script setup lang="ts">
import { ref } from "vue";

import mealNavigation from "../../components/navigation/meal.vue";
const pageIndex = ref<string>("history");

import historyView from "./view/history.vue";
import intakeView from "./view/intake.vue";
import productsView from "./view/product.vue";
import mealView from "./view/meal.vue";
</script>

<template>
  <mealNavigation v-model="pageIndex" />
  <TransitionGroup name="meal" tag="div" class="w-100 h-100 max-w-1080 pos-r g-1">
    <div class="pos-a w-100 h-100 meal-pad overflow-y-auto flex-c g-05" :key="0" v-show="pageIndex === 'deppAnalisys'"></div>
    <div class="pos-a w-100 h-100 meal-pad overflow-y-auto flex-c g-05" :key="1" v-show="pageIndex === 'history'">
      <historyView />
    </div>
    <div class="pos-a w-100 h-100 meal-pad overflow-y-auto flex-c g-05" :key="2" v-show="pageIndex === 'intake'">
      <intakeView />
    </div>
    <div class="pos-a w-100 h-100 meal-pad overflow-y-auto flex-c g-05" :key="3" v-show="pageIndex === 'products'">
      <productsView />
    </div>
    <div class="pos-a w-100 h-100 meal-pad overflow-y-auto flex-c g-05" :key="4" v-show="pageIndex === 'meals'">
      <mealView />
    </div>
    <div class="pos-a w-100 h-100 meal-pad overflow-y-auto flex-c g-05" :key="5" v-show="pageIndex === 'suggestions'"></div>
  </TransitionGroup>
</template>

<style scoped lang="scss">
.meal-enter-from,
.meal-leave-to {
  opacity: 0;
}
.meal-enter-to,
.meal-leave-from {
  opacity: 1;
}
.meal-pad {
  padding-bottom: 6.5rem;
}
</style>
