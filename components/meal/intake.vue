<script setup lang="ts">
import { ref } from "vue";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

import type { tMealAssetSaved, tMealAssetUnsaved, tMealAssetGroup, tMealTableItem } from "../../appSettings/types";

import { useMealAssetSavedStore } from "../../stores/useMealAssetSavedStore";
const mealAssetSavedStore = useMealAssetSavedStore();
import { useMealAssetGroupStore } from "../../stores/useMealAssetGroupStore";
const mealAssetGroupStore = useMealAssetGroupStore();
import { useMealTableStore } from "../../stores/useMealTableStore";
const mealTableStore = useMealTableStore();

import simpleMealItem from "./simpleMealItem.vue";
import { X } from "@lucide/vue";
import inputHorizontal from "../form/inputHorizontal.vue";
import switcherHorizontal from "../form/switcherHorizontal.vue";

import { mealNameInput, weightMiniInput, caloriesInput, proteinsInput, fatsInput, carbsInput, recalcSwitcher } from "../../appSettings/defaultExport";
const a = [weightMiniInput, caloriesInput, proteinsInput, fatsInput, carbsInput];
recalcSwitcher.st.padding = "0.5rem 1.25rem";
for (let i = 0; i < a.length; i++) {
  a[i].st.padding = "0.75rem 1.25rem";
  a[i].st.fontSize = "s";
}
const m = [caloriesInput, proteinsInput, fatsInput, carbsInput];
for (let i = 0; i < m.length; i++) {
  m[i].rule.number!.minValue = 0;
  m[i].rule.number!.maxValue = 3000;
}

import { today } from "../../appSettings/defaultExport";
const recalc = ref("full");

// Unsaved форма
const unsavedMeal = ref<tMealAssetUnsaved>({
  name: '',
  weight: undefined,
  calories: undefined,
  proteins: undefined,
  carbs: undefined,
  fats: undefined,
});

const basketDisplay = ref<(tMealAssetSaved | tMealAssetUnsaved | tMealAssetGroup)[]>([]);
const basketSupabase = ref<tMealTableItem>({
  date: today,
  saved: [],
  unsaved: [],
  groups: [],
});

const handleSavedPush = (id: any) => {
  basketSupabase.value.saved.push(id);
  basketDisplay.value.push(id);
};

const handleGroupPush = (id: any) => {
  basketSupabase.value.groups.push(id);
  basketDisplay.value.push(id);
};

const handleUnsavedPush = () => {
  if (!unsavedMeal.value.name) return;
  let itemToAdd = { ...unsavedMeal.value };
  if (recalc.value === "full") {
    const fields = ['calories', 'proteins', 'fats', 'carbs'] as const;
    const weight = itemToAdd.weight;
    if (weight) {
      for (const field of fields) {
        const value = itemToAdd[field];
        if (value) itemToAdd[field] = Number((value * weight / 100).toFixed(1));
      }
    }
  }
  basketSupabase.value.unsaved.push(itemToAdd);
  basketDisplay.value.push(itemToAdd);
  clearUnsavedInputs();
};

const handleTablePush = () => {
  if (basketSupabase.value.saved.length === 0 && basketSupabase.value.unsaved.length === 0 && basketSupabase.value.groups.length === 0) return;
  mealTableStore.addToMealTable({ id: generateId(), ...basketSupabase.value });
  clearAll();
};

const clearAll = () => {
  basketDisplay.value = [];
  basketSupabase.value = {
    date: today,
    saved: [],
    unsaved: [],
    groups: [],
  };
};

const clearUnsavedInputs = () => {
  unsavedMeal.value = {
    name: '',
    weight: undefined,
    calories: undefined,
    proteins: undefined,
    carbs: undefined,
    fats: undefined,
  };
};

const generateId = () => {
  const now = new Date();
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}${String(now.getMilliseconds()).padStart(3, '0')}`;
};
</script>

<template>
  <div class="wh-100 intake">
    <div class="fl-col no-scroll in-left">
      <p class="tit">{{ t("intake") }}</p>
      <div class="fl-col solid-wrap lefty">
        <p class="center placeholder">{{ t("dragHere") }}</p>
        <simpleMealItem v-for="item in basketDisplay" :key="item.name" :mealIdOrUnsaved="item" />
        <div class="buttons">
          <p class="solid-wrap center send" @click="handleTablePush">{{ t("send") }}</p>
          <p class="solid-wrap round" @click="clearAll">
            <component :is="X" />
          </p>
        </div>
      </div>
      <p class="tit">{{ t("unsaved") }}</p>
      <div class="fl-col solid-wrap lefty">
        <inputHorizontal v-bind="mealNameInput" v-model="unsavedMeal.name" />
        <inputHorizontal v-bind="weightMiniInput" v-model="unsavedMeal.weight" />
        <div class="grid">
          <inputHorizontal v-bind="caloriesInput" v-model="unsavedMeal.calories" />
          <inputHorizontal v-bind="proteinsInput" v-model="unsavedMeal.proteins" />
          <inputHorizontal v-bind="fatsInput" v-model="unsavedMeal.fats" />
          <inputHorizontal v-bind="carbsInput" v-model="unsavedMeal.carbs" />
        </div>
        <switcherHorizontal v-bind="recalcSwitcher" v-model="recalc" />
        <div class="buttons">
          <p class="solid-wrap center send" @click="handleUnsavedPush">{{ t("send") }}</p>
          <p class="solid-wrap round" @click="clearUnsavedInputs">
            <component :is="X" />
          </p>
        </div>
      </div>
    </div>
    
    <div class="fl-col in-right">
      <div class="fl-col in-const">
        <p class="tit">{{ t("single") }}</p>
        <div class="l-const">
          <simpleMealItem v-for="item in mealAssetSavedStore.saved" :key="item.id":mealIdOrUnsaved="item.id!" @click="handleSavedPush(item.id)" />
        </div>
      </div>
      <div class="fl-col in-const">
        <p class="tit">{{ t("group") }}</p>
        <div class="l-const">
          <simpleMealItem v-for="item in mealAssetGroupStore.groups" :key="item.id":mealIdOrUnsaved="item.id!" @click="handleGroupPush(item.id)" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.intake {
  gap: 1rem;
  .in-left {
    width: calc((1 / 3 * 100%) + (1 / 3 * 1rem) - 1rem);
    height: 100%;
    gap: 1rem;
    position: sticky;
    top: 0;
    .lefty {
      padding: 0.5rem !important;
      border-radius: 2.25rem !important;
    }
    .solid-wrap {
      width: 100%;
      padding: 1rem;
      gap: 1rem;
      .placeholder {
        width: 100%;
        padding: 0.75rem 0;
        border: dashed 2px var(--main-color);
        border-radius: 2rem;
        opacity: 0.5;
      }
      .grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(2, 1fr);
      }
      .buttons {
        width: 100%;
        gap: 1rem;
        .send,
        .round {
          cursor: pointer;
        }
        .send {
          flex: 1;
          font-size: var(--size-s);
        }
        .round {
          width: unset;
        }
      }
    }
  }
  .in-right {
    flex: 1;
    gap: 1rem;
    .in-const {
      width: 100%;
      gap: 1rem;
      .tit {
        width: 100%;
        justify-content: end;
      }
      .l-const {
        width: 100%;
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(2, 1fr);
        * {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
