<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useAssetStore } from "../stores";
import { useAuthStore } from "../stores";
import { useHistoryStore } from "../stores";
import endUp from "./signUpInFolder/endUp.vue";
import swh from "@/common/form/swh.vue";
import inp from "@/common/form/inp.vue";
import sel from "@/common/form/sel.vue";
import type { tSwh } from "@/common/form/swh.vue";
import type { tInp } from "@/common/form/inp.vue";
import type { tSel, tSelOpt } from "@/common/form/sel.vue";
const authStore = useAuthStore();
const assetStore = useAssetStore();
const historyStore = useHistoryStore();
const record = ref({
  save: "temp" as "temp" | "perm",
  productName: "",
  calories: 0,
  proteins: 0,
  carbs: 0,
  fats: 0,
  portionType: "full-portion" as "full-portion" | "per-100-g",
  weight: 100,
});
let firstCaloriesCalc = true;
const save: tSwh = {
  title: "save-asset",
  data: {
    type: "text" as const,
    start: "off",
    on: "perm",
    off: "temp",
  },
};
const avaliableWeight: tSelOpt[] = [
  { title: "full-portion", toEmit: "full-portion" },
  { title: "per-100-g", toEmit: "per-100-g" },
];
const portionType: tSel = {
  title: "portion-size",
  data: {
    type: "text" as const,
    start: 0,
    options: avaliableWeight,
  },
};
const weightInp: tInp = {
  title: "weight",
  data: {
    type: "number" as const,
    start: 100,
  },
  rule: {
    num: {
      minValue: 1,
      maxValue: 5000
    },
  },
  width: { left: 65, right: 35 },
};
const productName: tInp = {
  title: "product-name",
  data: {
    type: "text" as const,
    start: '',
  },
  rule: {
    str: {
      minLength: 2,
      maxLength: 24,
    },
  },
  width: { left: 65, right: 35 },
};
const proteins: tInp = {
  title: "proteins",
  data: {
    type: "number" as const,
    start: 0,
  },
  rule: {
    num: {
      minValue: 0,
      maxValue: 300
    },
  },
  width: { left: 65, right: 35 },
};
const carbs: tInp = {
  title: "carbs",
  data: {
    type: "number" as const,
    start: 0,
  },
  rule: {
    num: {
      minValue: 0,
      maxValue: 600
    },
  },
  width: { left: 65, right: 35 },
};
const fats: tInp = {
  title: "fats",
  data: {
    type: "number" as const,
    start: 0,
  },
  rule: {
    num: {
      minValue: 0,
      maxValue: 200
    },
  },
  width: { left: 65, right: 35 },
};
const calories: tInp = {
  title: "calories",
  data: {
    type: "number" as const,
    start: 0,
  },
  rule: {
    num: {
      minValue: 0,
      maxValue: 5000
    },
  },
  width: { left: 65, right: 35 },
};
watch([() => record.value.proteins, () => record.value.carbs, () => record.value.fats], 
  ([newProteins, newCarbs, newFats]) => {
    if (firstCaloriesCalc && newProteins > 0 && newCarbs > 0 && newFats > 0) {
      const calculated = newProteins * 4 + newCarbs * 4 + newFats * 9;
      record.value.calories = calculated;
      firstCaloriesCalc = false;
    }
  }
);
const finalValues = computed(() => {
  const r = record.value;
  if (r.portionType === "full-portion") {
    return {
      calories: r.calories,
      proteins: r.proteins,
      carbs: r.carbs,
      fats: r.fats,
      weight: r.weight
    };
  } else {
    const factor = r.weight / 100;
    return {
      calories: Math.round(r.calories * factor),
      proteins: Math.round(r.proteins * factor),
      carbs: Math.round(r.carbs * factor),
      fats: Math.round(r.fats * factor),
      weight: r.weight
    };
  }
});
const addRecord = () => {
  const { calories, proteins, carbs, fats, weight } = finalValues.value;
  const todaysMeal = { productName: record.value.productName, calories, proteins, carbs, fats, weight: weight, type: record.value.save === "perm" ? "perm" : "temp" };
  if (record.value.save === "perm") {
    // save as asset
    // assetStore.addAsset(authStore.userId!, todaysMeal)
  }
  record.value = {
    save: "temp",
    productName: "",
    calories: 0,
    proteins: 0,
    carbs: 0,
    fats: 0,
    portionType: "full-portion",
    weight: 100,
  };
  firstCaloriesCalc = true;
};
</script>

<template>
  <div class="screen meal">
    <inp v-bind="productName" v-model="record.productName" />
    <sel v-bind="portionType" v-model="record.portionType" />
    <inp v-bind="proteins" v-model="record.proteins" />
    <inp v-bind="carbs" v-model="record.carbs" />
    <inp v-bind="fats" v-model="record.fats" />
    <inp v-bind="calories" v-model="record.calories" />
    <inp v-bind="weightInp" v-model="record.weight" />
    <swh v-bind="save" v-model="record.save" />
    <button @click="addRecord" class="add-btn"></button>
    <endUp />
  </div>
</template>

<style scoped lang="scss">
.meal {
  padding: var(--mm);
  gap: var(--mm);
  overflow-y: scroll;

  .add-btn {
    color: var(--signup-main-text);
    background: var(--signup-sub-background);
    padding: calc(0.75 * var(--mm)) calc(1.5 * var(--mm));
    font-size: var(--mm);
    border-radius: 2rem;
    border: solid 1px var(--signup-main-border);
    box-shadow: var(--box-shadow);
    backdrop-filter: blur(6px);
  }

  .add-btn::after {
    content: var(--continue);
  }
}
.meal::-webkit-scrollbar {
  display: none;
}
</style>
