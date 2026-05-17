<script setup lang="ts">
import { ref, watch } from "vue";

import { useAuthStore } from "../../stores/useAuthStore";
const authStore = useAuthStore();
import { useCommonStore } from "../../stores/useCommonStore";
const commonStore = useCommonStore();

import vInputString from "../../components/form/vInputString.vue";
import { username, email, password } from "../../appSettings/export/form/vInputString";
import vInputNumber from "../../components/form/vInputNumber.vue";
import { bodyWeight, bodyFat, height, age, calories, proteins, fats, carbs } from "../../appSettings/export/form/vInputNumber";
import vSwitcherDuo from "../../components/form/vSwitcherDuo.vue";
import { gender, theme } from "../../appSettings/export/form/vSwitcherDuo";
import vSelect from "../../components/form/vSelect.vue";
import { language, fontSize, activity } from "../../appSettings/export/form/vSelect";

import { vSignTable, vBodyTable, vCommonTable } from "../../appSettings/export/vars/store";

import router from "../../appSettings/router";
import navigation from "../../components/navigation/signup.vue";
const pageIndex = ref<number>(0);

// email copy to common
watch(
  () => vSignTable.value.email,
  (newEmail) => {
    if (newEmail) vCommonTable.value.email = newEmail;
  },
  { deep: true },
);
// caonfig update
watch(
  () => vCommonTable.value,
  (newConfig) => {
    if (newConfig) commonStore.setStore(newConfig);
  },
  { deep: true, immediate: true },
);
// macros auto calculation
import { calculateMacros } from "../../appSettings/export/vars/default";
watch([() => vBodyTable.value.age, () => vBodyTable.value.height, () => vBodyTable.value.activity, () => vBodyTable.value.gender, () => vBodyTable.value.weightNow, () => vBodyTable.value.bodyFatNow, () => vBodyTable.value.weightGoal, () => vBodyTable.value.bodyFatGoal], ([newAge, newHeight, newActivity, newGender, newWeightNow, newBodyFatNow, newWeightGoal, newBodyFatGoal]) => {
  if (!newAge || !newHeight || !newActivity || !newGender || !newWeightNow || !newBodyFatNow || !newWeightGoal || !newBodyFatGoal) return;
  const newMacros = calculateMacros(newAge, newHeight, newActivity, newGender, newWeightNow, newBodyFatNow, newWeightGoal, newBodyFatGoal);
  vBodyTable.value.calories = newMacros.calories;
  vBodyTable.value.proteins = newMacros.proteins;
  vBodyTable.value.fats = newMacros.fats;
  vBodyTable.value.carbs = newMacros.carbs;
}, { deep: true });

const handleSignup = async () => {
  const result = authStore.signUp(vSignTable.value, vCommonTable.value, vBodyTable.value);
  if ((await result).success) router.push("/home");
};

import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>

<template>
  <navigation v-model="pageIndex" @signup="handleSignup" />
  <div class="w-100 h-100 flex-c max-w-640 pos-r gap-100">
    <TransitionGroup name="fade" tag="form" class="w-100 h-100 pos-r">
      <!-- language -->
      <div class="pos-a w-100 h-100 header-padding ali-c" :key="0" v-show="pageIndex === 0">
        <vSelect :construct="language" v-model="vCommonTable.language" />
      </div>
      <!-- config -->
      <div class="pos-a w-100 h-100 header-padding flex-c jus-c gap-100" :key="1" v-show="pageIndex === 1">
        <vSwitcherDuo :construct="theme" v-model="vCommonTable.theme" />
        <vSelect :construct="fontSize" v-model="vCommonTable.fontSize" />
      </div>
      <!-- body -->
      <div class="pos-a w-100 h-100 header-padding flex-c jus-c gap-100" :key="2" v-show="pageIndex === 2">
        <p class="text-m">{{ t("enterCurrent") }}</p>
        <vSwitcherDuo :construct="gender" v-model="vBodyTable.gender" />
        <p class="text-m">{{ t("averageBodyFat") }}</p>
        <a class="text-s" href="https://kubexfitness.com/blog/body-fat-percentages-actually-look-like/">https://kubexfitness.com</a>
        <div class="grid grid-2 gap-100">
          <vInputNumber :construct="bodyWeight" v-model="vBodyTable.weightNow" />
          <vInputNumber :construct="bodyFat" v-model="vBodyTable.bodyFatNow" />
          <vInputNumber :construct="age" v-model="vBodyTable.age" />
          <vInputNumber :construct="height" v-model="vBodyTable.height" />
        </div>
      </div>
      <!-- goal -->
      <div class="pos-a w-100 h-100 header-padding flex-c jus-c gap-100" :key="3" v-show="pageIndex === 3">
        <p class="text-m">{{ t("averageBodyFat") }}</p>
        <a class="text-s" href="https://kubexfitness.com/blog/body-fat-percentages-actually-look-like/">https://kubexfitness.com</a>
        <div class="grid grid-2 gap-100">
          <vInputNumber :construct="bodyWeight" v-model="vBodyTable.weightGoal" />
          <vInputNumber :construct="bodyFat" v-model="vBodyTable.bodyFatGoal" />
        </div>
        <vSelect :construct="activity" v-model="vBodyTable.activity" />
      </div>
      <!-- macro -->
      <div class="pos-a w-100 h-100 header-padding flex-c jus-c gap-100" :key="4" v-show="pageIndex === 4">
        <p class="text-m">{{ t('weAreNot') }}</p>
        <div class="grid grid-2 gap-100">
          <vInputNumber :construct="calories" v-model="vBodyTable.calories" />
          <vInputNumber :construct="proteins" v-model="vBodyTable.proteins" />
          <vInputNumber :construct="fats" v-model="vBodyTable.fats" />
          <vInputNumber :construct="carbs" v-model="vBodyTable.carbs" />
        </div>
      </div>
      <!-- signup -->
      <div class="pos-a w-100 h-100 header-padding flex-c jus-c gap-100" :key="5" v-show="pageIndex === 5">
        <vInputString :construct="username" v-model="vCommonTable.username" />
        <vInputString :construct="email" v-model="vSignTable.email" />
        <vInputString :construct="password" v-model="vSignTable.password" />
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped lang="scss">
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
