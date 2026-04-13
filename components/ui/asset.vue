<script setup lang="ts">
import localText from "./localText.vue";
import type { tSingleMeal } from "../../stores/main/types";
import x from "../../src/svg/x.vue";
import edit from "../../src/svg/edit.vue";

const props = defineProps<{
  meal: tSingleMeal,
  x: boolean,
  edit: boolean
}>();
const emits = defineEmits<{
  (e: 'edit', value: string): void;
  (e: 'delete', value: string): void;
}>();

interface macro {
  key: "calories" | "proteins" | "fats" | "carbs" | "weight";
  label: string;
  color: string;
}
const macros: macro[] = [
  { key: "calories", label: "short-calories", color: "pi" },
  { key: "fats", label: "short-fats", color: "ye" },
  { key: "proteins", label: "short-proteins", color: "pu" },
  { key: "carbs", label: "short-carbs", color: "gr" },
];

const handleEdit = () => {
  if (props.meal.id) emits('edit', props.meal.id);
}
const handleDelete = () => {
  if (props.meal.id) emits('delete', props.meal.id);
}
</script>

<template>
  <div class="mini-wrap asset">
    <div class="top">
      <div class="left"> {{ props.meal.name }} </div>
      <div class="gram"> 
        <p class="num"> {{ props.meal.weight }} </p>
        <localText text="g" size="xs" />  
      </div>
      <div class="right">
        <edit color="ex-color" :rotate="0" :scale="0.8" v-if="props.edit" @click="handleEdit" />
        <x color="ex-color" :rotate="0" v-if="props.x" @click="handleDelete" />
      </div>
    </div>
    <div class="bot">
      <div class="row" v-for="row in macros" :key="row.color">
        <div class="dot" :style="{background: `var(--${row.color})`}"></div>
        <localText :text="row.key" size="xs" />
        <div class="numbers">
          <p class="t"></p>
          <p class="val"> {{ props.meal[row.key] }} </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.asset {
  padding: 0.75rem;
  flex-direction: column;
  gap: 0.5rem;
  .top {
    align-items: center;
    gap: 0.5rem;
    .left {
      max-width: 144px;
      font-weight: 500;
      display: inline-block;
      font-size: var(--size-m);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .gram {
      height: 100%;
      margin-left: auto;
      align-items: center;
      background: var(--ex-background);
      border-radius: 1.5rem;
      padding: 0 0.5rem;
      .num {
        font-size: var(--size-xs);
      }
    }
    .right {
      height: calc(1.5 * var(--size-m));
      background: var(--ex-background);
      border-radius: 1.5rem;
      padding: 0.25rem;
      gap: 0.25rem;
      svg {
        cursor: pointer;
      }
    }
  }
  .bot {
    flex-wrap: wrap;
    gap: 0.5rem;
    .row {
      padding: 0.25rem 0.5rem;
      gap: calc(0.5 * var(--size-s));
      justify-content: space-between;
      align-items: center;
      border: solid 1px var(--ex-background);
      border-radius: 1rem;
      .dot {
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 50%;
        background: var(--ex-background);
      }
      .numbers {
        .val {
          font-size: var(--size-xs);
        }
      }
    }
  }
}
</style>
