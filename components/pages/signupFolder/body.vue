<script setup lang="ts">
import lorem from "../../ui/lorem.vue";
import end from "../../ui/end.vue";
import colSelect from "../../form/colSelect.vue";
import type { tColSelect, tColSelectOpt } from "../../form/colSelect.vue";
import rowSelect from "../../form/rowSelect.vue";
import type { tRowSelect, tRowSelectOpt } from "../../form/rowSelect.vue";
import rowInput from "../../form/rowInput.vue";
import type { tRowInput } from "../../form/rowInput.vue";
import type { tBody } from "../../../stores/main/types";

const props = defineProps<{
  modelValue: tBody;
}>();
const emits = defineEmits<{
  (e: 'update:modelValue', value: tBody): void;
}>();
const updateBody = (key: keyof tBody, value: any) => {
  emits('update:modelValue', { ...props.modelValue, [key]: value });
};

const genderOpt: tRowSelectOpt[] = [
  { title: "male", toEmit: "male" },
  { title: "female", toEmit: "female" },
  { title: "none", toEmit: "none" },
];
const gender: tRowSelect = {
  title: "gender",
  data: {
    type: "string",
    start: 0,
    options: genderOpt,
  },
};

const age: tRowInput = {
  title: "age",
  data: {
    type: "number",
    start: 21,
    placeholder: "age",
  },
  rule: {
    number: {
      minValue: 14,
      maxValue: 99,
    },
  },
};

const height: tRowInput = {
  title: "height",
  data: {
    type: "number",
    start: 180,
    placeholder: "height",
  },
  rule: {
    number: {
      minValue: 120,
      maxValue: 220,
    },
  },
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

const activityOpt: tColSelectOpt[] = [
  { title: "activity-level-1", toEmit: "1.05" },
  { title: "activity-level-2", toEmit: "1.20" },
  { title: "activity-level-3", toEmit: "1.35" },
  { title: "activity-level-4", toEmit: "1.50" },
  { title: "activity-level-5", toEmit: "1.65" },
  { title: "activity-level-6", toEmit: "1.80" },
];
const activity: tColSelect = {
  title: "activity-level",
  data: {
    type: "number",
    start: 1,
    options: activityOpt,
  },
};
</script>

<template>
  <div class="hw100 body">
    <lorem />
    <rowSelect v-bind="gender" :modelValue="modelValue.gender" @update:modelValue="updateBody('gender', $event)" />
    <rowInput v-bind="age" :modelValue="modelValue.age" @update:modelValue="updateBody('age', $event)" />
    <rowInput v-bind="height" :modelValue="modelValue.height" @update:modelValue="updateBody('height', $event)" />
    <rowInput v-bind="weight" :modelValue="modelValue.weight" @update:modelValue="updateBody('weight', $event)" />
    <rowInput v-bind="bodyFat" :modelValue="modelValue.bf" @update:modelValue="updateBody('bf', $event)" />
    <colSelect v-bind="activity" :modelValue="modelValue.activity" @update:modelValue="updateBody('activity', $event)" />
    <end />
  </div>
</template>
