<script setup lang="ts">
import { ref } from "vue";
import { useHistoryStore } from "../stores";
const historyStore = useHistoryStore();
import endUp from "./signUpInFolder/endUp.vue";
const weekdays = ["su", "mn", "tu", "we", "th", "fr", "sa"];
const days = [];
for (let i = 6; i >= 0; i--) {
  const date = new Date();
  date.setDate(date.getDate() - i);
  days.push({
    date: date.getDate(),
    weekday: weekdays[date.getDay()],
    fullDate: date.toISOString().split("T")[0],
  });
}
const last7Days = days;
const activeDay = ref(last7Days[6]!.fullDate);
const setActiveDay = (fullDate: string) => {
  activeDay.value = fullDate;
  console.log(fullDate);
};
</script>

<template>
  <div class="screen home">
    <div class="day-wrap">
      <div class="day" :class="{ active: activeDay === day.fullDate }" v-for="day in last7Days" :key="day.fullDate" @click="setActiveDay(day.fullDate!)">
        <p class="date">{{ day.date }}</p>
        <p class="weekday">{{ day.weekday }}</p>
      </div>
    </div>
    <endUp />
  </div>
</template>

<style scoped lang="scss">
.home {
  padding: var(--mm);
  gap: 0.5rem;

  .day-wrap {
    display: flex;
    justify-content: space-between;

    .day {
      display: flex;
      flex-direction: column;
      padding: 0.75rem 0.5rem;
      border-radius: 2rem;
      background: var(--signup-sub-background);
      border: solid 1px var(--signup-main-border);
      box-shadow: var(--box-shadow);
      backdrop-filter: blur(6px);
      color: var(--signup-main-text);
      font-size: calc(0.75 * var(--mm));
      cursor: pointer;
    }

    .active {
      color: var(--signup-main-background);
      background: var(--signup-main-text);
      border: solid 1px var(--signup-main-text);
    }
  }
}
</style>
