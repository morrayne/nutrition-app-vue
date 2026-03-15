<script setup lang="ts">
// IMPORT
// vue
import { computed, watch } from "vue";
// component
import inp from "@/common/form/inp.vue";
import sel from "@/common/form/sel.vue";
import endUp from "./endUp.vue";
// type
import type { tInp } from "@/common/form/inp.vue";
import type { tSel, tSelOpt } from "@/common/form/sel.vue";
import type { tBody } from "../../stores/types";

// CONTENT
// props & emits
const props = defineProps<{
  modelValue: tBody
}>()
const emits = defineEmits<{
  (e: 'update:modelValue', value: tBody): void;
   (e: 'set-max', value: number): void
  (e: 'set-min', value: number): void
  (e: 'set-err', value: string): void
}>()
// gender
const genderModel = computed({
  get: () => props.modelValue.gender,
  set: (val) => emits('update:modelValue', { ...props.modelValue, gender: val })
})
const genderOptions: tSelOpt[] = [
  { title: "male", toEmit: "male" },
  { title: "female", toEmit: "female" },
];
const gender: tSel = {
  title: "gender",
  data: {
    type: "text" as const,
    start: genderOptions.findIndex(opt => opt.toEmit === props.modelValue.gender),
    options: genderOptions,
  },
};
// age
const ageModel = computed({
  get: () => props.modelValue.age,
  set: (val) => emits('update:modelValue', { ...props.modelValue, age: val })
})
const age: tInp = {
  title: "age",
  data: {
    type: "number" as const,
    start: props.modelValue.age,
  },
  width: {
    left: 50,
    right: 50
  }
};
// height
const heightModel = computed({
  get: () => props.modelValue.height,
  set: (val) => emits('update:modelValue', { ...props.modelValue, height: val })
})
const height: tInp = {
  title: "height",
  data: {
    type: "number" as const,
    start: props.modelValue.height,
  },
  width: {
    left: 50,
    right: 50
  }
};
// weight
const weightModel = computed({
  get: () => props.modelValue.weight,
  set: (val) => emits('update:modelValue', { ...props.modelValue, weight: val })
})
const weight: tInp = {
  title: "weight",
  data: {
    type: "number" as const,
    start: props.modelValue.weight,
  },
  width: {
    left: 50,
    right: 50
  }
};

// body fat %
const bfModel = computed({
  get: () => props.modelValue.bf,
  set: (val) => emits('update:modelValue', { ...props.modelValue, bf: val })
})
const bf: tInp = {
  title: "body-fat",
  data: {
    type: "number" as const,
    start: props.modelValue.bf,
  },
  width: {
    left: 50,
    right: 50
  }
};
// activity level
const avaliableActivity: tSelOpt[] = [
  { title: "activity-level-1", toEmit: 1.15 },
  { title: "activity-level-2", toEmit: 1.30 },
  { title: "activity-level-3", toEmit: 1.45 },
  { title: "activity-level-4", toEmit: 1.60 },
  { title: "activity-level-5", toEmit: 1.75 },
  { title: "activity-level-6", toEmit: 1.90 },
];
const activityModel = computed({
  get: () => props.modelValue.activity,
  set: (val) => emits('update:modelValue', { ...props.modelValue, activity: val })
})
const activity: tSel = {
  title: "activity-level",
  data: {
    type: "number" as const,
    start: avaliableActivity.findIndex(opt => opt.toEmit === (props.modelValue.activity)),
    options: avaliableActivity,
  },
};

// VALIDATION
// age
const isValidAge = computed(() => {
  const age = props.modelValue.age
  if (!age) return false
  return age >= 13 && age <= 120
})
// height
const isValidHeight = computed(() => {
  const height = props.modelValue.height
  if (!height) return false
  return height >= 100 && height <= 250
})
// weight
const isValidWeight = computed(() => {
  const weight = props.modelValue.weight
  if (!weight) return false
  return weight >= 30 && weight <= 250
})
// body fat
const isValidBodyFat = computed(() => {
  const bf = props.modelValue.bf
  if (bf === null || bf === undefined) return true
  return bf >= 3 && bf <= 50
})
// 
const allowToGo = computed(() => {
  return isValidAge.value && isValidHeight.value && isValidWeight.value && isValidBodyFat.value;
});
watch(allowToGo, (newVal) => {
  if (newVal) emits("set-max", 2);
  else emits("set-max", 1);
  emits("set-min", 0);
});
</script>

<template>
  <div class="v">
    <inp v-bind="age" v-model="ageModel!" />
    <inp v-bind="height" v-model="heightModel!" />
    <sel v-bind="gender" v-model="genderModel!" />
    <inp v-bind="weight" v-model="weightModel!" />
    <inp v-bind="bf" v-model="bfModel!" />
    <sel v-bind="activity" v-model="activityModel" />
    <endUp />
  </div>
</template>
