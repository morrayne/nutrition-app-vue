<script setup lang="ts">
import localText from "../../ui/localText.vue";
import globe from "@/svg/signup/globe.vue";
import end from "../../ui/end.vue";
import { useConfigStore } from "../../../stores/single/useConfigStore";
const configStore = useConfigStore();
import type { tConfig } from "../../../stores/main/types";
import rowSwitch from "../../form/rowSwitch.vue";
import type { tRowSwitch } from "../../form/rowSwitch.vue";

const props = defineProps<{
  modelValue: tConfig;
}>();
const emits = defineEmits<{
  (e: 'update:modelValue', value: tConfig): void;
}>();

const updateConfig = (key: keyof tConfig, value: any) => {
  const newConfig = { ...props.modelValue, [key]: value };
  emits('update:modelValue', newConfig);
  configStore.changeVisualViaConfig(newConfig);
};

const theme: tRowSwitch = {
  title: "dark-mode",
  data: {
    type: "text",
    start: "off",
    on: "dark",
    off: "light",
  },
};
import colSelect from "../../form/colSelect.vue";
import type { tColSelect, tColSelectOpt } from "../../form/colSelect.vue";
const languageOpt: tColSelectOpt[] = [
  { title: "english", toEmit: "en" },
  { title: "russian", toEmit: "ru" },
  { title: "espaniol", toEmit: "es" },
  { title: "mandarin", toEmit: "zh" },
];
const language: tColSelect = {
  title: "language",
  data: {
    type: "string" as const,
    start: 0,
    options: languageOpt,
  },
};
const newremOpt: tColSelectOpt[] = [
  { title: "very-small", toEmit: 14 },
  { title: "small", toEmit: 15 },
  { title: "medium", toEmit: 16 },
  { title: "big", toEmit: 17 },
  { title: "large", toEmit: 18 },
];
const newrem: tColSelect = {
  title: "font-size",
  desc: "recomended-font",
  data: {
    type: "number" as const,
    start: 2,
    options: newremOpt,
  },
};
const phoneColorOpt: tColSelectOpt[] = [
  { title: "black", toEmit: "black" },
  { title: "white", toEmit: "white" },
  { title: "green", toEmit: "green" },
  { title: "blue", toEmit: "blue" },
  { title: "purple", toEmit: "purple" },
];
const phoneColor: tColSelect = {
  title: "phone-color",
  desc: "pc-only",
  data: {
    type: "string" as const,
    start: 2,
    options: phoneColorOpt,
  },
};
</script>

<template>
  <div class="hw100 config">
    <div class="grand-svg-holder">
      <globe color="bl" :rotate="0" />
    </div>
    <colSelect v-bind="language" :modelValue="modelValue.language" @update:modelValue="updateConfig('language', $event)" />
    <rowSwitch v-bind="theme" :modelValue="modelValue.theme" @update:modelValue="updateConfig('theme', $event)" />
    <colSelect v-bind="newrem" :modelValue="modelValue.newrem" @update:modelValue="updateConfig('newrem', $event)" />
    <colSelect v-bind="phoneColor" :modelValue="modelValue.phoneColor" @update:modelValue="updateConfig('phoneColor', $event)" />
    <end />
  </div>
</template>
