<!-- prettier-ignore -->
<script setup lang="ts">
import { ref, computed } from "vue";
import { useHistoryStore, useGoalStore } from "../stores";
import endUp from "./signUpInFolder/endUp.vue";
const historyStore = useHistoryStore();
const goalStore = useGoalStore();
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
const selectedDayData = () => {
  const dayData = historyStore.history.meals.find(meal => meal.date === activeDay.value);
  return dayData || { total: { calories: 0, proteins: 0, carbs: 0, fats: 0 } };
};
const setActiveDay = (fullDate: string) => {
  activeDay.value = fullDate;
};
type StatKey = "calories" | "proteins" | "carbs" | "fats";
const stats: { title: string; goal: StatKey }[] = [
  { title: "calories", goal: "calories" },
  { title: "proteins", goal: "proteins" },
  { title: "carbs", goal: "carbs" },
  { title: "fats", goal: "fats" }
];
const getPercentage = (goalKey: StatKey) => {
  const current = selectedDayData().total[goalKey] || 0;
  const goal = goalStore.goal[goalKey] || 1;
  return Math.min((current / goal) * 100, 100);
};
const circumference = 2 * Math.PI * 16;
const getOffset = (goalKey: StatKey) => {
  const percent = getPercentage(goalKey);
  if (percent === 0) return circumference * 0.95;
  if (percent >= 100) return 0;
  const remaining = 1 - percent / 100;
  if (remaining < 0.05) return circumference * 0.05;
  return circumference * remaining;
};
const getStrokeColor = (goalKey: StatKey) => {
  const percent = getPercentage(goalKey);
  if (percent === 100) return "var(--red)";
  switch (goalKey) {
    case "calories": return "var(--pink)";
    case "proteins": return "var(--pur)";
    case "carbs": return "var(--cian)";
    case "fats": return "var(--yellow)";
  }
};
const selectedDayItems = () => {
  const dayData = historyStore.history.meals.find(meal => meal.date === activeDay.value);
  return dayData?.items || [];
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
    <div class="bju">
      <div class="item" v-for="stat in stats" :key="stat.title">
        <!-- <div class="title" :style="{ '--title': `var(--${stat.title})` }"></div> -->
        <div class="round">
          <svg class="progress" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2.5" />
            <circle cx="20" cy="20" r="16" fill="none" :stroke="getStrokeColor(stat.goal)" stroke-width="2.5" :stroke-dasharray="circumference" :stroke-dashoffset="getOffset(stat.goal)" stroke-linecap="round" />
          </svg>
          <span class="percentage" :class="{ over: getPercentage(stat.goal) === 100 }">
            {{ Math.round(getPercentage(stat.goal)) }}%
          </span>
        </div>
        <!-- <div class="numbers" :class="{ over: selectedDayData().total[stat.goal] > (goalStore.goal[stat.goal] || 0) }">
          {{ selectedDayData().total[stat.goal] }} / {{ goalStore.goal[stat.goal] }}
        </div> -->
      </div>
    </div>
    <div class="meals-list">
      <div class="meal" v-for="item in selectedDayItems()" :key="item.name">
        <div class="left">
          <div class="icon"></div>
        </div>
        <div class="right">
          <div class="top">
            <p class="name">{{ item.name }}</p>
            <p class="g">{{ item.weight }}g</p>
          </div>
          <div class="bot">
            <span class="calories">{{ item.calories }}k</span>
            <span class="proteins">{{ item.proteins }}p</span>
            <span class="carbs">{{ item.carbs }}c</span>
            <span class="fats">{{ item.fats }}f</span>
          </div>
        </div>
      </div>
      <div v-if="selectedDayItems().length === 0" class="empty">
        nothing
      </div>
    </div>
    <endUp />
  </div>
</template>

<style scoped lang="scss">
.home {
  padding: var(--mm);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: scroll;

  h2 {
    color: var(--signup-main-text);
  }

  .meals-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .meal {
      display: flex;
      gap: 1rem;
      padding: calc(0.5 * var(--mm));
      border-radius: 2rem;
      background: var(--signup-sub-background);
      border: solid 1px var(--signup-main-border);
      box-shadow: var(--box-shadow);
      backdrop-filter: blur(6px);

      .left {
        height: 100%;

        .icon {
          height: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          background: var(--signup-main-border);
        }
      }

      .right {
        width: 100%;
        overflow: hidden;
        color: var(--signup-main-text);
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        .top {
          display: flex;
          font-size: calc(0.85 * var(--mm));

          .name {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .g {
            white-space: nowrap;
            margin: 0 0.5rem;
          }
        }

        .bot {
          display: flex;
          gap: 0.5rem;

          span {
            font-size: calc(0.65 * var(--mm));
            padding: calc(0.25 * var(--mm)) calc(0.25 * var(--mm));
            border-radius: 0.5rem;
          }

          .calories {
            background: var(--pink);
          }

          .proteins {
            background: var(--pur);
          }

          .carbs {
            background: var(--cian);
          }

          .fats {
            background: var(--yellow);
          }
        }
      }
    }
  }

  .day-wrap {
    display: flex;
    justify-content: space-between;
    gap: 0.375rem;

    .day {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.75rem 0.25rem;
      border-radius: 2rem;
      background: var(--signup-sub-background);
      border: solid 1px var(--signup-main-border);
      box-shadow: var(--box-shadow);
      backdrop-filter: blur(6px);
      color: var(--signup-main-text);
      font-size: calc(0.75 * var(--mm));
      cursor: pointer;
      transition: all 0.2s;

      .date {
        font-weight: 500;
        margin: 0;
      }

      .weekday {
        margin: 0;
        opacity: 0.7;
      }
    }

    .active {
      color: var(--signup-main-background);
      background: var(--signup-main-text);
      border: solid 1px var(--signup-main-text);

      .weekday {
        opacity: 1;
      }
    }
  }

  .bju {
    width: 100%;
    display: grid;
    gap: 0.5rem;
    grid-template-columns: repeat(4, 1fr);

    .item {
      width: 100%;
      padding: calc(0.25 * var(--mm));
      aspect-ratio: 1 / 1;
      border-radius: 1rem;
      background: var(--signup-sub-background);
      border: solid 1px var(--signup-main-border);
      box-shadow: var(--box-shadow);
      backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
      flex-direction: column;
      align-items: center;

      .title,
      .numbers {
        font-size: calc(0.75 * var(--mm));
        color: var(--signup-main-text);
      }

      .title::after {
        content: var(--title);
      }

      .round {
        width: 3rem;
        height: 3rem;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;

        .progress {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .percentage {
          position: absolute;
          font-size: calc(0.75 * var(--mm));
          font-weight: bold;
          color: var(--signup-main-text);
        }
      }
    }
  }
}

.home::-webkit-scrollbar {
  display: none;
}
</style>
