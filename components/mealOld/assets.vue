<script setup lang="ts">
import { ref } from "vue";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { useMealAssetSavedStore } from "../../stores/useMealAssetSavedStore";
import { useMealAssetGroupStore } from "../../stores/useMealAssetGroupStore";
const mealAssetSaved = useMealAssetSavedStore();
const mealAssetGroup = useMealAssetGroupStore();

import inputHorizontal from "../form/inputHorizontal.vue";
import { mealNameInput, getWeight, getCalories, getProteins, getFats, getCarbs } from "../../appSettings/defaultExport";

const getDataById = (id: any, what: "name" | "weight") => {
  const savedItem = mealAssetSaved.saved.find((item: any) => item.id === id);
  if (savedItem?.[what]) return savedItem[what];
  return {};
};

import { tMealAssetGroup } from "../../appSettings/types";
const newAsset = ref<tMealAssetGroup>({
  name: "",
  list: [],
});
const handleSend = () => {
  const now = new Date();
  const id = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
  mealAssetGroup.addGroup({ id, ...newAsset.value });
}
</script>

<template>
  <div class="wh-100 assets">
    <div class="solid-wrap fl-col new-asset">
      <p v-if="newAsset.list?.length === 0" class="placeholder center">{{ t("dragHere") }}</p>
      <inputHorizontal v-if="newAsset.list?.length !== 0" v-bind="mealNameInput" v-model="newAsset.name" />
      <div class="fl-col lllist" v-if="newAsset.list?.length !== 0">
        <div class="row" v-for="v in newAsset.list">
          <p>{{ getDataById(v, "name") }}</p>
          <p>{{ getDataById(v, "weight") + " " + t("g") }}</p>
        </div>
      </div>
      <button class="solid-wrap center sendit" v-if="newAsset.list?.length !== 0" @click="handleSend">
        {{ t("send") }}
      </button>
    </div>
    <div class="as-l">
      <p class="h2">{{ t("saved") }}</p>
      <div class="fl-col solid-wrap as-i" v-for="value in mealAssetSaved.saved" @click="newAsset.list?.push(value.id)">
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
    <div class="as-r">
      <p class="h2">{{ t("groups") }}</p>
      <div class="fl-col solid-wrap as-i" v-for="gr in mealAssetGroup.groups">
        <div class="t">
          <p>{{ gr.name }}</p>
          <p>{{ getWeight(gr) + " " + t("g") }}</p>
        </div>
        <div class="bb" v-for="value in gr.list">
          <p>{{ getDataById(value, "name") }}</p>
          <p>{{ getDataById(value, "weight") + t("g") }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.assets {
  gap: 1rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  .placeholder {
    width: 100%;
    padding: 1rem 0;
    border-radius: 2rem;
    border: dashed 1px var(--ex-color);
    font-weight: 400;
  }
  .new-asset {
    width: 100%;
    padding: 1rem;
    gap: 1rem;
    border-radius: 2.5rem;
    .lllist {
      width: 100%;
      gap: 0.5rem;
      .row {
        width: 100%;
        justify-content: space-between;
        p {
          font-weight: 400;
          font-size: var(--size-s);
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
  .as-l,
  .as-r {
    width: 100%;
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(1, 1fr);
    .as-i {
      width: 100%;
      border-radius: 1.5rem;
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
      .bb {
        width: 100%;
        justify-content: space-between;
        p {
          color: var(--ex-color);
          font-size: var(--size-xs);
        }
      }
    }
  }
  //   .as-l {}
  //   .as-r {}
}
</style>
