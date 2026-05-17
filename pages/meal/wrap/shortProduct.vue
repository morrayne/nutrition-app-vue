<script setup lang="ts">
import { computed } from "vue";
import { X, PlusCircle, MinusCircle } from "@lucide/vue";

import type { tProductSaved } from "../../../appSettings/export/types/food";

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

import vInputNumber from "../../../components/form/vInputNumber.vue";
import { mealWeight } from "../../../appSettings/export/form/vInputNumber";

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
  <div class="product-wrap bounce-s w-100 flex-c gap-50 main" @click="emits('main', props.construct)" :class="props.active ? 'active' : ''">
    <div class="w-100 top">
      <p class="text-l name">{{ props.construct.name }}</p>
      <div class="main controls" @click.stop>
        <button style="scale: 0.9" @click="emits('delete', props.construct.id!)">
          <X color="var(--sub-color)" />
        </button>
      </div>
    </div>
    <div class="gap-50 bot">
      <div class="gap-50 ali-c item" v-for="(item, index) in macros" :key="item.data">
        <div class="dot" v-if="index !== 0"></div>
        <p class="text-s">{{ Number(((Number(props.construct[item.data as keyof tProductSaved]) / 100) * props.weight * props.quantity).toFixed(1)) }} fake</p>
      </div>
    </div>
    <div class="w-100 gap-50 ali-c gap-50">
      <vInputNumber :construct="mealWeight" v-model="weightModel" :undercover="true" />
      <div class="h-100 ali-c jus-sb main quan">
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
  .main {
    width: 12rem;
    padding: 0.25rem 0.5rem;
    .round {
      aspect-ratio: 1 / 1;
      svg {
        width: 100%;
        height: 100%;
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
