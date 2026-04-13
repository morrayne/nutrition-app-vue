<script setup lang="ts">
import { ref, watch } from "vue";
import localText from "../../ui/localText.vue";
import rowInput from "../../form/rowInput.vue";
import type { tRowInput } from "../../form/rowInput.vue";
import rowSwitch from "../../form/rowSwitch.vue";
import type { tRowSwitch } from "../../form/rowSwitch.vue";

const emits = defineEmits<{
  (e: 'create', value: any): void;
}>();

const name = ref("");
const weight = ref<number | ''>('');
const size = ref("full-size");
const proteins = ref<number | ''>('');
const fats = ref<number | ''>('');
const carbs = ref<number | ''>('');
const calories = ref<number | ''>('');
const save = ref("save");
const log = ref("send");

const nameProduct: tRowInput = {
  title: "product-name",
  data: {
    paddingScale: true,
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
    paddingScale: true,
    displayExternal: false,
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
    size: 's',
    type: "text",
    start: "off",
    on: "per-100-g",
    off: "full-size",
  },
};
const caloriesProduct: tRowInput = {
  title: "calories",
  data: {
    paddingScale: true,
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
    paddingScale: true,
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
    paddingScale: true,
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
    paddingScale: true,
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
    size: 's',
    type: "text",
    start: "on",
    on: "save",
    off: "nosave",
  },
};
const logProduct: tRowSwitch = {
  title: "send-to-log",
  data: {
    size: 's',
    type: "text",
    start: "on",
    on: "send",
    off: "nosend",
  },
};

const addRecord = () => {
  if (log.value === 'nosend' && save.value === 'nosave') return;
  if (!name.value || !weight.value || !calories.value) return;
  const weightNum = Number(weight.value);
  const proteinsNum = Number(proteins.value);
  const fatsNum = Number(fats.value);
  const carbsNum = Number(carbs.value);
  const caloriesNum = Number(calories.value);
  let finalValues = { name: name.value, weight: weightNum, size: size.value, calories: Number(caloriesNum.toFixed(1)), proteins: Number(proteinsNum.toFixed(1)), carbs: Number(carbsNum.toFixed(1)), fats: Number(fatsNum.toFixed(1)), save: save.value, log: log.value }
  if (size.value === 'per-100-g') {
    const weightMod = weightNum / 100;
    finalValues = { name: name.value, weight: weightNum, size: size.value, calories: Number((caloriesNum * weightMod).toFixed(1)), proteins: Number((proteinsNum * weightMod).toFixed(1)), carbs: Number((carbsNum * weightMod).toFixed(1)), fats: Number((fatsNum * weightMod).toFixed(1)), save: save.value, log: log.value };
  }
  emits('create', finalValues);
  clearForm();
};
const clearForm = () => {
  name.value = "";
  weight.value = '';
  size.value = "full-size";
  proteins.value = '';
  fats.value = '';
  carbs.value = '';
  calories.value = '';
  save.value = "save";
  log.value = "send";
};

let caloriesTimer: any = null;
watch([proteins, fats, carbs], () => {
  if (caloriesTimer) clearTimeout(caloriesTimer);
  caloriesTimer = setTimeout(() => {
    if (proteins.value !== '' && fats.value !== '' && carbs.value !== '') {
      const calculated = (proteins.value || 0) * 4 + (carbs.value || 0) * 4 + (fats.value || 0) * 9;
      calories.value = Number(calculated.toFixed(1));
    }
  }, 500);
});
</script>

<template>
  <rowSwitch v-bind="sizeProduct" v-model="size" />
  <localText text="recal-product-desc" :wrap="true" size="s" />
  <div class="mini-wrap pre-asset">
    <div class="top">
      <rowInput v-bind="nameProduct" v-model="name" style="width: 70%" />
      <rowInput v-bind="weightProduct" v-model="weight" style="width: 30%" />
    </div>
    <div class="bot">
      <rowInput v-bind="proteinsProduct" v-model="proteins" />
      <rowInput v-bind="fatsProduct" v-model="fats" />
      <rowInput v-bind="carbsProduct" v-model="carbs" />
      <rowInput v-bind="caloriesProduct" v-model="calories" />
    </div>
  </div>
  <rowSwitch v-bind="saveProduct" v-model="save" />
  <localText text="save-product-desc" :wrap="true" size="s" />
  <rowSwitch v-bind="logProduct" v-model="log" />
  <localText text="log-product-desc" :wrap="true" size="s" />
  <button class="send" @click="addRecord"></button>
</template>

<style scoped lang="scss">
.pre-asset {
  padding: 0.75rem;
  flex-direction: column;
  gap: 0.5rem;
  input {
    border-radius: 2rem;
    background: var(--ex-background);
    padding: 0.25rem 0.5rem;
  }
  .top {
    gap: 0.5rem;
    .name {
      width: 70%;
    }
    .gram {
      width: 30%;
    }
  }
  .bot {
    width: 100%;
    display: grid;
    gap: 0.5rem;
    grid-template-columns: repeat(2, 1fr);
    input {
      width: 100%;
    }
  }
}
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
