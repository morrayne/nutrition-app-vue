<script setup lang="ts">
// IMPORT
// vue
import { ref, computed, watch, nextTick } from "vue";
// component
import inp from "@/common/form/inp.vue";
import endUp from "./endUp.vue";
// type
import type { tInp } from "@/common/form/inp.vue";
import type { tGoal } from "../../stores/types";
import type { tBody } from "../../stores/types";
import type { tUpdateViewArray } from "../signUpPage.vue";

// CONTENT
// props & emits
const props = defineProps<{
  modelValue: tGoal;
  body: tBody;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", value: tGoal): void;
  (e: "updateViewArray", value: tUpdateViewArray): void;
  (e: "error", value: string[]): void;
}>();
// weight
const goalWeightModel = computed({
  get: () => props.modelValue.weight,
  set: (val) => emits("update:modelValue", { ...props.modelValue, weight: val }),
});
const goalWeight: tInp = {
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
  width: { left: 50, right: 50 },
};
// body fat
const goalBfModel = computed({
  get: () => props.modelValue.bf,
  set: (val) => emits("update:modelValue", { ...props.modelValue, bf: val }),
});
const goalBf: tInp = {
  title: "body-fat",
  data: {
    type: "number" as const,
    start: props.modelValue.bf,
  },
  rule: {
    num: {
      minValue: 5,
      maxValue: 50
    },
  },
  width: { left: 50, right: 50 },
};
// calories
const caloriesModel = computed({
  get: () => props.modelValue.calories,
  set: (val) => emits("update:modelValue", { ...props.modelValue, calories: val }),
});
const calories: tInp = {
  title: "calories",
  data: {
    type: "number" as const,
    start: props.modelValue.calories,
  },
  rule: {
    num: {
      minValue: 1200,
      maxValue: 5000
    },
  },
  width: { left: 50, right: 50 },
};
// proteins
const proteinsModel = computed({
  get: () => props.modelValue.proteins,
  set: (val) => emits("update:modelValue", { ...props.modelValue, proteins: val }),
});
const proteins: tInp = {
  title: "proteins",
  data: {
    type: "number" as const,
    start: props.modelValue.proteins,
  },
  rule: {
    num: {
      minValue: 30,
      maxValue: 300
    },
  },
  width: { left: 50, right: 50 },
};
// carbs
const carbsModel = computed({
  get: () => props.modelValue.carbs,
  set: (val) => emits("update:modelValue", { ...props.modelValue, carbs: val }),
});
const carbs: tInp = {
  title: "carbs",
  data: {
    type: "number" as const,
    start: props.modelValue.carbs,
  },
  rule: {
    num: {
      minValue: 60,
      maxValue: 600
    },
  },
  width: { left: 50, right: 50 },
};
// fats
const fatsModel = computed({
  get: () => props.modelValue.fats,
  set: (val) => emits("update:modelValue", { ...props.modelValue, fats: val }),
});
const fats: tInp = {
  title: "fats",
  data: {
    type: "number" as const,
    start: props.modelValue.fats,
  },
  rule: {
    num: {
      minValue: 10,
      maxValue: 200
    },
  },
  width: { left: 50, right: 50 },
};

// CALCULATION
const calculateBMR = (weight: number, height: number, age: number, gender: string): number => {
  if (gender === 'male') return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
  else return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
}
const calculateMacros = (goalWeight: number | null, goalBf: number | null, bodyData: tBody) => {
  if (!goalWeight || !goalBf || !bodyData.height || !bodyData.age || !bodyData.gender || !bodyData.activity) return null
  const bmr = calculateBMR(goalWeight, bodyData.height, bodyData.age, bodyData.gender)
  const tdee = bmr * bodyData.activity
  let proteinMultiplier = 2.0 
  if (goalBf < 12) proteinMultiplier = 2.4
  else if (goalBf < 18) proteinMultiplier = 2.2
  else if (goalBf > 25) proteinMultiplier = 1.8
  const proteins = Math.round(goalWeight * proteinMultiplier)
  const fats = Math.round(goalWeight * 1)
  const calories = Math.round(tdee)
  const carbs = Math.round((calories - (proteins * 4) - (fats * 9)) / 4)
  return { calories, proteins, carbs, fats }
}
// autoupdate
const isAutoUpdating = ref(false);
watch([() => props.modelValue.weight, () => props.modelValue.bf, () => props.body], ([newWeight, newBf, newBody], [oldWeight, oldBf, oldBody]) => {
  const weightChanged = newWeight !== oldWeight;
  const bfChanged = newBf !== oldBf;
  const bodyChanged = newBody !== oldBody;
  if (isAutoUpdating.value) return;
  if (!weightChanged && !bfChanged && !bodyChanged) return;
  if (!props.modelValue.weight || !props.modelValue.bf || !props.body) return;
  const macros = calculateMacros(props.modelValue.weight, props.modelValue.bf, props.body);
  if (macros) {
    isAutoUpdating.value = true;
    emits("update:modelValue", { 
      ...props.modelValue, 
      calories: macros.calories, 
      proteins: macros.proteins, 
      carbs: macros.carbs, 
      fats: macros.fats 
    });
    nextTick(() => { isAutoUpdating.value = false });
  }
}, { deep: true });

// ERROR
const SCREEN_INDEX = 2;
const hasErrors = ref(false);
const errorMessage = ref<string[]>([]);
const handleError = (err: string[]) => {
  errorMessage.value = [SCREEN_INDEX.toString(), ...err];
  hasErrors.value = err.length > 0;
};

// VALIDATION
watch([() => props.modelValue.weight, () => props.modelValue.bf, () => props.modelValue.calories, () => props.modelValue.proteins, () => props.modelValue.carbs, () => props.modelValue.fats, hasErrors], () => {
  const m = props.modelValue;
  const allFilled = m.weight !== null && m.bf !== null && m.calories !== null && m.proteins !== null && m.carbs !== null && m.fats !== null;
  const canContinue = allFilled && !hasErrors.value;
  if (!canContinue && hasErrors.value) emits('error', errorMessage.value);
  else if (!canContinue && !hasErrors.value) emits('error', [SCREEN_INDEX.toString(), 'fill-form']);
  else emits('error', []);
  emits('updateViewArray', { index: 2, field: 'forward', newValue: canContinue });
}, { deep: true });
</script>

<template>
  <div class="v">
    <inp v-bind="goalWeight" v-model="goalWeightModel!" @error="handleError" />
    <inp v-bind="goalBf" v-model="goalBfModel!" @error="handleError" />
    <inp v-bind="calories" v-model="caloriesModel!" @error="handleError" />
    <inp v-bind="proteins" v-model="proteinsModel!" @error="handleError" />
    <inp v-bind="carbs" v-model="carbsModel!" @error="handleError" />
    <inp v-bind="fats" v-model="fatsModel!" @error="handleError" />
    <endUp />
  </div>
</template>
