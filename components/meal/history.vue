<script setup lang="ts">
import { ref, computed, watch } from "vue";

import { today, dateToISO, getMealByTd, getCalories, getProteins, getFats, getCarbs } from "../../appSettings/defaultExport";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

import simpleMealItem from "./simpleMealItem.vue";

import { useMealTableStore } from "../../stores/useMealTableStore";
const mealTableStore = useMealTableStore();
import { useGoalStore } from "../../stores/useGoalStore";
const goalStore = useGoalStore();

const groupedHistory = computed(() => {
  const grouped = new Map<string, any[]>();
  mealTableStore.table.forEach((meal) => {
    if (!grouped.has(meal.date!)) grouped.set(meal.date!, []);
    grouped.get(meal.date!)!.push(meal);
  });
  return Array.from(grouped.entries()).map(([date, meals]) => {
    const allItems: any[] = [];
    meals.forEach((meal) => {
      (meal.groups || []).forEach((groupId: number) => {
        allItems.push(Number(groupId));
      });
      (meal.saved || []).forEach((savedId: number) => {
        allItems.push(Number(savedId));
      });
      (meal.unsaved || []).forEach((unsaved: any) => {
        if (unsaved && unsaved.name) allItems.push(unsaved);
      });
    });
    return { date, items: allItems };
  });
});

import inRound from "../ui/inRound.vue";
import type { tInRound } from "../../appSettings/types";

const activeDate = ref(today);

const macroByDate = computed(() => {
  return getMacroForDate(activeDate.value!);
});

const getMacroForDate = (date: string) => {
  const macro = {
    calories: 0,
    proteins: 0,
    fats: 0,
    carbs: 0,
  };
  const list = groupedHistory.value.find((item: any) => dateToISO(item.date) === activeDate.value);
  if (!list) return macro;
  list.items.forEach((item: any) => {
    let mealData;
    if (typeof item === "object" && item.name) mealData = item;
    else mealData = getMealByTd(item);
    if (mealData) {
      macro.calories += getCalories(mealData);
      macro.proteins += getProteins(mealData);
      macro.fats += getFats(mealData);
      macro.carbs += getCarbs(mealData);
    }
  });
  macro.calories = Math.round(macro.calories * 10) / 10;
  macro.proteins = Math.round(macro.proteins * 10) / 10;
  macro.fats = Math.round(macro.fats * 10) / 10;
  macro.carbs = Math.round(macro.carbs * 10) / 10;
  return macro;
};

const stats: tInRound[] = [
  { title: "calories", color: "pu", current: macroByDate.value.calories, goal: goalStore.goal.calories! },
  { title: "proteins", color: "pi", current: macroByDate.value.proteins, goal: goalStore.goal.proteins! },
  { title: "fats", color: "ye", current: macroByDate.value.fats, goal: goalStore.goal.fats! },
  { title: "carbs", color: "gr", current: macroByDate.value.carbs, goal: goalStore.goal.carbs! },
];
</script>

<template>
  <div class="wh-100 fl-col history">
    <p class="h2">{{ t("male") }}</p>
    <div class="widgets">
      <div class="solid-wrap inround-wrap">
        <inRound v-for="value in stats" :key="value.title" v-bind="value" />
      </div>
    </div>
    <p class="h2">{{ t("history") }}</p>
    <div class="filters">
      <p class="filter-item" v-for="value in 5">{{ t("male") }}</p>
    </div>
    <div class="fl-col block" v-for="groupItem in groupedHistory">
      <div class="block-top">
        <p class="date">{{ groupItem.date }}</p>
        <div class="status">
          <div class="dot"></div>
          <p>{{ t("male") }}</p>
        </div>
      </div>
      <div class="block-bot">
        <simpleMealItem v-for="item in groupItem.items" :mealIdOrUnsaved="item" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.history {
  gap: 1rem;
  .widgets {
    width: 100%;
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(2, 1fr);
    border-radius: 1.25rem;
    .inround-wrap {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(4, 1fr);
      border-radius: 1.25rem;
    }
    .solid-wrap {
      width: 100%;
      gap: 0.5rem;
      border-radius: 1.5rem;
      padding: 0.5rem 1rem 0.75rem;
      p {
        font-size: var(--size-s);
        color: var(--ex-color);
      }
      .bar-holder {
        width: 100%;
        display: grid;
        gap: 0.125rem;
        grid-template-columns: repeat(10, 1fr);
        .bar {
          width: 100%;
          background: #000;
          border-radius: 0.25rem;
          height: 2rem;
        }
      }
    }
  }
  .filters {
    width: 100%;
    gap: 1rem;
    .filter-item {
      padding: 0.25rem 1rem;
      font-size: var(--size-s);
      background: var(--sub-background-tr);
      border-radius: 2rem;
      border: solid 1px var(--ex-background-tr);
      cursor: pointer;
    }
  }
  .block {
    width: 100%;
    gap: 1rem;
    .block-top,
    .block-bot {
      width: 100%;
    }
    .block-top {
      justify-content: space-between;
      .date {
        font-weight: 400;
      }
      .status {
        height: 100%;
        align-items: center;
        gap: 1rem;
        padding: 0 1rem;
        border: solid 1px var(--ex-background-tr);
        border-radius: 1rem;
        background: var(--sub-background-tr);
        .dot {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 0.5rem;
          background: var(--gr);
        }
        p {
          font-size: var(--size-s);
        }
      }
    }
    .block-bot {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(3, 1fr);
    }
  }
}
</style>
