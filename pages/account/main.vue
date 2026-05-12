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
  if (!b.age || !b.weightGoal || !b.bodyFatGoal) return
  if (!b.calories || !b.proteins || !b.fats || !b.carbs) return
  bodyStore.setStore({...newBody.value});
  bodyStore.updateStore();
}
</script>

<template>
  <loadingWrap v-if="loading" />
  <div class="w-100 max-w-1080 flex-c pos-r overflow-y-auto g-1 header-pad">
    <p class="fs-xl fw-7">{{ t("account") }}</p>
    <div class="w-100 def-wrap g-1 mini">
      <div class="h-100 left">
        <img :src="getImageUrl()" alt="" />
      </div>
      <div class="h-100 flex-c j-b bot">
        <p class="fs-l fw-6 t">{{ commonStore.common.email }}</p>
        <p class="fs-m fw-5 b">{{ commonStore.common.username }}</p>
      </div>
    </div>
    <p class="def-wrap j-c signout" @click="handleSignout">{{ t("signout") }}</p>
    <p class="fs-xl fw-7">{{ t("settings") }}</p>
    <vSwitcherDuo :construct="theme" v-model="vCommonTable.theme" />
    <vSelect :construct="fontSize" v-model="vCommonTable.fontSize" />
    <vSelect :construct="language" v-model="vCommonTable.language" />
    <p class="fs-xl fw-7">{{ t("changeBody") }}</p>
    <vInputNumber :construct="age" v-model="newBody.age" />
    <vSwitcherDuo :construct="gender" v-model="newBody.gender" />
    <vSelect :construct="activity" v-model="newBody.activity" />
    <p class="fs-xl fw-7">{{ t("goals") }}</p>
    <vInputNumber :construct="bodyWeight" v-model="newBody.weightGoal" />
    <vInputNumber :construct="bodyFat" v-model="newBody.bodyFatGoal" />
    <p class="fs-xl fw-7">{{ t("macros") }}</p>
    <vInputNumber :construct="calories" v-model="newBody.calories" />
    <vInputNumber :construct="proteins" v-model="newBody.proteins" />
    <vInputNumber :construct="fats" v-model="newBody.fats" />
    <vInputNumber :construct="carbs" v-model="newBody.carbs" />
    <p class="def-wrap j-c updatebody" @click="updateBody">{{ t("updateBody") }}</p>
  </div>
</template>

<style scoped lang="scss">
.mini {
  padding: 0.5rem;
  border-radius: 2.25rem;
  .left {
    width: 3.5rem;
    height: 3.5rem;
    img {
      width: 100%;
      height: 100%;
      border-radius: 3rem;
    }
  }
  .bot {
    padding: 0.25rem 0;
    .b {
      color: var(--ex-color);
    }
  }
}
.signout {
  color: var(--white);
  background: var(--re);
  border: solid 1px var(--re);
}
.updatebody {
  color: var(--white);
  background: var(--focus);
  border: solid 1px var(--focus);
}
</style>
