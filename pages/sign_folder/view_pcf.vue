<script setup lang="ts">
// IMPORT
// vue & ui & type
import { ref, watch, computed } from "vue";
import number_input from "@/common/form/ui_number.vue";
import type { body_type } from "../../stores/useBodyStore";

// CONTENT
// props
const props = defineProps({
  goal: Object,
  body: Object
});
// emit
const emit = defineEmits<{
  (e: "change-kcal", value: number): void;
  (e: "change-proteins", value: number): void;
  (e: "change-carbs", value: number): void;
  (e: "change-fats", value: number): void;
  (e: "set-max", value: number): void;
  (e: "set-min", value: number): void;
  (e: "set-err", value: string): void;
}>();
// Constants
const VALIDATION = {
  kcal: { min: 1200, max: 6000, error: "kcal-between-1200-and-6000" },
  proteins: { min: 30, max: 400, error: "proteins-between-30-and-400" },
  carbs: { min: 50, max: 800, error: "carbs-between-50-and-800" },
  fats: { min: 20, max: 200, error: "fats-between-20-and-200" }
};
// Default values
const body_filler = {
  gender: "male",
  age: 21,
  height: 180,
  activity: 1.4,
  weight: 71,
  bf: 13,
};
// calculation of macros
const calculateMacros = () => {
  // @ts-ignore
  const b: body_type = props.body ? (props.body as body_type) : body_filler;
  if (!b?.weight || !b?.height || !b?.age || !b?.gender || !b?.activity) return null;
  let bmr: number;
  const goalWeight = props.goal?.weight || b.weight;
  if (b.gender === "male") bmr = 88.362 + (13.397 * goalWeight) + (4.799 * b.height) - (5.677 * b.age);
  else bmr = 447.593 + (9.247 * goalWeight) + (3.098 * b.height) - (4.330 * b.age);
  const tdee = bmr * b.activity;
  const proteins = Math.round(goalWeight * 2); 
  const fats = Math.round(goalWeight * 1);     
  const kcal = Math.round(tdee);
  const carbs = Math.round((kcal - (proteins * 4) - (fats * 9)) / 4);
  return { kcal, proteins, carbs, fats };
};
// computed macros
const calculatedMacros = computed(() => calculateMacros());

// vars with computed getters/setters
const kcal = computed({
  get: () => props.goal?.calories || calculatedMacros.value?.kcal || 2000,
  set: (value: number) => {
    emit("change-kcal", value);
  }
});

const proteins = computed({
  get: () => props.goal?.proteins || calculatedMacros.value?.proteins || 120,
  set: (value: number) => {
    emit("change-proteins", value);
  }
});

const carbs = computed({
  get: () => props.goal?.carbs || calculatedMacros.value?.carbs || 250,
  set: (value: number) => {
    emit("change-carbs", value);
  }
});

const fats = computed({
  get: () => props.goal?.fats || calculatedMacros.value?.fats || 70,
  set: (value: number) => {
    emit("change-fats", value);
  }
});

// computed validation 
const isValidKcal = computed(() => kcal.value >= VALIDATION.kcal.min && kcal.value <= VALIDATION.kcal.max);
const isValidProteins = computed(() => proteins.value >= VALIDATION.proteins.min && proteins.value <= VALIDATION.proteins.max);
const isValidCarbs = computed(() => carbs.value >= VALIDATION.carbs.min && carbs.value <= VALIDATION.carbs.max);
const isValidFats = computed(() => fats.value >= VALIDATION.fats.min && fats.value <= VALIDATION.fats.max);

// watch for navigation
watch([kcal, proteins, carbs, fats], () => {
  const valid = isValidKcal.value && isValidProteins.value && isValidCarbs.value && isValidFats.value;
  emit("set-max", valid ? 10 : 5);
  emit("set-min", 0);
}, { immediate: true });

// watch for body changes to update parent with new calculated values
watch(() => props.body, () => {
  const macros = calculatedMacros.value;
  if (macros) {
    // Only emit if goal values aren't already set
    if (!props.goal?.calories) emit("change-kcal", macros.kcal);
    if (!props.goal?.proteins) emit("change-proteins", macros.proteins);
    if (!props.goal?.carbs) emit("change-carbs", macros.carbs);
    if (!props.goal?.fats) emit("change-fats", macros.fats);
  }
}, { deep: true, immediate: true });

// validation helper
const validateAndEmit = (value: number, field: keyof typeof VALIDATION, emitEvent: string) => {
  const rule = VALIDATION[field];
  if (value < rule.min) {
    emit("set-err", rule.error);
    return false;
  }
  if (value > rule.max) {
    emit("set-err", rule.error);
    return false;
  }
  // @ts-ignore
  emit(emitEvent, value);
  return true;
};

// FUNCTION
const handleKcalInput = (value: number) => {
  validateAndEmit(value, "kcal", "change-kcal");
};
const handleProteinsInput = (value: number) => {
  validateAndEmit(value, "proteins", "change-proteins");
};
const handleCarbsInput = (value: number) => {
  validateAndEmit(value, "carbs", "change-carbs");
};
const handleFatsInput = (value: number) => {
  validateAndEmit(value, "fats", "change-fats");
};
</script>

<template>
  <div class="kpcf">
    <number_input :width_text="45" :width_value="55" text="kcal" :start_value="kcal" placeholder="2000" @input="handleKcalInput" />
    <number_input :width_text="45" :width_value="55" text="proteins" :start_value="proteins" placeholder="120" @input="handleProteinsInput" />
    <number_input :width_text="45" :width_value="55" text="carbs" :start_value="carbs" placeholder="250" @input="handleCarbsInput" />
    <number_input :width_text="45" :width_value="55" text="fats" :start_value="fats" placeholder="70" @input="handleFatsInput" />
  </div>
</template>

<style scoped lang="scss">
.kpcf {
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
