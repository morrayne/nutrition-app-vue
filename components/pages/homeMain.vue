<script setup lang="ts">
import { ref } from "vue";
import LocalText from "../ui/localText.vue";
import end from "../ui/end.vue";
import list from "./homeFolder/list.vue";
import stats from "./homeFolder/stats.vue";
import daySwitcher from "./homeFolder/daySwitcher.vue";
import tableComp from "./homeFolder/table.vue";
import fire from "./homeFolder/fire.vue";

import { useGoalStore } from "../../stores/single/useGoalStore";
const goalStore = useGoalStore();
import { useMealStore } from "../../stores/array/useMealStore";
const mealStore = useMealStore();

const today = new Date().toISOString().split("T")[0]!.replace(/-/g, ".");
const activeDate = ref(new Date().toISOString().split("T")[0]!.replace(/-/g, "."));

const handleDateChange = (data: string) => {
  activeDate.value = data;
};
</script>

<template>
  <div class="default-screen home">
    <daySwitcher :activeDate="activeDate" @change="handleDateChange" />
    <localText text="your-goals" :weight="500" />
    <stats :activeDate="activeDate" /> 
    <localText text="last-3-weeks" :weight="500" />
    <fire :today="today" />
    <tableComp :activeDate="activeDate" />
    <localText text="daily-report" :weight="500" />
    <list :activeDate="activeDate" />
    <end />
  </div>
</template>
