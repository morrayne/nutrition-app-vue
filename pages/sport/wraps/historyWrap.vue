<script setup lang="ts">
import type { tWorkout } from "../../../appSettings/export/types/sport";

const props = defineProps<{
  construct: tWorkout;
}>();

import historyItem from "./historyItem.vue";
</script>

<template>
  <p class="text-l">{{ props.construct.date }}</p>
  <div class="w-100 grid grid-3 gap-50">
    <historyItem v-for="item in props.construct.list" :construct="item" />
  </div>
</template>

