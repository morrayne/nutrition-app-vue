<script setup lang="ts">
// IMPORT
// vue & ui
import { ref, watch } from "vue";
import number_input from "@/common/form/ui_number.vue";

// CONTENT
// emit
const emit = defineEmits<{
  (e: "change-current-weight", value: number): void;
  (e: "change-current-bf", value: number): void;
  (e: "change-goal-weight", value: number): void;
  (e: "change-goal-bf", value: number): void;
  (e: "set-max", value: number): void;
  (e: "set-min", value: number): void;
  (e: "set-err", value: string): void;
}>();
// vars
const current_weight = ref<number | null>(null);
const current_bf = ref<number | null>(null);
const goal_weight = ref<number | null>(null);
const goal_bf = ref<number | null>(null);

// WATCH
// to allow user to continue
watch([current_weight, current_bf, goal_weight, goal_bf], () => {
  if (current_weight.value !== null && current_bf.value !== null && goal_weight.value !== null && goal_bf.value !== null) {
    emit("set-max", 10);
    emit("set-min", 0);
  } else {
    emit("set-max", 5);
    emit("set-min", 0);
  }
});

// FUNCTION
// return current weight
const handleCurrentWeightInput = (value: number) => {
  if (value < 30) emit("set-err", "weight-less-than-30");
  else if (value > 150) emit("set-err", "weight-greater-than-150");
  else {
    current_weight.value = value;
    emit("change-current-weight", value);
  }
};
// return current bf
const handleCurrentBfInput = (value: number) => {
  if (value < 5) emit("set-err", "bf-less-than-5");
  else if (value > 30) emit("set-err", "bf-greater-than-30");
  else {
    current_bf.value = value;
    emit("change-current-bf", value);
  }
};
// return goal weight
const handleGoalWeightInput = (value: number) => {
  if (value < 30) emit("set-err", "weight-less-than-30");
  else if (value > 150) emit("set-err", "weight-greater-than-150");
  else {
    goal_weight.value = value;
    emit("change-goal-weight", value);
  }
};
// return goal bf
const handleGoalBfInput = (value: number) => {
  if (value < 5) emit("set-err", "bf-less-than-5");
  else if (value > 30) emit("set-err", "bf-greater-than-30");
  else {
    goal_bf.value = value;
    emit("change-goal-bf", value);
  }
};
</script>

<template>
  <div class="weight-bf">
    <p class="current"></p>
    <number_input :width_text="45" :width_value="55" text="weight" placeholder="71" @input="handleCurrentWeightInput" />
    <number_input :width_text="45" :width_value="55" text="bf" placeholder="13" @input="handleCurrentBfInput" />
    <p class="target"></p>
    <number_input :width_text="45" :width_value="55" text="weight" placeholder="82" @input="handleGoalWeightInput" />
    <number_input :width_text="45" :width_value="55" text="bf" placeholder="10" @input="handleGoalBfInput" />
  </div>
</template>

<style scoped lang="scss">
.weight-bf {
  width: 100%;
  display: flex;
  flex-direction: column;

  .current, .target {
    font-size: var(--mm);
    margin-left: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .target {
    color: var(--text-b);
  }
  
  .target::after {
    content: var(--target);
  }

  .current {
    color: var(--text-b);
  }
  
  .current::after {
    content: var(--current);
  }
}
</style>
