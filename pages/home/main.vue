<script setup lang="ts">
import { ref } from "vue";

import { X } from "@lucide/vue";
import macroWidget from "../meal/ui/macroWidget.vue";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { useWeightLogStore } from "../../stores/useWeightLogStore";
const weightLogStore = useWeightLogStore();
import { useBodyStore } from "../../stores/useBodyStore";
const bodyStore = useBodyStore();

import { getDateLikeId, today } from "../../appSettings/export/vars/default";
import vInputNumber from "../../components/form/vInputNumber.vue";

import { bodyWeight, bodyFat } from "../../appSettings/export/form/vInputNumber";
const weightInput = { ...bodyWeight, title: undefined };
const fatInput = { ...bodyFat, title: undefined };

import type { tWeightLog } from "../../appSettings/export/types/store";
const newWeightLog = ref<tWeightLog>({
  id: undefined,
  date: undefined,
  weight: undefined,
  bodyFat: undefined,
});

import { vBodyTable } from "../../appSettings/export/vars/store";
const handleNewBody = async () => {
  if (!newWeightLog.value.weight || !newWeightLog.value.bodyFat) return;
  loading.value = true;
  const newBody = { ...vBodyTable.value, bodyFatNow: newWeightLog.value.bodyFat, weightNow: newWeightLog.value.weight };
  const newWeightLogItem = { ...newWeightLog.value, date: today, id: getDateLikeId() };
  bodyStore.setStore(newBody);
  setTimeout(async () => {
    try {
      await weightLogStore.addEntry(newWeightLogItem);
      await bodyStore.updateStore();
    } catch (error) {
      console.error(error);
    } finally {
      clearNewBody();
      loading.value = false;
    }
  }, 250);
};
const clearNewBody = () => {
  newWeightLog.value = { id: undefined, date: undefined, weight: undefined, bodyFat: undefined };
};

import loadingWrap from "../../components/wraps/loading.vue";
const loading = ref<boolean>(false);

import weightTrend from "./ui/weightTrend.vue";
import bodyFatChart from "./ui/bodyFatChart.vue";
</script>

<template>
  <loadingWrap v-if="loading" />
  <div class="w-100 h-fit max-w-1440 header-padding flex-c pos-r gap-50">
    <div class="grid grid-2">
      <macroWidget :date="today!" />
    </div>
    <p class="text-xl">{{ t('trends') }}</p>
    <div class="w-100 gap-50 grid grid-3">
      <weightTrend />
      <bodyFatChart />
      <div class="w-100 flex-c gap-50 main weight-log">
        <div class="gap-50 top">
          <vInputNumber v-model="newWeightLog.weight" :construct="weightInput" />
          <vInputNumber v-model="newWeightLog.bodyFat" :construct="fatInput" />
        </div>
        <div class="gap-50 w-100 ali-c bot">
          <p class="w-100 main jus-c send" @click="handleNewBody">{{ t("addnew") }}</p>
          <div class="main x" @click="clearNewBody"><X color="var(--sub-color)" /></div>
        </div>
      </div>
    </div>
    <p class="text-xl">{{ t('meds') + ' ' + '&' + ' ' + t('sport') }}</p>
  </div>
</template>

<style scoped lang="scss">
.weight-log {
  padding: 0.75rem;
  border-radius: 1.5rem;
  .top {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
  .bot {
    .send,
    .x {
      cursor: pointer;
    }
    .x {
      width: fit-content;
      aspect-ratio: 1 / 1;
      padding: 0.75rem;
      border-radius: 4rem;
    }
  }
}
</style>
