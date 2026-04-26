<script setup lang="ts">
import { ref, computed } from "vue";

import { today, getMealByTd } from "../../appSettings/defaultExport";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

import simpleMealItem from "./simpleMealItem.vue";

import { useMealTableStore } from "../../stores/useMealTableStore";
const mealTableStore = useMealTableStore();

const groupedHistory = computed(() => {
  const grouped = new Map<string, any[]>();
  mealTableStore.table.forEach((meal) => {
    if (!grouped.has(meal.date)) grouped.set(meal.date, []);
    grouped.get(meal.date)!.push(meal);
  });
  return Array.from(grouped.entries()).map(([date, meals]) => {
    const allItems: any[] = [];
    meals.forEach(meal => {
      (meal.groups || []).forEach((groupId: string) => {
        allItems.push(groupId);
      });
      (meal.saved || []).forEach((savedId: string) => {
        allItems.push(savedId);
      });
      (meal.unsaved || []).forEach((unsaved: any) => {
        if (unsaved && unsaved.name) allItems.push(unsaved);
      });
    });
    return { date, items: allItems };
  });
});

const filters = {
  field: "",
  direction: ""
}
</script>

<template>
  <div class="wh-100 fl-col history">
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
