<script setup lang="ts">
import { ref } from "vue";
import lorem from "../../ui/lorem.vue";
import rowInput from "../../form/rowInput.vue";
import type { tRowInput } from "../../form/rowInput.vue";
import rowSwitch from "../../form/rowSwitch.vue";
import type { tRowSwitch } from "../../form/rowSwitch.vue";

const name = ref("");
const weight = ref<number | undefined>(undefined);
const size = ref("full-size");
const proteins = ref<number | undefined>(undefined);
const fats = ref<number | undefined>(undefined);
const carbs = ref<number | undefined>(undefined);
const calories = ref<number | undefined>(undefined);
const save = ref("save");
const log = ref("send");
let firstCaloriesCalc = true;

const nameProduct: tRowInput = {
  title: "product-name",
  data: {
    type: "string",
    placeholder: "product-name",
  },
  rule: {
    string: {
      minLength: 2,
      maxLength: 24,
      noToContain: ["@", "#", "$", "%"],
    },
  },
};
const weightProduct: tRowInput = {
  title: "weight",
  data: {
    type: "number",
    placeholder: "weight",
  },
  rule: {
    number: {
      minValue: 1,
      maxValue: 1000,
    },
  },
};

const sizeProduct: tRowSwitch = {
  title: "full-size",
  data: {
    type: "text",
    start: "on",
    on: "full-size",
    off: "per-100-g",
  },
};

const caloriesProduct: tRowInput = {
  title: "calories",
  data: {
    type: "number",
    placeholder: "calories",
  },
  rule: {
    number: {
      minValue: 0,
      maxValue: 5000
    },
  },
};

const proteinsProduct: tRowInput = {
  title: "proteins",
  data: {
    type: "number",
    placeholder: "proteins",
  },
  rule: {
    number: {
      minValue: 0,
      maxValue: 300
    },
  },
};

const carbsProduct: tRowInput = {
  title: "carbs",
  data: {
    type: "number",
    placeholder: "carbs",
  },
  rule: {
    number: {
      minValue: 0,
      maxValue: 600,
    },
  },
};

const fatsProduct: tRowInput = {
  title: "fats",
  data: {
    type: "number",
    placeholder: "fats",
  },
  rule: {
    number: {
      minValue: 0,
      maxValue: 200,
    },
  },
};

const saveProduct: tRowSwitch = {
  title: "save",
  data: {
    type: "text",
    start: "on",
    on: "save",
    off: "nosave",
  },
};

const logProduct: tRowSwitch = {
  title: "send-to-log",
  data: {
    type: "text",
    start: "on",
    on: "send",
    off: "nosend",
  },
};

const emits = defineEmits<{
  (e: 'create', value: any): void;
}>();
const addRecord = () => {
  if (log.value === 'nosend' && save.value === 'nosave') return
  if (!name.value || !weight.value || !proteins.value || !fats.value || !carbs.value || !calories.value) return
  const weightNum = Number(weight.value);
  const proteinsNum = Number(proteins.value);
  const fatsNum = Number(fats.value);
  const carbsNum = Number(carbs.value);
  const caloriesNum = Number(calories.value);
  let finalValues: any = { name: name.value, weight: weightNum, size: size.value, calories: caloriesNum, proteins: proteinsNum, carbs: carbsNum, fats: fatsNum, save: save.value, log: log.value };
  if (size.value === 'per-100-g') {
    const weightMod = weightNum / 100;
    finalValues = { name: name.value, weight: weightNum, size: size.value, calories: Number((caloriesNum * weightMod).toFixed(1)), proteins: Number((proteinsNum * weightMod).toFixed(1)), carbs: Number((carbsNum * weightMod).toFixed(1)), fats: Number((fatsNum * weightMod).toFixed(1)), save: save.value, log: log.value };
  } else {
    finalValues = { name: name.value, weight: weightNum, size: size.value, calories: Number(caloriesNum.toFixed(1)), proteins: Number(proteinsNum.toFixed(1)), carbs: Number(carbsNum.toFixed(1)), fats: Number(fatsNum.toFixed(1)), save: save.value, log: log.value };
  }
  emits('create', finalValues);
  clearForm();
};

const clearForm = () => {
  name.value = "";
  weight.value = undefined;
  size.value = "full-size";
  proteins.value = undefined;
  fats.value = undefined;
  carbs.value = undefined;
  calories.value = undefined;
  save.value = "save";
  log.value = "send";
  firstCaloriesCalc = true;
};
</script>

<template>
  <div :style="{flexDirection: 'column', gap: '0.75rem'}">
    <lorem />
    <rowInput v-bind="nameProduct" v-model="name" />
    <rowInput v-bind="weightProduct" v-model="weight" />
    <rowSwitch v-bind="sizeProduct" v-model="size" />
    <lorem />
    <rowInput v-bind="proteinsProduct" v-model="proteins" />
    <rowInput v-bind="fatsProduct" v-model="fats" />
    <rowInput v-bind="carbsProduct" v-model="carbs" />
    <lorem />
    <rowInput v-bind="caloriesProduct" v-model="calories" />
    <rowSwitch v-bind="saveProduct" v-model="save" />
    <rowSwitch v-bind="logProduct" v-model="log" />
    <button class="send" @click="addRecord"></button>
  </div>
</template>

<style scoped lang="scss">
.send {
  margin-top: auto;
  font-size: var(--size-m);
  justify-content: center;
  padding: calc(0.75 * var(--newrem)) calc(1.25 * var(--newrem));
  border: solid 1px var(--ex-background);
  border-radius: calc(1.5 * var(--newrem));
  background: var(--sub-background);
  box-shadow: var(--box-shadow);
}

.send::after {
  content: var(--send);
}
</style>
