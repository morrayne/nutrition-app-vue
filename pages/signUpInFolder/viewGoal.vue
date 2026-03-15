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

// CONTENT
// props & emits
const props = defineProps<{
  modelValue: tGoal;
  body: tBody;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", value: tGoal): void;
  (e: "set-max", value: number): void;
  (e: "set-min", value: number): void;
  (e: "set-err", value: string): void;
}>();
// weight
const goalWeightModel = computed({
  get: () => props.modelValue.weight,
  set: (val) => emit("update:modelValue", { ...props.modelValue, weight: val }),
});
const goalWeight: tInp = {
  title: "weight",
  data: {
    type: "number" as const,
    start: props.modelValue.weight,
  },
  width: {
    left: 50,
    right: 50,
  },
};
// body fat
const goalBfModel = computed({
  get: () => props.modelValue.bf,
  set: (val) => emit("update:modelValue", { ...props.modelValue, bf: val }),
});
const goalBf: tInp = {
  title: "body-fat",
  data: {
    type: "number" as const,
    start: props.modelValue.bf,
  },
  width: {
    left: 50,
    right: 50,
  },
};
// calories
const caloriesModel = computed({
  get: () => props.modelValue.calories,
  set: (val) => emit("update:modelValue", { ...props.modelValue, calories: val }),
});
const calories: tInp = {
  title: "calories",
  data: {
    type: "number" as const,
    start: props.modelValue.calories,
  },
  width: {
    left: 50,
    right: 50,
  },
};
// proteins
const proteinsModel = computed({
  get: () => props.modelValue.proteins,
  set: (val) => emit("update:modelValue", { ...props.modelValue, proteins: val }),
});
const proteins: tInp = {
  title: "proteins",
  data: {
    type: "number" as const,
    start: props.modelValue.proteins,
  },
  width: {
    left: 50,
    right: 50,
  },
};
// carbs
const carbsModel = computed({
  get: () => props.modelValue.carbs,
  set: (val) => emit("update:modelValue", { ...props.modelValue, carbs: val }),
});
const carbs: tInp = {
  title: "carbs",
  data: {
    type: "number" as const,
    start: props.modelValue.carbs,
  },
  width: {
    left: 50,
    right: 50,
  },
};
// fats
const fatsModel = computed({
  get: () => props.modelValue.fats,
  set: (val) => emit("update:modelValue", { ...props.modelValue, fats: val }),
});
const fats: tInp = {
  title: "fats",
  data: {
    type: "number" as const,
    start: props.modelValue.fats,
  },
  width: {
    left: 50,
    right: 50,
  },
};

// CALCULATION
const calculateBMR = (weight: number, height: number, age: number, gender: string): number => {
  if (gender === 'male') return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
  else return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
}
const calculateMacros = (goalWeight: number | null, goalBf: number | null, bodyData: tBody) => {
  if (!goalWeight || !goalBf || !bodyData.height || !bodyData.age || !bodyData.gender || !bodyData.activity) {
    return null
  }
  const bmr = calculateBMR(goalWeight, bodyData.height, bodyData.age, bodyData.gender)
  const tdee = bmr * bodyData.activity
  let proteinMultiplier = 2.0 
  if (goalBf < 12) {
    proteinMultiplier = 2.4
  } else if (goalBf < 18) {
    proteinMultiplier = 2.2
  } else if (goalBf > 25) {
    proteinMultiplier = 1.8
  }
  const proteins = Math.round(goalWeight * proteinMultiplier)
  const fats = Math.round(goalWeight * 1)
  const calories = Math.round(tdee)
  const carbs = Math.round((calories - (proteins * 4) - (fats * 9)) / 4)
  return { calories, proteins, carbs, fats }
}
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
    emit("update:modelValue", { ...props.modelValue, calories: macros.calories, proteins: macros.proteins, carbs: macros.carbs, fats: macros.fats });
    nextTick(() => { isAutoUpdating.value = false });
  }
}, { deep: true });

// VALIDATION
// weight
const isValidGoalWeight = computed(() => {
  const val = props.modelValue.weight;
  if (val === null || val === undefined) return false;
  return val >= 30 && val <= 250;
});
// body fat
const isValidGoalBf = computed(() => {
  const val = props.modelValue.bf;
  if (val === null || val === undefined) return false;
  return val >= 3 && val <= 50;
});
// calories
const isValidCalories = computed(() => {
  const val = props.modelValue.calories;
  if (val === null || val === undefined) return false;
  return val >= 1200 && val <= 5000;
});
// proteins
const isValidProteins = computed(() => {
  const val = props.modelValue.proteins;
  if (val === null || val === undefined) return false;
  return val >= 30 && val <= 300;
});
// carbs
const isValidCarbs = computed(() => {
  const val = props.modelValue.carbs;
  if (val === null || val === undefined) return false;
  return val >= 50 && val <= 600;
});
// fats
const isValidFats = computed(() => {
  const val = props.modelValue.fats;
  if (val === null || val === undefined) return false;
  return val >= 20 && val <= 200;
});
// 
const allowToGo = computed(() => {
  return isValidGoalWeight.value && isValidGoalBf.value && isValidCalories.value && isValidProteins.value && isValidCarbs.value && isValidFats.value;
});
watch(allowToGo, (newVal) => {
  if (newVal) emit("set-max", 3);
  else emit("set-max", 2);
  emit("set-min", 0);
});
</script>

<template>
  <div class="v">
    <inp v-bind="goalWeight" v-model="goalWeightModel!" />
    <inp v-bind="goalBf" v-model="goalBfModel!" />
    <inp v-bind="calories" v-model="caloriesModel!" />
    <inp v-bind="proteins" v-model="proteinsModel!" />
    <inp v-bind="carbs" v-model="carbsModel!" />
    <inp v-bind="fats" v-model="fatsModel!" />
    <endUp />
  </div>
</template>
