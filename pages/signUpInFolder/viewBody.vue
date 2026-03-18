<script setup lang="ts">
// IMPORT
// vue
import { ref, computed, watch } from "vue";
// component
import inp from "@/common/form/inp.vue";
import sel from "@/common/form/sel.vue";
import endUp from "./endUp.vue";
// type
import type { tInp } from "@/common/form/inp.vue";
import type { tSel, tSelOpt } from "@/common/form/sel.vue";
import type { tBody } from "../../stores/types";
import type { tUpdateViewArray } from "../signUpPage.vue";

// CONTENT
// props & emits
const props = defineProps<{
  modelValue: tBody;
}>()
const emits = defineEmits<{
  (e: 'update:modelValue', value: tBody): void;
  (e: 'updateViewArray', value: tUpdateViewArray): void
  (e: 'error', value: string[]): void;
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
  rule: {
    num: {
      minValue: 14,
      maxValue: 80,
    },
  },
  width: { left: 50, right: 50 }
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
  rule: {
    num: {
      minValue: 120,
      maxValue: 220
    },
  },
  width: { left: 50, right: 50 }
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
  rule: {
    num: {
      minValue: 30,
      maxValue: 120
    },
  },
  width: { left: 50, right: 50 }
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
  rule: {
    num: {
      minValue: 3,
      maxValue: 50
    },
  },
  width: { left: 50, right: 50 }
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

// ERROR
const SCREEN_INDEX = 1; 
const hasErrors = ref(false);
const errorMessage = ref<string[]>([]);
const handleError = (err: string[]) => {
  errorMessage.value = [SCREEN_INDEX.toString(), ...err];
  hasErrors.value = err.length > 0;
};

// VALIDATION
watch([() => props.modelValue.age, () => props.modelValue.height, () => props.modelValue.weight, () => props.modelValue.bf, () => props.modelValue.gender, hasErrors], () => {
  const m = props.modelValue;
  const allFilled = m.age !== null && m.height !== null && m.weight !== null && m.bf !== null && m.gender !== null;
  const canContinue = allFilled && !hasErrors.value;
  if (!canContinue && hasErrors.value) emits('error', errorMessage.value);
  else if (!canContinue && !hasErrors.value) emits('error', [SCREEN_INDEX.toString(), 'fill-form']);
  else emits('error', []);
  emits('updateViewArray', { index: 1, field: 'forward', newValue: canContinue });
}, { deep: true, immediate: true });
</script>

<template>
  <div class="v">
    <inp v-bind="age" v-model="ageModel!" @error="handleError" />
    <inp v-bind="height" v-model="heightModel!" @error="handleError" />
    <sel v-bind="gender" v-model="genderModel" />
    <inp v-bind="weight" v-model="weightModel!" @error="handleError" />
    <inp v-bind="bf" v-model="bfModel!" @error="handleError" />
    <sel v-bind="activity" v-model="activityModel" />
    <endUp />
  </div>
</template>
