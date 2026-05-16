<script setup lang="ts">
import type { tWorkout } from "../../../appSettings/export/types/sport";

const props = defineProps<{
  construct: tWorkout;
}>();

import historyItem from "./historyItem.vue";
</script>

<template>
  <p class="fs-l fw-6">{{ props.construct.date }}</p>
  <div class="w-100 g-05 half">
    <historyItem v-for="item in props.construct.list" :construct="item" />
  </div>
</template>

<style scoped lang="scss">
.half {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
@media (max-width: 768px) {
  .half {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
