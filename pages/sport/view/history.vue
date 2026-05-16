<script setup lang="ts">
import { useWorkoutStore } from "../../../stores/useWorkoutStore";
const workoutStore = useWorkoutStore();

import historyWrap from "../wraps/historyWrap.vue";
</script>

<template>
  <historyWrap v-for="item in workoutStore.workouts" :construct="item" />
</template>
