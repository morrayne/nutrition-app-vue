<script setup lang="ts">
// CONTENT
// vue import
import { ref, computed } from "vue";
// vars
const weekDays = ["mn", "tu", "we", "th", "fr", "sa", "su"];
const currentDate = ref(new Date());
const todayIndex = 6;
const selectedDay = ref(todayIndex);
// emits
const emit = defineEmits(["select-date"]);
// top menu creator
const weekNumbers = computed(() => {
  const today = currentDate.value.getDate();
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(currentDate.value);
    day.setDate(today - (6 - i));
    return day.getDate();
  });
});
// data format to emit
const fullDates = computed(() => {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentDate.value);
    date.setDate(currentDate.value.getDate() - (6 - i));
    return date.toISOString().split("T")[0];
  });
});
// day picker and emit
const selectDay = (index: number) => {
  const selectedDate = fullDates.value[index];
  // console.log("Selected date:", selectedDate);
  selectedDay.value = index;
  emit("select-date", selectedDate);
};
// onmount emits today
const emitToday = () => {
  emit("select-date", fullDates.value[todayIndex]);
};
</script>

<template>
  <div class="weekdays">
    <div class="item" v-for="(day, index) in 7" :key="index" :class="{ active: selectedDay === index }" @click="selectDay(index)">
      <p>{{ weekNumbers[index] }}</p>
      <p>{{ weekDays[index] }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.weekdays {
  width: 100%;
  height: fit-content;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.375rem;

  .item {
    width: 100%;
    background: var(--back-b);
    background: var(--back-b);
    border: 1px solid var(--liquid-glass-border);
    box-shadow: var(--box-shadow);
    padding: 0.5rem 0;
    border-radius: 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;

    p {
      color: var(--text-a);
      text-align: center;
      font-size: calc(0.9 * var(--mm));
    }
  }

  .active {
    background: var(--accent);

    p {
      color: var(--back-a);
      font-weight: bold;
    }
  }
}
</style>
