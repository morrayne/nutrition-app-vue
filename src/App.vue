<script setup lang="ts">
import { watch } from "vue";
import { RouterView } from "vue-router";

import { storeToRefs } from "pinia";
import contentWrap from "../components/wraps/content.vue";

import { useI18n } from "vue-i18n";
const { locale } = useI18n();

import { useCommonStore } from "../stores/useCommonStore";
const commonStore = useCommonStore();
const { common } = storeToRefs(commonStore);

watch(common, (newConfig) => {
  if (newConfig!.language && locale.value !== newConfig.language) locale.value = newConfig.language;
}, { deep: true }); 
</script>

<template>
  <contentWrap>
    <RouterView />
  </contentWrap>
</template>
