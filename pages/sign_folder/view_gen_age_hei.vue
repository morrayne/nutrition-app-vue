<script setup lang="ts">
// IMPORT
// vue & ui & type
import { ref, watch, computed } from "vue";
import ui_select from "@/common/form/ui_select.vue";
import number_input from "@/common/form/ui_number.vue";
import type { select_type } from "@/common/form/ui_select.vue";

// CONTENT
// emit
const emit = defineEmits<{
  (e: "change-gender", value: string | number): void;
  (e: "change-age", value: number): void;
  (e: "change-height", value: number): void;
  (e: "set-max", value: number): void;
  (e: "set-min", value: number): void;
  (e: "set-err", value: string): void;
}>();
// vars
const age_value = ref<number | null>(null);
const height_value = ref<number | null>(null);
const gender_value = ref<string>("male");
// computed валидации
const isValidAge = computed(() => {
  if (age_value.value === null) return false;
  return age_value.value >= 14 && age_value.value <= 80;
});
const isValidHeight = computed(() => {
  if (height_value.value === null) return false;
  return height_value.value >= 120 && height_value.value <= 220;
});
const isFormValid = computed(() => {
  return isValidAge.value && isValidHeight.value;
});
// gender options
const genderOptions: select_type[] = [
  { text: "male", value: "male" },
  { text: "female", value: "female" },
];
// watch for validation
watch([age_value, height_value], () => {
  if (isFormValid.value) emit("set-max", 5);
  else emit("set-max", 3);
  emit("set-min", 0);
});

// FUNCTION
// selectors
const handleGenderSelect = (value: string | number) => {
  gender_value.value = value as string;
  emit("change-gender", value);
};
const handleAgeInput = (value: number | null) => {
  if (value === null) {
    age_value.value = null;
    return;
  }
  age_value.value = value;
  if (isValidAge.value) emit("change-age", value);
  else emit("set-err", "age-between-14-and-80");
};
const handleHeightInput = (value: number | null) => {
  if (value === null) {
    height_value.value = null;
    return;
  }
  height_value.value = value;
  if (isValidHeight.value) emit("change-height", value);
  else emit("set-err", "height-between-120-and-220");
};
</script>

<template>
  <div class="gender-age-height">
    <number_input :width_text="45" :width_value="55" text="age" placeholder="21" @input="handleAgeInput" />
    <number_input :width_text="45" :width_value="55" text="height" placeholder="180" @input="handleHeightInput" />
    <p class="gender"></p>
    <ui_select :options="genderOptions" @select="handleGenderSelect" /> 
  </div>
</template>

<style scoped lang="scss">
.gender-age-height {
  width: 100%;
  display: flex;
  flex-direction: column;

  .gender {
    font-size: var(--mm);
    margin-left: 1.5rem;
    color: var(--text-b);
  }
  
  .gender::after {
    content: var(--gender);
  }
}
</style>
