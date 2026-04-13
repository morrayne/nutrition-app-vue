<script setup lang="ts">
import localText from "../../ui/localText.vue";

const props = defineProps<{ activeDate: string }>();
const emits = defineEmits<{ (e: "change", value: string): void }>();

interface week {
  date: number;
  weekday: string;
  fullDate: string;
}
const lastMonth: week[] = [];
for (let i = 7; i >= 0; i--) {
  const date = new Date();
  date.setDate(date.getDate() - i);
  lastMonth.push({ date: date.getDate(), weekday: date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase(), fullDate: date.toISOString().split("T")[0]!.replace(/-/g, ".") });
}

const handleClick = (data: string) => {
  emits('change', data)
}
</script>

<template>
  <div class="mini-wrap day-switcher">
    <div v-for="value in lastMonth" :key="value.fullDate" :class="props.activeDate === value.fullDate ? 'item active' : 'item'" @click="handleClick(value.fullDate)">
      <p class="date">{{ value.date }}</p>
      <localText :text="value.weekday" size="s" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.day-switcher {
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  gap: 0.25rem;
  .item {
    flex: 1;
    padding: 0.5rem 0;
    flex-direction: column;
    align-items: center;
    border-radius: 0.65rem;
    cursor: pointer;
    .date {
      font-size: var(--size-s);
      font-weight: 500;
    }
  }
  .active {
    background: var(--ex-background);
  }
}
</style>
