<script setup lang="ts">
// IMPORT
// vue
import { computed } from "vue";
// component
import sel from "@/common/form/sel.vue";
import swh from "@/common/form/swh.vue";
import endUp from "./endUp.vue";
// type
import type { tSel, tSelOpt } from "@/common/form/sel.vue";
import type { tSwh } from "@/common/form/swh.vue";
import type { tConfig } from "../../stores/types";

// CONTENT
// props & emits
const props = defineProps<{
  modelValue: tConfig 
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: tConfig): void
}>()
// language
const avaliableLang: tSelOpt[] = [
  { title: "russian", toEmit: "ru" },
  { title: "english", toEmit: "en" },
  { title: "espaniol", toEmit: "es" },
  { title: "mandarin", toEmit: "zh" },
];
const languageModel = computed({
  get: () => props.modelValue.language,
  set: (val) => emit('update:modelValue', { ...props.modelValue, language: val })
})
const lang: tSel = {
  title: "language",
  data: {
    type: "text" as const,
    start: avaliableLang.findIndex(opt => opt.toEmit === props.modelValue.language),
    options: avaliableLang,
  },
};
// theme
const themeModel = computed({
  get: () => props.modelValue.theme,
  set: (val) => emit('update:modelValue', { ...props.modelValue, theme: val })
})
const theme: tSwh = {
  title: "dark-theme",
  data: {
    type: "text" as const,
    start: props.modelValue.theme === "dark" ? "on" : "off",
    on: "dark",
    off: "light",
  },
};
// phone color
const avaliablePhoneColor: tSelOpt[] = [
  { title: "black", toEmit: "black" },
  { title: "white", toEmit: "white" },
  { title: "green", toEmit: "green" },
  { title: "blue", toEmit: "blue" },
  { title: "purple", toEmit: "purple" },
];
const phoneColorModel = computed({
  get: () => props.modelValue.phone_color,
  set: (val) => emit('update:modelValue', { ...props.modelValue, phone_color: val })
})
const phoneColor: tSel = {
  title: "phone-color",
  data: {
    type: "text" as const,
    start: avaliablePhoneColor.findIndex(opt => opt.toEmit === props.modelValue.phone_color),
    options: avaliablePhoneColor,
  },
};
// mm
const avaliableMm: tSelOpt[] = [
  { title: "very-small", toEmit: 14 },
  { title: "small", toEmit: 15 },
  { title: "medium", toEmit: 16 },
  { title: "big", toEmit: 17 },
  { title: "large", toEmit: 18 },
];
const mmModel = computed({
  get: () => props.modelValue.mm,
  set: (val) => emit('update:modelValue', { ...props.modelValue, mm: val })
})
const mm: tSel = {
  title: "font-size",
  data: {
    type: "number" as const,
    start: avaliableMm.findIndex(opt => opt.toEmit === Number(props.modelValue.mm)),
    options: avaliableMm,
  },
};
</script>

<template>
  <div class="v">
    <sel v-bind="lang" v-model="languageModel" />
    <sel v-bind="mm" v-model="mmModel" />
    <swh v-bind="theme" v-model="themeModel" />
    <sel v-bind="phoneColor" v-model="phoneColorModel" />
    <endUp />
  </div>
</template>
