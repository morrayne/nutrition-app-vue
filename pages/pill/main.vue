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
import vSwitcherDuo from "../../components/form/vSwitcherDuo.vue";
import { meds } from "../../appSettings/export/form/vSwitcherDuo";

const mode = ref("view");
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
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastDate = new Date(item.lastDate!);
  lastDate.setHours(0, 0, 0, 0);
  const nextDate = new Date(lastDate);
  nextDate.setDate(lastDate.getDate() + item.period!);
  if (nextDate.getTime() === today.getTime()) {
    return 'today';
  } else if (nextDate.getTime() < today.getTime()) {
    return 'overdue';
  } 
  // else {
  //   const daysLeft = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  //   return `Следующий приём через ${daysLeft} дней`;
  // }
};
</script>

<template>
  <loadingWrap v-if="loading" />
  <div class="w-100 h-100 max-w-1080 pos-r flex-c g-05">
    <vSwitcherDuo v-model="mode" :construct="meds" />
    <div class="w-100 flex-c g-05" v-if="mode !== 'edit'">
      <p class="def-wrap" v-for="item in medicineStore.medicines" :class="getStatus(item)">{{ item.name }}</p>
    </div>
    <div class="w-100 flex-c g-05" v-if="mode === 'edit'">
      <vInputString :construct="medsName" v-model="med.name" />
      <vInputNumber :construct="scv" v-model="med.period" />
      <div class="w-100 g-05 a-c double">
        <p class="w-100 j-c finish def-wrap" @click="handleSend">{{ t("finish") }}</p>
        <div class="h-100 def-wrap a-c j-c round" @click="clearForm"><X color="var(--sub-color)" /></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.double {
  .def-wrap {
    padding: 1rem;
  }
  .finish {
    padding: 0.9rem 1rem;
  }
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
</style>
