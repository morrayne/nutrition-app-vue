<script setup lang="ts">
import lorem from "../../ui/lorem.vue";
import end from "../../ui/end.vue";
import rowInput from "../../form/rowInput.vue";
import type { tRowInput } from "../../form/rowInput.vue";
import type { tGoal } from "../../../stores/main/types";

const props = defineProps<{
  modelValue: tGoal;
}>();
const emits = defineEmits<{
  (e: 'update:modelValue', value: tGoal): void;
}>();
const updateGoal = (key: keyof tGoal, value: any) => {
  emits('update:modelValue', { ...props.modelValue, [key]: value });
};

const weight: tRowInput = {
  title: "weight",
  data: {
    type: "number",
    start: 72,
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
    start: 12,
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
    start: 2515,
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
    start: 200,
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
    start: 250,
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
    start: 80,
    placeholder: "fats",
  },
  rule: {
    number: {
      minValue: 60,
      maxValue: 600,
    },
  },
};
</script>

<template>
  <div class="hw100 goal">
    <rowInput v-bind="weight" :modelValue="modelValue.weight" @update:modelValue="updateGoal('weight', $event)" />
    <rowInput v-bind="bodyFat" :modelValue="modelValue.bf" @update:modelValue="updateGoal('bf', $event)" />
    <lorem />
    <rowInput v-bind="calories" :modelValue="modelValue.calories" @update:modelValue="updateGoal('calories', $event)" />
    <rowInput v-bind="proteins" :modelValue="modelValue.proteins" @update:modelValue="updateGoal('proteins', $event)" />
    <rowInput v-bind="fats" :modelValue="modelValue.fats" @update:modelValue="updateGoal('fats', $event)" />
    <rowInput v-bind="carbs" :modelValue="modelValue.carbs" @update:modelValue="updateGoal('carbs', $event)" />
    <end />
  </div>
</template>
