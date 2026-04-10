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

const getBackground = () => {
  const m = props.meal;
  if (m.calories / 15 <= m.proteins) return "pu";
  if (m.calories / 20 <= m.fats) return "ye";
  else return "gr";
};
const getDotBackground = (data: number) => {
  if (data === 0) return "re";
  if (data === 1) return "pu";
  if (data === 2) return "ye";
  else return "gr";
};

interface macro {
  key: "calories" | "proteins" | "fats" | "carbs";
  label: string;
  color: string;
}
const macros: macro[] = [
  { key: "calories", label: "short-calories", color: "re" },
  { key: "proteins", label: "short-proteins", color: "pu" },
  { key: "fats", label: "short-fats", color: "ye" },
  { key: "carbs", label: "short-carbs", color: "gr" },
];
</script>

<template>
  <div class="mini-wrap asset">
    <div class="top">
      <div class="left"> {{ props.meal.name }} </div>
      <div class="right">
        <edit color="ex-color" :rotate="0" :scale="0.8" v-if="props.edit" />
        <x color="ex-color" :rotate="0" v-if="props.x" />
      </div>
    </div>
    <!-- <div class="mid">
      <div class="left"> {{ props.meal.calories }} </div>
      <localText text="short-calories" size="s" />
      <div class="right"></div>
    </div> -->
    <div class="bot">
      <div class="row" v-for="row in macros" :key="row.color">
        <div class="dot" :style="{background: `var(--${row.color})`}"></div>
        <localText :text="row.key" size="s" />
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
    justify-content: space-between;

    .left {
      font-weight: 500;
      font-size: var(--size-m);
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

  .mid {
    gap: calc(0.6 * var(--size-s));

    .left {
      font-weight: 500;
      font-size: var(--size-s);
    }

    // .right {}
  }

  .bot {
    flex-wrap: wrap;
    gap: calc(0.65 * var(--size-s));

    .row {
      padding: 0.25rem 0.5rem;
      gap: calc(0.65 * var(--size-s));
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

        .b {
          font-size: var(--size-s);
        }

        .val {
          font-size: var(--size-s);
        }
      }
    }
  }
}
</style>
