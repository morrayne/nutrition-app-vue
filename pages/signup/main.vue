<script setup lang="ts">
import { ref, watch } from "vue";

import { useAuthStore } from "../../stores/useAuthStore";
const authStore = useAuthStore();
import { useCommonStore } from "../../stores/useCommonStore";
const commonStore = useCommonStore();

import vInput from "../../components/form/vInput.vue";
import vSelect from "../../components/form/vSelect.vue";
import vSwitch from "../../components/form/vSwitch.vue";

import { bodyWeight, bodyFat, height, age, calories, proteins, fats, carbs, username, email, password } from "../../appSettings/export/vInput";
import { language, fontSize, activity } from "../../appSettings/export/vSelect";
import { gender, theme } from "../../appSettings/export/vSwitch";
import { vSignTable, vBodyTable, vCommonTable } from "../../appSettings/export/store";

import router from "../../appSettings/router";
import navigation from "../../components/navigation/signup.vue";
const pageIndex = ref<number>(0);

// копирование почты для common
watch(() => vSignTable.value.email, (newEmail) => {
  if (newEmail) vCommonTable.value.email = newEmail;
}, { deep: true });
// обновление конфига и языка
watch(() => vCommonTable.value, (newConfig) => {
  console.log('change', newConfig);
  if (newConfig) commonStore.setStore(newConfig);
}, { deep: true, immediate: true });
// авторасчет макросов
const b = vBodyTable.value;
import { calculateMacros } from "../../appSettings/export/default";
watch([() => b.age, () => b.height, () => b.activity, () => b.gender, () => b.weightNow, () => b.bodyFatNow, () => b.weightGoal, () => b.bodyFatGoal], ([newAge, newHeight, newActivity, newGender, newWeightNow, newBodyFatNow, newWeightGoal, newBodyFatGoal]) => {
  if (!newAge || !newHeight || !newActivity || !newGender || !newWeightNow || !newBodyFatNow || !newWeightGoal || !newBodyFatGoal) return;
  const newMacros = calculateMacros(newAge, newHeight, newActivity, newGender, newWeightNow, newBodyFatNow, newWeightGoal, newBodyFatGoal);
  console.log("Рассчитанные макросы:", newMacros);
  vBodyTable.value.calories = newMacros.calories;
  vBodyTable.value.proteins = newMacros.proteins;
  vBodyTable.value.fats = newMacros.fats;
  vBodyTable.value.carbs = newMacros.carbs;
}, { deep: true });

const handleSignup = async () => {
  const result = authStore.signUp(vSignTable.value, vCommonTable.value, vBodyTable.value);
  if ((await result).success) router.push("/home");
};
</script>

<template>
  <navigation v-model="pageIndex" @signup="handleSignup" />
  <div class="w-100 h-100 flex-c max-w-640 pos-r g-1"> 
    <TransitionGroup name="fade" tag="form" class="w-100 h-100 pos-r">
      <!-- language -->
      <div class="pos-a w-100 h-100 a-c" :key="0" v-show="pageIndex === 0">
        <vSelect :construct="language" v-model="vCommonTable.language" />
      </div>
      <!-- config -->
      <div class="pos-a w-100 h-100 flex-c j-c g-1" :key="1" v-show="pageIndex === 1">
        <vSwitch :construct="theme" v-model="vCommonTable.theme" />
        <vSelect :construct="fontSize" v-model="vCommonTable.fontSize" />
      </div>
      <!-- body -->
      <div class="pos-a w-100 h-100 flex-c g-1 sign-pad" :key="2" v-show="pageIndex === 2">
        <vSwitch :construct="gender" v-model="vBodyTable.gender" />
        <vInput :construct="bodyWeight" v-model="vBodyTable.weightNow" />
        <vInput :construct="bodyFat" v-model="vBodyTable.bodyFatNow" />
        <vInput :construct="age" v-model="vBodyTable.age" />
        <vInput :construct="height" v-model="vBodyTable.height" />
      </div>
      <!-- goal -->
      <div class="pos-a w-100 h-100 flex-c g-1 sign-pad" :key="3" v-show="pageIndex === 3">
        <vInput :construct="bodyWeight" v-model="vBodyTable.weightGoal" />
        <vInput :construct="bodyFat" v-model="vBodyTable.bodyFatGoal" />
        <vSelect :construct="activity" v-model="vBodyTable.activity" />
      </div>
      <!-- macro -->
      <div class="pos-a w-100 h-100 flex-c g-1 sign-pad" :key="4" v-show="pageIndex === 4">
        <vInput :construct="calories" v-model="vBodyTable.calories" />
        <vInput :construct="proteins" v-model="vBodyTable.proteins" />
        <vInput :construct="fats" v-model="vBodyTable.fats" />
        <vInput :construct="carbs" v-model="vBodyTable.carbs" />
      </div>
      <!-- signup -->
      <div class="pos-a w-100 h-100 flex-c j-c g-1" :key="5" v-show="pageIndex === 5">
        <vInput :construct="username" v-model="vCommonTable.username" />
        <vInput :construct="email" v-model="vSignTable.email" />
        <vInput :construct="password" v-model="vSignTable.password" />
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
