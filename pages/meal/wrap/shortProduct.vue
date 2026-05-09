<script setup lang="ts">
import { computed } from "vue";
import { X, PlusCircle, MinusCircle } from "@lucide/vue";

import type { tProductSaved } from "../../../appSettings/types/food";

const props = defineProps<{
  weight: number;
  quantity: number;
  construct: tProductSaved;
  active?: boolean;
}>();
const emits = defineEmits<{
  (e: "update:weight", value: number): void;
  (e: "update:quantity", value: number): void;
  (e: "delete", value: number): void;
  (e: "main", value: tProductSaved): void;
}>();
const weightModel = computed({
  get: () => props.weight,
  set: (value: number) => emits("update:weight", value),
});

import vInput from "../../../components/form/vInput.vue";
import { mealWeight } from "../../../appSettings/export/vInput";

const macros = [
  { title: "shortCalories", data: "calories", color: "var(--pu)" },
  { title: "shortProteins", data: "proteins", color: "var(--pi)" },
  { title: "shortFats", data: "fats", color: "var(--ye)" },
  { title: "shortCarbs", data: "carbs", color: "var(--gr)" },
];

const getMacros = () => {};

const handleQuantityMinus = () => {
  if (!props.construct.id) return;
  if (props.quantity === 1) emits("delete", props.construct.id);
  else emits("update:quantity", props.quantity - 1);
};
const handleQuantityPlus = () => {
  if (props.quantity === 10) return;
  else emits("update:quantity", props.quantity + 1);
};
</script>

<template>
  <div class="product-wrap bounce w-100 flex-c g-05 def-wrap" @click="emits('main', props.construct)" :class="props.active ? 'active' : ''"> 
    <div class="w-100 top">
      <p class="fs-l fw-6 name">{{ props.construct.name }}</p>
      <div class="def-wrap controls" @click.stop>
        <button style="scale: 0.9" @click="emits('delete', props.construct.id!)">
          <X color="var(--sub-color)" />
        </button>
      </div>
    </div>
    <div class="g-05 bot">
      <div class="g-05 a-c item" v-for="(item, index) in macros" :key="item.data">
        <div class="dot" v-if="index !== 0"></div>
        <p class="fs-s fw-4">{{ Number(((Number(props.construct[item.data as keyof tProductSaved]) / 100) * props.weight * props.quantity).toFixed(1)) }} fake</p>
      </div>
    </div>
    <div class="w-100 g-05 foot">
      <vInput :construct="mealWeight" v-model="weightModel" :undercover="true" />
      <div class="h-100 a-c j-b def-wrap">
        <div class="h-100 round" @click="handleQuantityMinus"><MinusCircle color="var(--ex-color)" /></div>
        <p>{{ props.quantity }}</p>
        <div class="h-100 round" @click="handleQuantityPlus"><PlusCircle color="var(--ex-color)" /></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.active {
  border: solid 1px var(--gr);
}
.product-wrap {
  padding: 0.75rem 1rem;
  .foot {
    .def-wrap {
      width: 12rem;
      padding: 0.125rem;
      .round {
        aspect-ratio: 1 / 1;
        svg {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .top {
    .name {
      max-width: 90%;
      display: inline;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden; 
    }
    .controls {
      width: fit-content;
      padding: 0.125rem;
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      opacity: 0;
    }
  }
  .bot {
    .item {
      p {
        color: var(--ex-color);
      }
      .dot {
        width: 0.25rem;
        height: 0.25rem;
        border-radius: 50%;
        background: var(--ex-color);
      }
    }
  }
}
.product-wrap:hover {
  .top .controls {
    opacity: 1;
  }
}
</style>
