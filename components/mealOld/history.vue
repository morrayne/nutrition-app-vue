<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { getWeight, getCalories, getProteins, getFats, getCarbs } from "../../appSettings/defaultExport";
import { useMealTableStore } from "../../stores/useMealTableStore";
import { useMealAssetSavedStore } from "../../stores/useMealAssetSavedStore";
import { useMealAssetGroupStore } from "../../stores/useMealAssetGroupStore";

const { t } = useI18n();
const mealTableStore = useMealTableStore();
const mealAssetSaved = useMealAssetSavedStore();
const mealAssetgroup = useMealAssetGroupStore();

const groupedMeals = computed(() => {
  const grouped = new Map<string, any[]>();
  
  mealTableStore.table.forEach((meal) => {
    if (!grouped.has(meal.date)) grouped.set(meal.date, []);
    grouped.get(meal.date)!.push(meal);
  });
  
  return Array.from(grouped.entries()).map(([date, meals]) => {
    const allItems = [
      ...meals.flatMap((meal) => (meal.groups || []).map((id: string) => {
        const found = mealAssetgroup.groups.find((item: any) => item.id === id);
        return found ? { ...found, type: "group" } : { id, name: id, type: "group", notFound: true };
      })),
      ...meals.flatMap((meal) => (meal.saved || []).map((id: string) => {
        const found = mealAssetSaved.saved.find((item: any) => item.id === id);
        return found ? { ...found, type: "saved" } : { id, name: id, type: "saved", notFound: true };
      })),
      ...meals.flatMap((meal) => (meal.unsaved || []).map((item: any) => ({ ...item, type: "unsaved" }))),
    ];
    return { date, allItems };
  }).sort((a, b) => {
    const [aDay, aMonth, aYear] = a.date.split('.');
    const [bDay, bMonth, bYear] = b.date.split('.');
    return new Date(`${bYear}-${bMonth}-${bDay}`).getTime() - new Date(`${aYear}-${aMonth}-${aDay}`).getTime(); 
  });
});
</script>

<template>
  <div class="wh-100 prz-2 fl-col meal-log">
    <div class="date" v-for="data in groupedMeals" :key="data.date">
      <p>{{ data.date }}</p>
      <div class="table">
        <div class="fl-col solid-wrap table-item" v-for="(item, idx) in data.allItems" :key="idx">
          <div class="t">
            <p>{{ item.name }}</p>
            <p>{{ getWeight(item) + ' ' + t('g') }}</p>
          </div>
          <div class="b">
            <p>{{ t('calories') + ' ' + getCalories(item) }}</p>
            <p>{{ t('proteins') + ' ' + getProteins(item) }}</p>
            <p>{{ t('fats') + ' ' + getFats(item) }}</p>
            <p>{{ t('carbs') + ' ' + getCarbs(item) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.meal-log {
  width: 100%;
  gap: 1.5rem;
  .date {
    width: 100%;
    flex-direction: column;
    .table {
      width: 100%;
      margin-top: 1.5rem;
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(3, 1fr);
      .table-item {
        width: 100%;
        border-radius: 1.5rem;
        gap: 0.5rem;
        .t {
          width: 100%;
          justify-content: space-between;
          p {
            font-size: var(--size-s);
          }
        }
        .b {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          p {
            color: var(--ex-color);
            font-size: var(--size-xs);
          }
        }
      }
    }
  }
}
</style>
