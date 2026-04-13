<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import sparks from "../../../src/svg/signup/sparks.vue";
import end from "../../ui/end.vue";
import rowInput from "../../form/rowInput.vue";
import type { tRowInput } from "../../form/rowInput.vue";
import type { tBody, tGoal } from "../../../stores/main/types";

const props = defineProps<{
  modelValue: tGoal;
  body: tBody
}>();
const emits = defineEmits<{
  (e: 'update:modelValue', value: tGoal): void;
}>();

const weight: tRowInput = {
  title: "weight",
  data: {
    type: "number",
    start: undefined,
    placeholder: "weight",
  },
  rule: {
    number: {
      minValue: 30,
      maxValue: 180,
    },
  },
};
const bodyFat: tRowInput = {
  title: "body-fat",
  data: {
    type: "number",
    start: undefined,
    placeholder: "body-fat",
  },
  rule: {
    number: {
      minValue: 5,
      maxValue: 50,
    },
  },
};
const calories: tRowInput = {
  title: "calories",
  data: {
    type: "number",
    start: undefined,
    placeholder: "calories",
  },
  rule: {
    number: {
      minValue: 1200,
      maxValue: 5000
    },
  },
};
const proteins: tRowInput = {
  title: "proteins",
  data: {
    type: "number",
    start: undefined,
    placeholder: "proteins",
  },
  rule: {
    number: {
      minValue: 30,
      maxValue: 300
    },
  },
};
const carbs: tRowInput = {
  title: "carbs",
  data: {
    type: "number",
    start: undefined,
    placeholder: "carbs",
  },
  rule: {
    number: {
      minValue: 60,
      maxValue: 600,
    },
  },
};
const fats: tRowInput = {
  title: "fats",
  data: {
    type: "number",
    start: undefined,
    placeholder: "fats",
  },
  rule: {
    number: {
      minValue: 60,
      maxValue: 600,
    },
  },
};

import errorManager from "../signupFolder/errorManager.vue";
import type { err } from "../signupFolder/errorManager.vue";
import LocalText from "../../ui/localText.vue";
const errorV = ref<err | undefined>({
  interaction: "nothing",
  page: 0,
  field: 'test',
  text: [],
  errValue: '',
});
const updateError = (data: err) => {
  errorV.value = data;
};

const isUpdatingFromMacros = ref(false);
const calculateMacros = () => {
  let newCalories = 0;
  let newProteins = 0;
  let newFats = 0;
  let newCarbs = 0;
  // Базовый метаболизм на ТЕКУЩИЙ вес
  const genderMod = props.body.gender === 'male' ? 5 : -161;
  const bmr = 10 * props.body.weight! + 6.25 * props.body.height! - 5 * props.body.age! + genderMod;
  const tdee = bmr * props.body.activity;
  // Определяем цель по разнице текущего и целевого веса
  const weightDiff = props.modelValue.weight! - props.body.weight!;
  let calorieAdjustment = 0;
  // Похудение
  if (weightDiff < 0) calorieAdjustment = -Math.min(500, Math.abs(weightDiff) * 80);
  // Набор
  else calorieAdjustment = Math.min(300, weightDiff * 80);
  newCalories = Math.round(tdee + calorieAdjustment);
  // Целевая сухая масса (на основе целевого веса и целевого % жира)
  const targetBodyFatPercent = props.modelValue.bf! / 100;
  const targetLeanMass = props.modelValue.weight! * (1 - targetBodyFatPercent);
  // БЕЛКИ (на целевую сухую массу)
  let proteinPerKg = 2.2;
  if (calorieAdjustment > 0) proteinPerKg = 1.8;
  newProteins = Math.round(targetLeanMass * proteinPerKg);
  // ЖИРЫ (на целевой вес)
  let fatPerKg = props.body.gender === 'male' ? 0.9 : 1.0;
  // При похудении меньше жиров
  if (calorieAdjustment < 0) fatPerKg = 0.8;
  newFats = Math.round(props.modelValue.weight! * fatPerKg);
  // УГЛЕВОДЫ (оставшиеся калории)
  const proteinCalories = newProteins * 4;
  const fatsCalories = newFats * 9;
  const carbsCalories = newCalories - proteinCalories - fatsCalories;
  newCarbs = Math.round(Math.max(50, carbsCalories / 4));
  // Вставка значений в инпуты
  const result = { calories: newCalories, proteins: newProteins, fats: newFats, carbs: newCarbs };
  isUpdatingFromMacros.value = true;
  emits('update:modelValue', { ...props.modelValue, ...result });
  nextTick(() => { isUpdatingFromMacros.value = false });
};

const isManualEdit = ref(false);
let manualEditTimer: any = null;
const updateGoal = (key: keyof tGoal, value: any) => {
  if (key === 'calories' || key === 'proteins' || key === 'fats' || key === 'carbs') {
    isManualEdit.value = true;
    if (manualEditTimer) clearTimeout(manualEditTimer);
    manualEditTimer = setTimeout(() => {
      isManualEdit.value = false;
    }, 3000);
  }
  emits('update:modelValue', { ...props.modelValue, [key]: value });
};

watch(() => [props.modelValue.weight, props.modelValue.bf], () => {
  if (isManualEdit.value) return;
  if (!props.body.weight || !props.body.age || !props.body.height || isUpdatingFromMacros.value) return
  if (props.modelValue.weight && props.modelValue.bf) calculateMacros();
}, { deep: true });
</script>

<template>
  <div class="hw100 goal">
    <errorManager :error="errorV" />
    <div class="grand-svg-holder">
      <sparks color="bl" :rotate="0" />
    </div>
    <rowInput v-bind="weight" :modelValue="modelValue.weight" @update:modelValue="updateGoal('weight', $event)" @err="updateError" />
    <rowInput v-bind="bodyFat" :modelValue="modelValue.bf" @update:modelValue="updateGoal('bf', $event)" @err="updateError" />
    <LocalText text="we-start-you-finish" size="s" :wrap="true" />
    <rowInput v-bind="calories" :modelValue="modelValue.calories" @update:modelValue="updateGoal('calories', $event)" @err="updateError" />
    <rowInput v-bind="proteins" :modelValue="modelValue.proteins" @update:modelValue="updateGoal('proteins', $event)" @err="updateError" />
    <rowInput v-bind="fats" :modelValue="modelValue.fats" @update:modelValue="updateGoal('fats', $event)" @err="updateError" />
    <rowInput v-bind="carbs" :modelValue="modelValue.carbs" @update:modelValue="updateGoal('carbs', $event)" @err="updateError" />
    <end />
  </div>
</template>
