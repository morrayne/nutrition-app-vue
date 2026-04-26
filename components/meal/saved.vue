<script setup lang="ts">
import { ref } from "vue";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

import type { tMealAssetSaved, tMealAssetUnsaved, tMealAssetGroup, tMealTableItem } from "../../appSettings/types";

import simpleMealItem from "./simpleMealItem.vue";
import inputHorizontal from "../form/inputHorizontal.vue";
import switcherHorizontal from "../form/switcherHorizontal.vue";
import selectHorizontal from "../form/selectHorizontal.vue";

import { useMealAssetSavedStore } from "../../stores/useMealAssetSavedStore";
const mealAssetSavedStore = useMealAssetSavedStore();
import { useMealAssetGroupStore } from "../../stores/useMealAssetGroupStore";
const mealAssetGroupStore = useMealAssetGroupStore();

import { mealNameInput, weightMiniInput, caloriesInput, proteinsInput, fatsInput, carbsInput, recalcSwitcher, mealAsset } from "../../appSettings/defaultExport";
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

const recalc = ref("full");
const mode = ref("single");
const group = ref<tMealAssetGroup>({
  id: '',
  name: '',
  list: [],
});

import { X } from "@lucide/vue";

const handleSavedPush = (id: any) => {
  group.value.list!.push(id);
}
</script>

<template>
  <div class="wh-100 intake">
    <div class="fl-col no-scroll in-left">
      <selectHorizontal v-bind="mealAsset" v-model="mode" />
      <div class="fl-col solid-wrap" v-if="mode === 'group'">
        <p class="center placeholder">{{ t("dragHere") }}</p>
        <inputHorizontal v-bind="mealNameInput" v-model="group.name" />
        <simpleMealItem v-for="item in group.list" :mealIdOrUnsaved="item" />
        <div class="buttons">
          <p class="solid-wrap center send">{{ t("send") }}</p>
          <p class="solid-wrap round">
            <component :is="X" />
          </p>
        </div>
      </div>
      <div class="fl-col solid-wrap" v-if="mode === 'single'">
        <inputHorizontal v-bind="mealNameInput" />
        <inputHorizontal v-bind="weightMiniInput" />
        <div class="grid">
          <inputHorizontal v-bind="caloriesInput" />
          <inputHorizontal v-bind="proteinsInput" />
          <inputHorizontal v-bind="fatsInput" />
          <inputHorizontal v-bind="carbsInput" />
        </div>
        <switcherHorizontal v-bind="recalcSwitcher" v-model="recalc" />
        <div class="buttons">
          <p class="solid-wrap center send">{{ t("send") }}</p>
          <p class="solid-wrap round" @click="group.list = []">
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
      }
    }
  }
}
</style>
