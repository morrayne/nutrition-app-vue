<script setup lang="ts">
import type { tMealAssetSaved, tMealAssetUnsaved, tMealAssetGroup } from "../../appSettings/types";
import { getMealByTd, getWeight, getCalories, getProteins, getFats, getCarbs } from "../../appSettings/defaultExport";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
  mealIdOrUnsaved: number | string | tMealAssetUnsaved;
}>();

const mealData = () => {
  if (typeof props.mealIdOrUnsaved === 'object') return props.mealIdOrUnsaved;
  return getMealByTd(props.mealIdOrUnsaved);
};

const macro = [
  { title: "calories", func: getCalories },
  { title: "proteins", func: getProteins },
  { title: "fats", func: getFats },
  { title: "carbs", func: getCarbs },
];
</script>

<template>
  <div class="solid-wrap fl-col bot-item" v-if="mealData()">
    <div class="bot-item-top">
      <p>{{ mealData()!.name }}</p>
      <p>{{ getWeight(mealData()!) + " " + t("g") }}</p>
    </div>
    <div class="bot-item-bot">
      <p class="any" v-for="item in macro" :key="item.title">
        {{ t(item.title) + " " + item.func(mealData()!) }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bot-item {
  width: 100%;
  border-radius: 1.25rem;
  gap: 0.5rem;
  .bot-item-top {
    width: 100%;
    justify-content: space-between;
  }
  .bot-item-bot {
    width: 100%;
    display: grid;
    gap: 0.25rem;
    grid-template-columns: repeat(2, 1fr);
    p {
      color: var(--ex-color);
      font-size: var(--size-xs);
    }
  }
}
</style>
