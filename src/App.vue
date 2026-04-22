<script setup lang="ts">
import { RouterView } from "vue-router";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useConfigStore } from "../stores/useConfigStore";
import { storeToRefs } from "pinia";
import contentWrap from "../components/wraps/content.vue";

const { locale } = useI18n();

const configStore = useConfigStore();
const { config } = storeToRefs(configStore);

watch(config, (newConfig) => {
  if (newConfig?.language && locale.value !== newConfig.language) locale.value = newConfig.language;
}, { deep: true });

import { DnDProvider } from "@vue-dnd-kit/core";
</script>

<template>
  <DnDProvider>
    <contentWrap>
      <RouterView />
    </contentWrap>
  </DnDProvider>
</template>
