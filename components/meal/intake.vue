<script setup lang="ts">
import { ref } from "vue";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { useMealAssetSavedStore } from "../../stores/useMealAssetSavedStore";
import { useMealAssetGroupStore } from "../../stores/useMealAssetGroupStore";
import { useMealTableStore } from "../../stores/useMealTableStore";
import type { tMealAssetUnsaved, tMealTableItem } from "../../appSettings/types";

import inputHorizontal from "../form/inputHorizontal.vue";
import { today, getWeight, getCalories, getProteins, getFats, getCarbs, mealNameInput, weightMiniInput, caloriesInput, proteinsInput, fatsInput, carbsInput } from "../../appSettings/defaultExport";
const m = [caloriesInput, proteinsInput, fatsInput, carbsInput];
for (let i = 0; i < m.length; i++) {
  m[i].rule.number!.minValue = 0;
  m[i].rule.number!.maxValue = 3000;
  m[i].st.fontSize = 's';
}

const mealAssetSaved = useMealAssetSavedStore();
const mealAssetgroup = useMealAssetGroupStore();
const mealTableStore = useMealTableStore();

const basketDisplay = ref<any[]>([]);
const basketSaved = ref<Omit<tMealTableItem, 'id'>>({
  date: today,
  saved: [],
  unsaved: [],
  groups: [],
});

const pushToBasket = (data: any) => {
  if (data.list) {
    basketSaved.value.groups.push(data.id);
    basketDisplay.value.push(data);
  } else if (data.id) {
    basketSaved.value.saved.push(data.id);
    basketDisplay.value.push(data);
  } else {
    basketSaved.value.unsaved.push(data);
    basketDisplay.value.push(data);
  }
};

const customMeal = ref<tMealAssetUnsaved>({
  name: undefined,
  weight: undefined,
  calories: undefined,
  proteins: undefined,
  carbs: undefined,
  fats: undefined,
});

const handleUnsaved = () => {
  if (!customMeal.value.name) return;
  basketDisplay.value.push({ ...customMeal.value });
  basketSaved.value.unsaved.push({ ...customMeal.value });
  customMeal.value = {
    name: undefined,
    weight: undefined,
    calories: undefined,
    proteins: undefined,
    carbs: undefined,
    fats: undefined,
  };
};

const handleSend = async () => {
  console.log('trye send');
  await mealTableStore.addToMealTable(basketSaved.value);
  console.log('clear basket');
  basketDisplay.value = [];
  basketSaved.value = {
    date: today,
    saved: [],
    unsaved: [],
    groups: [],
  };
  await mealTableStore.getStore();
};

const removeFromBasket = (data: any) => {
  const index = basketDisplay.value.findIndex((item: any) => item.id === data.id && item.name === data.name);
  if (index !== -1) basketDisplay.value.splice(index, 1);
  if (data.list) {
    const groupIndex = basketSaved.value.groups.findIndex((id: string) => id === data.id);
    if (groupIndex !== -1) basketSaved.value.groups.splice(groupIndex, 1);
  } else if (data.id) {
    const savedIndex = basketSaved.value.saved.findIndex((id: string) => id === data.id);
    if (savedIndex !== -1) basketSaved.value.saved.splice(savedIndex, 1);
  } else {
    const unsavedIndex = basketSaved.value.unsaved.findIndex((item: any) => 
      item.name === data.name && 
      item.weight === data.weight && 
      item.calories === data.calories
    );
    if (unsavedIndex !== -1) basketSaved.value.unsaved.splice(unsavedIndex, 1);
  }
};
</script>

<template>
  <div class="wh-100 prz-2 meal-intake">
    <div class="fl-col prz-2 solid-wrap l">
      <p class="placeholder center">{{ t("dragHere") }}</p>
      <div class="fl-col prz-2 basket-list" v-if="basketDisplay.length !== 0">
        <div class="basket-item" v-for="value in basketDisplay" @click="removeFromBasket(value)">
          <p>{{ value.name }}</p>
          <p>{{ getCalories(value) + " " + t("calories") }}</p>
        </div>
      </div>
      <div class="fl-col total" v-if="basketDisplay.length !== 0">
        <p class="total-text"> {{ t('total') }} </p>
        <div class="fl-col short-stat">
          <div class="short-item" v-for="a in 5"></div>
        </div>
      </div>
      <button class="solid-wrap center sendit" v-if="basketDisplay.length !== 0" @click="handleSend">
        {{ t('send') }}
      </button>
    </div>
    <div class="fl-col r">
      <div class="fl-col half">
        <p class="h2">{{ t("oneTime") }}</p>
        <div class="llist inputs">
          <inputHorizontal v-bind="mealNameInput" v-model="customMeal.name" />
          <inputHorizontal v-bind="weightMiniInput" v-model="customMeal.weight" />
          <inputHorizontal v-bind="caloriesInput" v-model="customMeal.calories" />
          <inputHorizontal v-bind="proteinsInput" v-model="customMeal.proteins" />
          <inputHorizontal v-bind="fatsInput" v-model="customMeal.fats" />
          <inputHorizontal v-bind="carbsInput" v-model="customMeal.carbs" />
        </div>
        <button class="solid-wrap center submit-unsaved" @click="handleUnsaved"> {{ t('add') }} </button>
      </div>
      <div class="fl-col half">
        <p class="h2">{{ t("saved") }}</p>
        <div class="llist">
          <div class="fl-col solid-wrap iitem" v-for="value in mealAssetSaved.saved" @click="pushToBasket(value)">
            <div class="t">
              <p>{{ value.name }}</p>
              <p>{{ getWeight(value) + " " + t("g") }}</p>
            </div>
            <div class="b">
              <p>{{ t("calories") + " " + getCalories(value) }}</p>
              <p>{{ t("proteins") + " " + getProteins(value) }}</p>
              <p>{{ t("fats") + " " + getFats(value) }}</p>
              <p>{{ t("carbs") + " " + getCarbs(value) }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="fl-col half">
        <p class="h2">{{ t("groups") }}</p>
        <div class="llist">
          <div class="fl-col solid-wrap iitem" v-for="value in mealAssetgroup.groups" @click="pushToBasket(value)">
            <div class="t">
              <p>{{ value.name }}</p>
              <p>{{ getWeight(value) + " " + t("g") }}</p>
            </div>
            <div class="b">
              <p>{{ t("calories") + " " + getCalories(value) }}</p>
              <p>{{ t("proteins") + " " + getProteins(value) }}</p>
              <p>{{ t("fats") + " " + getFats(value) }}</p>
              <p>{{ t("carbs") + " " + getCarbs(value) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.meal-intake {
  gap: 1rem;
  .l {
    width: calc(1 / 3 * 100%);
    gap: 1rem;
    padding: 1rem;
    border-radius: 2.5rem;
    position: sticky;
    top: 0;
    .placeholder {
      width: 100%;
      padding: 1rem 0;
      border-radius: 2rem;
      border: dashed 1px var(--ex-color);
      font-weight: 400;
    }
    .basket-list {
      width: 100%;
      gap: 0.5rem;
      .basket-item {
        width: 100%;
        justify-content: space-between;
        cursor: pointer;
        p {
          font-weight: 400;
          font-size: var(--size-s);
          color: var(--sub-color);
        }
      }
    }
    .total {
      width: 100%;
      gap: 1rem;
      .total-text {
        font-weight: 400;
        font-size: var(--size-s);
      }
      .short-stat {
        width: 100%;
        gap: 1rem;
        .short-item {
          width: 100%;
          height: 1rem;
          background: #000;
        }
      }
    }
    .sendit {
      width: 100%;
      background: var(--focus);
      font-size: var(--size-s);
      border: solid 1px var(--focus);
    }
  }
  .r {
    width: calc(2 / 3 * 100% + 1rem);
    gap: 1.5rem;
    .half {
      width: 100%;
      gap: 1rem;
      .submit-unsaved {
        width: 100%;
        font-size: var(--size-s);
        padding: 1rem 0;
        background: var(--focus);
        border: solid 1px var(--focus);
      }
      .llist {
        width: 100%;
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(2, 1fr);
        .iitem {
          width: 100%;
          border-radius: 1.5rem;
          gap: 0.5rem;
          cursor: pointer;
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
}
</style>
