<script setup lang="ts">
import { ref } from "vue";

import { X } from "@lucide/vue";

import type { tMed } from "../../appSettings/export/types/meds";
import { today, getDateLikeId } from "../../appSettings/export/vars/default";

import { useMedicineStore } from "../../stores/useMedicineStore";
const medicineStore = useMedicineStore();

import vInputNumber from "../../components/form/vInputNumber.vue";
import { scv } from "../../appSettings/export/form/vInputNumber";
import vInputString from "../../components/form/vInputString.vue";
import { medsName } from "../../appSettings/export/form/vInputString";

const med = ref<tMed>({
  id: undefined,
  lastDate: undefined,
  period: undefined,
  name: undefined,
});

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const handleSend = () => {
  if (!med.value.period || !med.value.name) return;
  loading.value = true;
  med.value.id = getDateLikeId();
  med.value.lastDate = today;
  setTimeout(async () => {
    medicineStore.addItem(med.value);
    clearForm();
    loading.value = false;
  }, 250);
};
const clearForm = () => {
  med.value = {
    id: undefined,
    lastDate: undefined,
    period: undefined,
    name: undefined,
  };
};

import loadingWrap from "../../components/wraps/loading.vue";
const loading = ref<boolean>(false);

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
  <div class="w-100 h-fit max-w-1440 pos-r grid grid-2 gap-50">
    <div class="w-100 left">
      <div class="w-100 flex-c gap-50">
        <div class="grid grid-2 gap-50">
          <vInputString :construct="medsName" v-model="med.name" />
          <vInputNumber :construct="scv" v-model="med.period" />
        </div>
        <div class="w-100 gap-50 ali-c double">
          <p class="w-100 jus-c pad-100 main" @click="handleSend" style="cursor: pointer">{{ t("finish") }}</p>
          <div class="h-100 main ali-c jus-c round" @click="clearForm" style="cursor: pointer"><X color="var(--sub-color)" /></div>
        </div>
      </div>
    </div>
    <div class="w-100 right">
      <div class="w-100 flex-c gap-50">
        <div class="item jus-sb ali-c bounce-m main" v-for="item in medicineStore.medicines" :class="getStatus(item)" style="cursor: pointer" @click="takePill(item)">
          <p>{{ item.name }}</p>
          <p class="text-s">{{ getDateUntil(item.lastDate!, item.period!) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pill-enter-from,
.pill-leave-to {
  opacity: 0;
}
.pill-enter-to,
.pill-leave-from {
  opacity: 1;
}

.double {
  .round {
    width: fit-content;
    aspect-ratio: 1 / 1;
    padding: 0.75rem;
    border-radius: 4rem;
    svg {
      width: 1.5rem;
      height: 1.5rem;
    }
  }
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
</style>
