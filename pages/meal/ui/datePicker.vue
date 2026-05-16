<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  modelValue: string;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

interface dateItem {
  fullDate: string;
  day: string;
  weekday: string;
}
const getWeekday = (date: Date): string => {
  const weekdays = ["su", "mn", "tu", "we", "th", "fr", "sa"];
  return weekdays[date.getDay()]!;
};
const getLast30Days = (): dateItem[] => {
  const days: dateItem[] = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const fullDate = date.toISOString().split("T")[0]!; 
    const day = String(date.getDate()).padStart(2, "0");
    const weekday = getWeekday(date);

    days.push({ fullDate, day, weekday });
  }
  return days;
};
const last30Days = ref<dateItem[]>(getLast30Days());

import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>

<template>
  <div class="w-100 def-wrap">
    <div class="w-100 h-100 g-05 list">
      <div class="flex-c a-c bounce item" v-for="day in last30Days" :key="day.fullDate" :class="day.fullDate === props.modelValue ? 'active' : ''" @click="emits('update:modelValue', day.fullDate)">
        <p class="fs-l fw-6">{{ day.day }}</p>
        <p class="fs-m fw-4">{{ t(day.weekday) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.def-wrap {
  padding: 0.75rem;
  .list {
    width: 100%;
    border-radius: 0.5rem;
    display: grid;
    grid-template-columns: repeat(15, 1fr);
    .item {
      padding: 0.25rem 0.5rem;
      border-radius: 0.75rem;
      background: var(--sub-background);
      border: solid 1px var(--ex-background);
      cursor: pointer;
    }
    .active {
      background: var(--ex-background);
      // border: solid 1px var(--gr);
    }
  }
}
.def-wrap .list::-webkit-scrollbar {
  display: none;
}

@media (max-width: 768px) {
  .list {
    width: fit-content !important;
    display: flex !important;
    flex-direction: row-reverse !important;
    overflow-x: scroll !important;
  }
}
</style>
