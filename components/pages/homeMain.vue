<script setup lang="ts">
import { ref, computed } from "vue";
import short from "./homeFolder/short.vue";
import list from "./homeFolder/list.vue";
import end from "../ui/end.vue";

import { useGoalStore } from "../../stores/single/useGoalStore";
const goalStore = useGoalStore();
import { useMealStore } from "../../stores/array/useMealStore";
const mealStore = useMealStore();

const today = new Date().toISOString().split("T")[0]!.replace(/-/g, ".");
const activeDate = ref(today);

const handleDateChange = (data: string) => {
  activeDate.value = data;
};
</script>

<template>
  <div class="screen home">
    <short :activeDate="activeDate" @change="handleDateChange" />
    <list :activeDate="activeDate" />
    <end />
  </div>
</template>

<style scoped lang="scss">
.home {
  padding: 1.25rem;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: scroll;
}

.home::-webkit-scrollbar {
  display: none;
}
</style>
