<script setup lang="ts">
import { ref } from "vue";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

import type { tMealAssetSaved, tMealAssetUnsaved, tMealAssetGroup, tMealTableItem } from "../../appSettings/types";
import { X } from "@lucide/vue";

import simpleMealItem from "./simpleMealItem.vue";
import inputHorizontal from "../form/inputHorizontal.vue";
import switcherHorizontal from "../form/switcherHorizontal.vue";
import selectHorizontal from "../form/selectHorizontal.vue";

import { useMealAssetSavedStore } from "../../stores/useMealAssetSavedStore";
const mealAssetSavedStore = useMealAssetSavedStore();
import { useMealAssetGroupStore } from "../../stores/useMealAssetGroupStore";
const mealAssetGroupStore = useMealAssetGroupStore();

import { mealNameInput, weightMiniInput, caloriesInput, proteinsInput, fatsInput, carbsInput, recalcSwitcher, mealAsset } from "../../appSettings/defaultExport";
const a = [mealNameInput, weightMiniInput, caloriesInput, proteinsInput, fatsInput, carbsInput, recalcSwitcher];
recalcSwitcher.st.padding = "0.5rem 1.25rem";
for (let i = 0; i < a.length; i++) {
  a[i]!.st.padding = "0.75rem 1.25rem";
  a[i]!.st.fontSize = "s";
}
const m = [caloriesInput, proteinsInput, fatsInput, carbsInput];
for (let i = 0; i < m.length; i++) {
  m[i]!.rule.number!.minValue = 0;
  m[i]!.rule.number!.maxValue = 3000;
}

const recalc = ref("full");
const mode = ref("single");
const savedEmpty = <tMealAssetSaved>({
  name: '',
  weight: undefined,
  calories: undefined,
  proteins: undefined,
  fats: undefined,
  carbs: undefined
});
const saved = ref<tMealAssetSaved>(savedEmpty);
const handleSingleClick = async () => {
  console.log(recalc.value);
  if (!saved.value.name) return;
  let itemToSave = { id: generateId(), ...saved.value };
  if (recalc.value !== "full") {
    const fields = ['calories', 'proteins', 'fats', 'carbs'] as const;
    for (const field of fields) {
      const value = itemToSave[field];
      if (value && itemToSave.weight) itemToSave[field] = Number((value * itemToSave.weight / 100).toFixed(1));
    }
  }
  await mealAssetSavedStore.addItem(itemToSave);
}
const groupEmpty = <tMealAssetGroup>{
  name: '',
  list: [],
};
const group = ref<tMealAssetGroup>(groupEmpty);
const handleSavedPush = (id: any) => {
  group.value.list!.push(id);
}
const handleGroupClick = () => {
  if (!group.value.name) return
  mealAssetGroupStore.addGroup({ id: generateId(), ...group.value });
  group.value.name = '';
  group.value.list = [];
  setTimeout(() => {
    clearGroupForm();
  }, 2000);
}
const generateId = () => {
  const now = new Date();
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}${String(now.getMilliseconds()).padStart(3, '0')}`;
};
const clearSingleForm = () => {
  saved.value = { ...savedEmpty };
}
const clearGroupForm = () => {
  group.value = { ...groupEmpty };
  group.value.list = [];
  group.value.name = '';
}
</script>

<template>
  <div class="wh-100 intake">
    <div class="fl-col no-scroll in-left">
      <selectHorizontal v-bind="mealAsset" v-model="mode" style="margin-top: 0.5rem" />
      <div class="fl-col lefty solid-wrap" v-if="mode === 'single'">
        <inputHorizontal v-bind="mealNameInput" v-model="saved.name" />
        <inputHorizontal v-bind="weightMiniInput" v-model="saved.weight" />
        <div class="grid">
          <inputHorizontal v-bind="caloriesInput" v-model="saved.calories" />
          <inputHorizontal v-bind="proteinsInput" v-model="saved.proteins" />
          <inputHorizontal v-bind="fatsInput" v-model="saved.fats" />
          <inputHorizontal v-bind="carbsInput" v-model="saved.carbs" />
        </div>
        <switcherHorizontal v-bind="recalcSwitcher" v-model="recalc" />
        <div class="buttons">
          <p class="solid-wrap center send" @click="handleSingleClick" >{{ t("send") }}</p>
          <p class="solid-wrap round" @click="clearSingleForm" >
            <component :is="X" />
          </p>
        </div>
      </div>
      <div class="fl-col lefty solid-wrap" v-if="mode === 'group'">
        <p class="center placeholder">{{ t("dragHere") }}</p>
        <inputHorizontal v-bind="mealNameInput" v-model="group.name" />
        <simpleMealItem v-for="item in group.list" :mealIdOrUnsaved="item" />
        <div class="buttons">
          <p class="solid-wrap center send" @click="handleGroupClick">{{ t("send") }}</p>
          <p class="solid-wrap round" @click="clearGroupForm">
            <component :is="X" />
          </p>
        </div>
      </div>
    </div>
    <div class="fl-col in-right">
      <div class="fl-col in-const">
        <p class="tit">{{ t("single") }}</p>
        <div class="l-const">
          <simpleMealItem v-for="item in mealAssetSavedStore.saved" :mealIdOrUnsaved="item.id!" @click="handleSavedPush(item.id)" />
        </div>
      </div>
      <div class="fl-col in-const">
        <p class="tit">{{ t("group") }}</p>
        <div class="l-const">
          <simpleMealItem v-for="item in mealAssetGroupStore.groups" :mealIdOrUnsaved="item.id!" />
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
      gap: 0.5rem !important;
      border-radius: 2rem !important;
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
        gap: 0.5rem;
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
      }
    }
  }
}
</style>
