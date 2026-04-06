<script setup lang="ts">
import localText from "./localText.vue";
import type { tSingleMeal } from "../../stores/main/types";

const props = defineProps<{ meal: tSingleMeal }>();

const getBackground = () => {
  const m = props.meal;
  if (m.weight / 15 <= m.proteins) return "pu";
  if (m.weight / 20 <= m.fats) return "ye";
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
  <div class="asset">
    <div class="left">
      <div class="dot" :style="{ background: `var(--${getBackground()})` }"></div>
    </div>
    <div class="right">
      <div class="top">
        <p class="name"> {{ props.meal.name }} </p>
        <p class="weight"> {{ props.meal.weight }}g </p>
      </div>
      <div class="bot">
        <div class="stat" v-for="mac in macros">
          <div class="dot"></div>
          <p> {{ props.meal[mac.key] }} </p>
          <localText :text="mac.label" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.asset {
  gap: 0.5rem;
  padding: calc(0.75 * var(--newrem)) calc(1.25 * var(--newrem));
  border: solid 1px var(--ex-background);
  border-radius: calc(1.5 * var(--newrem));
  background: var(--sub-background);
  box-shadow: var(--box-shadow);

  .left {
    align-items: center;
    height: calc(1.5 * var(--size-m));

    .dot {
      height: calc(0.5 * var(--newrem));
      aspect-ratio: 1 / 1;
      border-radius: 50%;
    }
  }

  .right {
    width: 100%;
    flex-direction: column;
    gap: 0.25rem;

    .top {
      width: 100%;
      justify-content: space-between;
      gap: 0.5rem;

      .name, .weight {
        font-weight: 500;
      }
    }

    .bot {
      gap: var(--newrem);
      
      .stat {
        font-size: var(--size-s);

        .dot {

        }

        p {
          font-size: var(--size-s);
        }
      }
    }
  }
}
</style>
