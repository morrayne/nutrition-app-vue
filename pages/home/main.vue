<script setup lang="ts">
import { computed, ref } from "vue";

import { X } from "@lucide/vue";
import macroWidget from "../meal/ui/macroWidget.vue";
import datePicker from "../meal/ui/datePicker.vue";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { useWeightLogStore } from "../../stores/useWeightLogStore";
const weightLogStore = useWeightLogStore();
import { useBodyStore } from "../../stores/useBodyStore";
const bodyStore = useBodyStore();
import { useWorkoutStore } from "../../stores/useWorkoutStore";
const workoutStore = useWorkoutStore();
import { useMedicineStore } from "../../stores/useMedicineStore";
const medicineStore = useMedicineStore();

import { getDateLikeId, today } from "../../appSettings/export/vars/default";
const activeDate = ref(today);
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

import historyItem from "../sport/wraps/historyItem.vue";

// мне нужно получить все записи за день activeDate
const todayWork = computed(() => {
  return workoutStore.workouts.filter((w) => w.date === activeDate.value);
});

// 
import type { tMed } from "../../appSettings/export/types/meds";
const getStatus = (item: tMed) => {
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const lastDate = new Date(item.lastDate!);
  lastDate.setHours(0, 0, 0, 0);
  const nextDate = new Date(lastDate);
  nextDate.setDate(lastDate.getDate() + item.period!);
  if (lastDate.getTime() === todayDate.getTime()) return "taken";
  if (nextDate.getTime() === todayDate.getTime()) return "need";
  if (nextDate.getTime() < todayDate.getTime()) return "overdue";
  return "normal";
};
const getDateUntil = (lastDate: string, period: number) => {
  const date = new Date(lastDate);
  date.setDate(date.getDate() + period);
  return date.toISOString().split("T")[0];
};
const takePill = (item: tMed) => {
  loading.value = true;
  setTimeout(async () => {
    medicineStore.updateItem({ ...item, lastDate: today });
    medicineStore.getStore();
    loading.value = false;
  }, 250);
};
</script>

<template>
  <loadingWrap v-if="loading" />
  <div class="w-100 h-100 max-w-1440 header-padding flex-c over-y pos-r gap-50">
    <p class="text-xl">{{ t("macros") + " " + "&" + " " + t("sport") }}</p>
    <div class="grid grid-3 gap-50">
      <macroWidget :date="activeDate!" class="grid-item" />
      <div class="main flex-c gap-50 over-y grid-item">
        <historyItem v-if="todayWork[0]" v-for="item in todayWork[0].list" :construct="item" />
        <p class="main text-l" v-else>{{ t('nothingHereYet') }}</p>
      </div>
      <div class="main flex-c gap-50 over-y grid-item">
        <div v-if="medicineStore.medicines" class="item jus-sb ali-c bounce-m main" v-for="item in medicineStore.medicines" :class="getStatus(item)" style="cursor: pointer" @click="takePill(item)">
          <p>{{ item.name }}</p>
          <p class="text-s">{{ getDateUntil(item.lastDate!, item.period!) }}</p>
        </div>
        <p class="main text-l" v-else>{{ t('nothingHereYet') }}</p>
      </div>
    </div>
    <datePicker v-model="activeDate!" />
    <p class="text-xl">{{ t("weight") + " " + "&" + " " + t("bodyFat") }}</p>
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
  </div>
</template>

<style scoped lang="scss">
.grid-item {
  height: 21rem;
}
.taken {
  border: solid 1px var(--gr);
}
.need {
  border: solid 1px var(--focus);
}
.overdue {
  border: solid 1px var(--re);
}
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

@media (max-width: 1280px) {
  .grid-item {
    height: 19rem;
  }
}
@media (max-width: 640px) {
  .grid-item {
    height: 17rem;
  }
}
</style>
