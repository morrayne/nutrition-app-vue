<script setup lang="ts">
import { ref, watch } from "vue";

import { supabase } from "../../appSettings/supabase";

const getImageUrl = () => {
  let iconIndex: string | number = commonStore.common.icon;
  if (Number(iconIndex) < 10) iconIndex = String("0" + iconIndex);
  iconIndex = iconIndex + ".jpg";
  const { data } = supabase.storage.from("icons").getPublicUrl(iconIndex);
  return data.publicUrl;
};

const loading = ref<boolean>(false);
import loadingWrap from "../../components/wraps/loading.vue";
const handleSignout = () => {
  loading.value = true;
  setTimeout(async () => {
    authStore.signOut();
  }, 250);
};

import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { useAuthStore } from "../../stores/useAuthStore";
const authStore = useAuthStore();
import { useCommonStore } from "../../stores/useCommonStore";
const commonStore = useCommonStore();
import { useBodyStore } from "../../stores/useBodyStore";
const bodyStore = useBodyStore();

import vInputNumber from "../../components/form/vInputNumber.vue";
import { height, age, calories, proteins, fats, carbs, bodyWeight, bodyFat } from "../../appSettings/export/form/vInputNumber";
import VSwitcherDuo from "../../components/form/vSwitcherDuo.vue";
import { gender } from "../../appSettings/export/form/vSwitcherDuo";
import vSelect from "../../components/form/vSelect.vue";
import { activity } from "../../appSettings/export/form/vSelect";

import type { tBodyTable, tCommonTable } from "../../appSettings/export/types/store";
const vCommonTable = ref<tCommonTable>({
  username: commonStore.common.username,
  email: commonStore.common.email,
  icon: commonStore.common.icon,
  language: commonStore.common.language,
  theme: commonStore.common.theme,
  fontSize: commonStore.common.fontSize,
  focusColor: commonStore.common.focusColor,
});

import { theme } from "../../appSettings/export/form/vSwitcherDuo";
import { fontSize, language } from "../../appSettings/export/form/vSelect";

// prettier-ignore
watch(vCommonTable, (newVal) => {
  const newConfig = commonStore.common;
  newConfig.focusColor = newVal.focusColor;
  newConfig.fontSize = newVal.fontSize;
  newConfig.language = newVal.language;
  newConfig.theme = newVal.theme;
  commonStore.setStore(newConfig);
  commonStore.updateStore();
}, { deep: true });

import { vBodyTable } from "../../appSettings/export/vars/store";
const newBody = ref<tBodyTable>({
  ...vBodyTable.value,
  age: bodyStore.body.age,
  height: bodyStore.body.height,
  gender: bodyStore.body.gender,
  activity: bodyStore.body.activity,
  calories: bodyStore.body.calories,
  proteins: bodyStore.body.proteins,
  fats: bodyStore.body.fats,
  carbs: bodyStore.body.carbs,
  weightNow: bodyStore.body.weightNow,
  weightGoal: bodyStore.body.weightGoal,
  bodyFatNow: bodyStore.body.bodyFatNow,
  bodyFatGoal: bodyStore.body.bodyFatGoal,
});

const updateBody = () => {
  const b = newBody.value;
  if (!b.age || !b.weightGoal || !b.bodyFatGoal) return;
  if (!b.calories || !b.proteins || !b.fats || !b.carbs) return;
  loading.value = true;
  setTimeout(async () => {
    try {
      bodyStore.setStore({ ...newBody.value });
      await bodyStore.updateStore();
    } catch (error) {
      console.error("Error updating body:", error);
    } finally {
      loading.value = false;
    }
  }, 250);
};

import { calculateMacros } from "../../appSettings/export/vars/default";
watch(
  [() => newBody.value.age, () => newBody.value.height, () => newBody.value.activity, () => newBody.value.gender, () => newBody.value.weightNow, () => newBody.value.bodyFatNow, () => newBody.value.weightGoal, () => newBody.value.bodyFatGoal],
  ([newAge, newHeight, newActivity, newGender, newWeightNow, newBodyFatNow, newWeightGoal, newBodyFatGoal]) => {
    if (!newAge || !newHeight || !newActivity || !newGender || !newWeightNow || !newBodyFatNow || !newWeightGoal || !newBodyFatGoal) return;
    const newMacros = calculateMacros(newAge, newHeight, newActivity, newGender, newWeightNow, newBodyFatNow, newWeightGoal, newBodyFatGoal);
    newBody.value.calories = newMacros.calories;
    newBody.value.proteins = newMacros.proteins;
    newBody.value.fats = newMacros.fats;
    newBody.value.carbs = newMacros.carbs;
  },
  { deep: true },
);
</script>

<template>
  <loadingWrap v-if="loading" />
  <div class="w-100 h-100 max-w-640 pos-r over-y flex-c gap-100 header-padding">
    <div class="w-100 flex-c gap-50">
      <p class="text-xl">{{ t("account") }}</p>
      <div class="w-100 main gap-100 pos-r mini">
        <div class="h-100 pos-a left-0 top-0 pad-75 left">
          <img :src="getImageUrl()" alt="" />
        </div>
        <div class="h-100 flex-c jus-sb bot">
          <p class="text-m t">{{ commonStore.common.email }}</p>
          <p class="text-s b">{{ commonStore.common.username }}</p>
        </div>
      </div>
      <p class="text-xl">{{ t("settings") }}</p>
      <vSwitcherDuo :construct="theme" v-model="vCommonTable.theme" />
      <vSelect :construct="fontSize" v-model="vCommonTable.fontSize" />
      <vSelect :construct="language" v-model="vCommonTable.language" />
      <p class="h-100 main jus-c ali-c signout" @click="handleSignout">{{ t("signout") }}</p>
    </div>
    <div class="w-100 flex-c gap-50">
      <p class="text-xl">{{ t("changeBody") }}</p>
      <div class="grid grid-2 gap-50">
        <vInputNumber :construct="age" v-model="newBody.age" />
        <vInputNumber :construct="height" v-model="newBody.height" />
      </div>
      <vSwitcherDuo :construct="gender" v-model="newBody.gender" />
      <vSelect :construct="activity" v-model="newBody.activity" />
      <p class="text-xl">{{ t("goals") }}</p>
      <div class="grid grid-2 gap-50">
        <vInputNumber :construct="bodyWeight" v-model="newBody.weightGoal" />
        <vInputNumber :construct="bodyFat" v-model="newBody.bodyFatGoal" />
        <vInputNumber :construct="calories" v-model="newBody.calories" />
        <vInputNumber :construct="proteins" v-model="newBody.proteins" />
        <vInputNumber :construct="fats" v-model="newBody.fats" />
        <vInputNumber :construct="carbs" v-model="newBody.carbs" />
      </div>
      <p class="main jus-c updatebody" @click="updateBody">{{ t("updateBody") }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mini {
  max-height: 5.5rem;
  padding: 0.5rem;
  border-radius: 2.25rem;
  .left {
    aspect-ratio: 1 / 1;
    overflow: hidden;
    img {
      width: 100%;
      border-radius: 50%;
    }
  }
  .bot {
    padding-left: 5rem;
    .b {
      color: var(--ex-color);
    }
  }
}
.signout {
  color: var(--white);
  background: var(--re);
  border: solid 1px var(--re);
  border-radius: 2.25rem;
  cursor: pointer;
}
.updatebody {
  color: var(--white);
  background: var(--focus);
  border: solid 1px var(--focus);
  cursor: pointer;
}

@media (max-width: 1280px) {
  .bot {
    padding-left: 3.5rem !important;
  }
}
@media (max-width: 640px) {
  .bot {
    padding-left: 3rem !important;
  }
}
</style>
